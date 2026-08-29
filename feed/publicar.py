"""
Fabrica de contenido Mas & Co — publicador.

Corre una vez por dia (GitHub Actions, 10:05 hora argentina). Busca en
cola.json la entrada cuya fecha sea HOY (hora de Argentina) y la publica
en la pagina de Facebook y el Instagram de Mas & Co. Si hoy no hay nada
programado, termina en silencio. No genera contenido: solo publica piezas
ya aprobadas.

Necesita la variable de entorno META_TOKEN (token largo de la cuenta CMD
con acceso al portfolio Mas & Co). El token nunca se imprime.
"""
from __future__ import annotations

import json
import os
import sys
import urllib.parse
import urllib.request
from datetime import datetime, timedelta, timezone
from pathlib import Path

API = "https://graph.facebook.com/v25.0"
PAGE_ID = "1240250065846822"        # pagina de Facebook "Mas & Co"
IG_USER_ID = "17841430545492183"    # @mas.and.co

ARG = timezone(timedelta(hours=-3))


def llamar(path: str, datos: dict | None = None) -> dict:
    url = f"{API}/{path}"
    cuerpo = urllib.parse.urlencode(datos).encode() if datos else None
    with urllib.request.urlopen(
        urllib.request.Request(url, data=cuerpo), timeout=60
    ) as r:
        return json.loads(r.read().decode())


def main() -> int:
    token = os.environ.get("META_TOKEN", "").strip()
    if not token:
        print("[X] Falta META_TOKEN")
        return 1

    cola = json.loads((Path(__file__).parent / "cola.json").read_text(encoding="utf-8"))
    hoy = datetime.now(ARG).strftime("%Y-%m-%d")
    entrada = next((p for p in cola["posts"] if p["fecha"] == hoy), None)
    if not entrada:
        print(f"[i] {hoy}: sin publicacion programada. Nada que hacer.")
        return 0

    url_imagen = cola["base_url"] + entrada["imagen"]
    caption = entrada["caption"]
    print(f"[i] {hoy}: publicando {entrada['imagen']}")

    # token de pagina (para publicar en Facebook)
    pagina = llamar(f"{PAGE_ID}?fields=access_token&access_token={token}")
    token_pagina = pagina["access_token"]

    # 1 · Facebook: foto con texto
    fb = llamar(f"{PAGE_ID}/photos", {
        "url": url_imagen,
        "message": caption,
        "access_token": token_pagina,
    })
    print(f"[OK] Facebook: post {fb.get('post_id', fb.get('id'))}")

    # 2 · Instagram: contenedor + publicacion
    cont = llamar(f"{IG_USER_ID}/media", {
        "image_url": url_imagen,
        "caption": caption,
        "access_token": token,
    })
    pub = llamar(f"{IG_USER_ID}/media_publish", {
        "creation_id": cont["id"],
        "access_token": token,
    })
    print(f"[OK] Instagram: media {pub.get('id')}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
