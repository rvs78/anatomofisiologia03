import sys, asyncio
from playwright.async_api import async_playwright
async def main(url, out, w=1000, h=700, sel=None):
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox'])
        pg = await b.new_page(viewport={'width': int(w), 'height': int(h)})
        errs = []
        pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' else None)
        pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto(url); await pg.wait_for_timeout(600)
        await pg.screenshot(path=out, full_page=True)
        print('\n'.join(errs))
        await b.close()
asyncio.run(main(*sys.argv[1:]))
