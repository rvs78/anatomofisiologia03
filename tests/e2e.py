"""Partida completa amb esdeveniments tàctils reals (CDP), errors provocats i una pista.
Ús: python3 tests/e2e.py http://localhost:8000/ [carpeta_captures] [ca|es] [amplada] [alçada]
"""
import asyncio, sys, os
from playwright.async_api import async_playwright

URL = sys.argv[1] if len(sys.argv) > 1 else 'http://localhost:8000/'
OUT = sys.argv[2] if len(sys.argv) > 2 else 'shots'
LANG = sys.argv[3] if len(sys.argv) > 3 else 'ca'
W = int(sys.argv[4]) if len(sys.argv) > 4 else 1920
H = int(sys.argv[5]) if len(sys.argv) > 5 else 1080
os.makedirs(OUT, exist_ok=True)


async def touch_drag(cdp, a, b, steps=12):
    await cdp.send('Input.dispatchTouchEvent', {'type': 'touchStart', 'touchPoints': [{'x': a[0], 'y': a[1], 'id': 1}]})
    for i in range(1, steps + 1):
        x = a[0] + (b[0] - a[0]) * i / steps
        y = a[1] + (b[1] - a[1]) * i / steps
        await cdp.send('Input.dispatchTouchEvent', {'type': 'touchMove', 'touchPoints': [{'x': x, 'y': y, 'id': 1}]})
        await asyncio.sleep(0.01)
    await cdp.send('Input.dispatchTouchEvent', {'type': 'touchEnd', 'touchPoints': []})


async def center(el):
    bb = await el.bounding_box()
    return (bb['x'] + bb['width'] / 2, bb['y'] + bb['height'] / 2)


async def main():
    errors = []
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox'])
        ctx = await b.new_context(viewport={'width': W, 'height': H}, has_touch=True, device_scale_factor=1)
        pg = await ctx.new_page()
        pg.on('console', lambda m: errors.append(m.text) if m.type == 'error' and 'favicon' not in m.text else None)
        pg.on('pageerror', lambda e: errors.append(str(e)))
        cdp = await ctx.new_cdp_session(pg)
        await pg.goto(URL + '?test')
        await pg.evaluate(f"localStorage.clear(); localStorage.setItem('pq-lang', '{LANG}')")
        await pg.reload()
        await pg.wait_for_timeout(400)
        await pg.click('.segbtn[data-n="3"]')
        await pg.screenshot(path=f'{OUT}/00_entrada.png')
        await pg.click('#setup button[type=submit]')
        for k in range(10):
            await pg.wait_for_selector('#intro-go')
            await pg.wait_for_timeout(450)
            if k < 2:
                await pg.screenshot(path=f'{OUT}/{k + 1:02d}a_sobre.png')
            await pg.click('#intro-go')
            await pg.wait_for_timeout(350)
            kind = await pg.evaluate("document.querySelector('#board').className")
            await pg.screenshot(path=f'{OUT}/{k + 1:02d}b_{kind.split("k-")[1]}.png')
            chips = await pg.eval_on_selector_all('.chip:not(.gone)', 'els => els.map(e => e.dataset.chip)')
            assert 2 <= len(chips) <= 6, ('nombre de termes', len(chips))
            # un error provocat per pantalla
            wrong = await pg.evaluate(f"window.__pq.wrongTargetFor('{chips[0]}')")
            if wrong is not None:
                src = await center(await pg.query_selector(f'.chip[data-chip="{chips[0]}"]'))
                dst = await center(await pg.query_selector(f'#board [data-target="{wrong}"]'))
                await touch_drag(cdp, src, dst)
                await pg.wait_for_timeout(700)
            if k == 1:  # una pista
                await pg.click('#hint')
                await pg.wait_for_timeout(300)
                await pg.screenshot(path=f'{OUT}/{k + 1:02d}c_pista.png')
            for j, cid in enumerate(chips):
                tgt = await pg.evaluate(f"window.__pq.targetFor('{cid}')")
                chip = await pg.query_selector(f'.chip[data-chip="{cid}"]')
                target = await pg.query_selector(f'#board [data-target="{tgt}"]')
                if j == 1 and k == 0:  # tocar i col·locar
                    await chip.tap(); await pg.wait_for_timeout(120); await target.tap()
                else:
                    await touch_drag(cdp, await center(chip), await center(target))
                await pg.wait_for_timeout(560)
                if k == 0 and j == 2:
                    await pg.screenshot(path=f'{OUT}/{k + 1:02d}c_mig.png')
            await pg.wait_for_selector('#next', timeout=5000)
            await pg.wait_for_timeout(800)
            if k in (0, 3, 9):
                await pg.screenshot(path=f'{OUT}/{k + 1:02d}d_fet.png')
            st = await pg.evaluate("window.__pq.state().sc[window.__pq.state().i]")
            assert len(st['placed']) == len(chips), 'no tot col·locat'
            assert st['errors'] >= 1, 'error no comptat'
            await pg.click('#next')
        await pg.wait_for_selector('.podium')
        await pg.wait_for_timeout(1200)
        await pg.screenshot(path=f'{OUT}/11_resultats.png', full_page=True)
        state = await pg.evaluate('window.__pq.state()')
        print('punts:', [(t['name'], t['points'], t['hits'], t['errors'], t['hints']) for t in state['teams']])
        print('pantalles:', [(r['kind'], r.get('organ') or r.get('deck'), len(r['ids'])) for r in state['run']])
        # recàrrega a mitja partida: es recupera
        await pg.click('#again'); await pg.wait_for_selector('#intro-go'); await pg.click('#intro-go'); await pg.wait_for_timeout(300)
        c0 = await pg.eval_on_selector('.chip', 'e => e.dataset.chip')
        tgt = await pg.evaluate(f"window.__pq.targetFor('{c0}')")
        await touch_drag(cdp, await center(await pg.query_selector(f'.chip[data-chip="{c0}"]')), await center(await pg.query_selector(f'#board [data-target="{tgt}"]')))
        await pg.wait_for_timeout(700)
        await pg.reload(); await pg.wait_for_timeout(500)
        placed = await pg.evaluate('Object.keys(window.__pq.state().sc[0].placed).length')
        gone = await pg.eval_on_selector_all('.chip.gone', 'els => els.length')
        assert placed == 1 and gone == 1, ('recuperació', placed, gone)
        await b.close()
    print('errors de consola:', errors or 'cap')
    if errors:
        sys.exit(1)
    print('OK')

asyncio.run(main())
