"""Prepara les làmines generades amb IA (OpenRouter · openai/gpt-image-2.6-sunburst, via Composio) per al joc.
Entrada: tools/ia/<òrgan>_gpt.webp (1536×1152, 4:3, mateix enquadrament que la referència SVG: viewBox 0 −25 1000 750).
Sortida: assets/laminas/<òrgan>.webp (1600×1200). El fons gairebé blanc (textura de paper) passa a blanc pur.
Ús: python3 tools/laminas.py"""
import numpy as np
from PIL import Image, ImageFilter

for o in ['ull', 'orella', 'llengua', 'nas', 'pell']:
    im = Image.open(f'tools/ia/{o}_gpt.webp').convert('RGB').resize((1600, 1200), Image.LANCZOS)
    a = np.asarray(im).astype(float)
    mn, mx = a.min(2), a.max(2)
    # fons: clar i poc saturat; transició suau entre 222 i 238
    w = np.clip((mn - 222) / 16, 0, 1) * np.clip(1 - (mx - mn - 10) / 14, 0, 1)
    w = np.asarray(Image.fromarray((w * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.2))).astype(float)[..., None] / 255
    out = a * (1 - w) + 255 * w
    Image.fromarray(out.clip(0, 255).astype(np.uint8)).save(f'assets/laminas/{o}.webp', quality=86, method=6)
    print(o, 'ok')
