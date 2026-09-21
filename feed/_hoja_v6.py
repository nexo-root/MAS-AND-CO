# -*- coding: utf-8 -*-
"""Junta los 12 posts nuevos en una sola imagen para mirarlos de una.

La regla de la casa: no se entrega una pieza sin haber visto el PNG. La auditoria
de texto pasa en verde con la portada rota, asi que esto es el unico control real.
"""
import pathlib

from PIL import Image, ImageDraw, ImageFont

AQUI = pathlib.Path(__file__).parent
ORDEN = [
 ("22/09 · 1", "v6-p01-te-buscan"),   ("22/09 · 2", "v6-p04-preguntas"),
 ("22/09 · 3", "v6-p03-arbolito"),    ("23/09 · 1", "v6-p02-local-cierra"),
 ("23/09 · 2", "v6-p07-instagram"),   ("23/09 · 3", "v6-p09-gastronomia"),
 ("24/09 · 1", "v6-p12-google"),      ("24/09 · 2", "v6-p05-tres-cosas"),
 ("24/09 · 3", "v6-p06-finan"),       ("25/09 · 1", "v6-p10-domingo"),
 ("25/09 · 2", "v6-p08-once-noche"),  ("25/09 · 3", "v6-p11-inmobiliaria"),
]

COLS, ANCHO, MARGEN, ROTULO = 4, 430, 26, 34
ALTO = round(ANCHO * 1350 / 1080)
filas = -(-len(ORDEN) // COLS)

W = MARGEN + COLS * (ANCHO + MARGEN)
H = MARGEN + filas * (ALTO + ROTULO + MARGEN)
hoja = Image.new("RGB", (W, H), (28, 28, 32))
dib = ImageDraw.Draw(hoja)
try:
    fuente = ImageFont.truetype("arialbd.ttf", 20)
except OSError:
    fuente = ImageFont.load_default()

for i, (rotulo, pieza) in enumerate(ORDEN):
    src = AQUI / f"{pieza}.png"
    if not src.exists():
        raise SystemExit(f"falta {src}")
    im = Image.open(src).convert("RGB").resize((ANCHO, ALTO), Image.LANCZOS)
    x = MARGEN + (i % COLS) * (ANCHO + MARGEN)
    y = MARGEN + (i // COLS) * (ALTO + ROTULO + MARGEN)
    hoja.paste(im, (x, y))
    dib.text((x, y + ALTO + 8), f"{rotulo}   {pieza[3:]}", font=fuente, fill=(150, 150, 160))

salida = AQUI / "_hoja-v6-posts.png"
hoja.save(salida, quality=94)
print(f"{salida.name}  {W}x{H}  {salida.stat().st_size//1024} KB")
