"""
Fabrica de contenido Mas & Co — publicador de reels.

Corre todos los dias (GitHub Actions). Busca en cola-reels.json la entrada cuya
fecha sea HOY (hora de Argentina) y publica el video como Reel en el Instagram y
en la pagina de Facebook de Mas & Co. Si hoy no hay reel, termina en silencio.

Los videos viven en el repo (feed/reels/) y Meta los baja por URL publica. Ya
traen la musica pegada adentro del archivo: por API no se puede enganchar un
audio del catalogo, asi que se resuelve al generarlos.

Reusa los blindajes de publicar.py: reintentos, no duplicar si el texto ya esta
publicado, y Facebook sale aunque Instagram falle.

Necesita META_TOKEN. El token nunca se imprime.

Variables opcionales:
  FECHA=AAAA-MM-DD  fuerza la fecha en vez de usar hoy
  SOLO=ig|fb        publica en una sola red
"""
from __future__ import annotations

import json
import os
import time
import urllib.error
import urllib.request
from datetime import datetime
from pathlib import Path

from publicar import (ARG, IG_USER_ID, PAGE_ID, llamar, ya_esta_en_facebook,
                      ya_esta_en_instagram)

# Un video tarda mucho mas que una imagen en quedar listo del lado de Meta.
INTENTOS_ESTADO = 40
ESPERA_ESTADO = 10


def esperar_video(cont_id: str, token: str) -> bool:
    for i in range(INTENTOS_ESTADO):
        estado = llamar(f"{cont_id}?fields=status_code,status&access_token={token}", intentos=2)
        codigo = estado.get("status_code")
        if codigo == "FINISHED":
            return True
        if codigo == "ERROR":
            print(f"[X] Instagram: el contenedor quedo en ERROR ({estado.get('status')})")
            return False
        time.sleep(ESPERA_ESTADO)
    print("[X] Instagram: el video nunca termino de procesarse")
    return False


def publicar_reel_instagram(token: str, url_video: str, caption: str) -> bool:
    if ya_esta_en_instagram(token, caption):
        print("[i] Instagram ya tenia este reel: no se repite")
        return True

    cont = llamar(f"{IG_USER_ID}/media", {
        "media_type": "REELS",
        "video_url": url_video,
        "caption": caption,
        "share_to_feed": "true",
        "access_token": token,
    })
    if not esperar_video(cont["id"], token):
        return False

    try:
        pub = llamar(f"{IG_USER_ID}/media_publish", {
            "creation_id": cont["id"],
            "access_token": token,
        }, intentos=2, espera=20)
        print(f"[OK] Instagram: reel {pub.get('id')}")
        return True
    except Exception as e:
        print(f"[!] media_publish devolvio error: {e}")
        time.sleep(15)
        if ya_esta_en_instagram(token, caption):
            print("[OK] Instagram: el error era falso, el reel ya estaba publicado")
            return True
        print(f"[X] Instagram no publico el reel: {e}")
        return False


def subir_binario(upload_url: str, token_pagina: str, url_video: str) -> bool:
    """Meta baja el archivo sola si se le pasa file_url en la cabecera."""
    pedido = urllib.request.Request(upload_url, data=b"", headers={
        "Authorization": f"OAuth {token_pagina}",
        "file_url": url_video,
        "Content-Type": "application/json",
    })
    try:
        with urllib.request.urlopen(pedido, timeout=300) as r:
            print(f"[i] Facebook subio el video: {json.loads(r.read().decode())}")
        return True
    except urllib.error.HTTPError as e:
        print(f"[X] Facebook no pudo bajar el video: {e.read().decode()[:200]}")
        return False


def publicar_reel_facebook(token: str, url_video: str, caption: str) -> bool:
    try:
        token_pagina = llamar(f"{PAGE_ID}?fields=access_token&access_token={token}", intentos=2)["access_token"]
    except Exception as e:
        print(f"[i] no pude pedir el token de pagina, uso el que vino: {e}")
        token_pagina = token

    if ya_esta_en_facebook(token_pagina, caption):
        print("[i] Facebook ya tenia este reel: no se repite")
        return True

    try:
        inicio = llamar(f"{PAGE_ID}/video_reels", {
            "upload_phase": "start",
            "access_token": token_pagina,
        })
        if not subir_binario(inicio["upload_url"], token_pagina, url_video):
            return False
        # El video recien subido tarda en estar listo para publicarse.
        time.sleep(20)
        fin = llamar(f"{PAGE_ID}/video_reels", {
            "upload_phase": "finish",
            "video_id": inicio["video_id"],
            "video_state": "PUBLISHED",
            "description": caption,
            "access_token": token_pagina,
        }, intentos=3, espera=20)
        print(f"[OK] Facebook: reel {inicio['video_id']} ({fin})")
        return True
    except Exception as e:
        print(f"[X] Facebook no publico el reel: {e}")
        return False


def main() -> int:
    token = os.environ.get("META_TOKEN", "").strip()
    if not token:
        print("[X] Falta META_TOKEN")
        return 1

    aqui = Path(__file__).parent
    cola = json.loads((aqui / "cola-reels.json").read_text(encoding="utf-8"))
    solo = os.environ.get("SOLO", "").strip().lower()
    hoy = os.environ.get("FECHA", "").strip() or datetime.now(ARG).strftime("%Y-%m-%d")

    entrada = next((r for r in cola["reels"] if r["fecha"] == hoy), None)
    if not entrada:
        print(f"[i] {hoy}: no hay reel programado. Nada que hacer.")
        return 0

    url_video = cola["base_url"] + entrada["video"]
    caption = entrada["caption"]
    print(f"[i] {hoy}: publicando el reel {entrada['video']}")

    resultados = {}
    if solo != "fb":
        resultados["Instagram"] = publicar_reel_instagram(token, url_video, caption)
    # Facebook va SIEMPRE, aunque Instagram haya fallado.
    if solo != "ig":
        resultados["Facebook"] = publicar_reel_facebook(token, url_video, caption)

    for red, ok in resultados.items():
        print(f"[{'OK' if ok else 'X'}] {red}")
    return 0 if all(resultados.values()) else 1


if __name__ == "__main__":
    raise SystemExit(main())
