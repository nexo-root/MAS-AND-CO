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
import time
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timedelta, timezone
from pathlib import Path

API = "https://graph.facebook.com/v25.0"
PAGE_ID = "1240250065846822"        # pagina de Facebook "Mas & Co"
IG_USER_ID = "17841430545492183"    # @mas.and.co

ARG = timezone(timedelta(hours=-3))


def llamar(path: str, datos: dict | None = None, intentos: int = 3) -> dict:
    """Llama a la Graph API con reintentos y errores legibles.

    La API de Instagram falla transitoriamente seguido (sobre todo con
    cuentas nuevas): sin reintentos, el robot moria por un 400 pasajero.
    """
    url = f"{API}/{path}"
    cuerpo = urllib.parse.urlencode(datos).encode() if datos else None
    ultimo = ""
    for i in range(intentos):
        try:
            with urllib.request.urlopen(
                urllib.request.Request(url, data=cuerpo), timeout=90
            ) as r:
                return json.loads(r.read().decode())
        except urllib.error.HTTPError as e:
            err = json.loads(e.read().decode()).get("error", {})
            ultimo = f'{err.get("code")}/{err.get("error_subcode")}: {err.get("message", "")[:150]}'
            print(f"[!] intento {i + 1}/{intentos} fallo: {ultimo}")
            if i < intentos - 1:
                time.sleep(8 * (i + 1))
    raise RuntimeError(f"Graph API fallo tras {intentos} intentos: {ultimo}")


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

    # 1 · Instagram PRIMERO (es el paso fragil): si falla, no queda nada
    # publicado a medias y la corrida se puede reintentar sin duplicar.
    # El bug original: publicar el contenedor al instante da 400 porque Meta
    # todavia no termino de bajar la imagen. Hay que esperar/consultar.
    cont = llamar(f"{IG_USER_ID}/media", {
        "image_url": url_imagen,
        "caption": caption,
        "access_token": token,
    })
    for _ in range(10):
        estado = llamar(f"{cont['id']}?fields=status_code&access_token={token}")
        if estado.get("status_code") == "FINISHED":
            break
        if estado.get("status_code") == "ERROR":
            raise RuntimeError("el contenedor de IG quedo en ERROR")
        time.sleep(5)
    pub = llamar(f"{IG_USER_ID}/media_publish", {
        "creation_id": cont["id"],
        "access_token": token,
    })
    print(f"[OK] Instagram: media {pub.get('id')}")

    # 2 · Facebook (con token de pagina)
    pagina = llamar(f"{PAGE_ID}?fields=access_token&access_token={token}")
    token_pagina = pagina["access_token"]
    fb = llamar(f"{PAGE_ID}/photos", {
        "url": url_imagen,
        "message": caption,
        "access_token": token_pagina,
    })
    print(f"[OK] Facebook: post {fb.get('post_id', fb.get('id'))}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
