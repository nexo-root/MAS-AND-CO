"""
Fabrica de contenido Mas & Co — publicador.

Corre dos veces por dia (GitHub Actions). Busca en cola.json la entrada cuya
fecha sea HOY (hora de Argentina) y cuyo turno mande el workflow, y la publica
en el Instagram y en la pagina de Facebook de Mas & Co. Si hoy no hay nada
programado, termina en silencio. No genera contenido: solo publica piezas ya
aprobadas.

Necesita la variable de entorno META_TOKEN (token con acceso al portfolio
Mas & Co). El token nunca se imprime.

Blindajes agregados el 15/09/2026, despues de que las dos corridas del dia
quedaran en rojo con los posts publicados en Instagram y la pagina de Facebook
vacia:

  1. Instagram puede devolver "4/2207051 Application request limit reached" y
     publicar igual. Antes de darlo por fallido se consulta el estado del
     contenedor: si quedo PUBLISHED, el post salio.
  2. Facebook se publica aunque Instagram falle. Antes, una falla de Instagram
     cortaba el script y la pagina se quedaba sin nada.
  3. Antes de publicar se mira lo ultimo de cada red: si ya esta el mismo texto,
     se saltea. Asi una corrida repetida no duplica el post.
  4. La corrida termina en rojo solo si alguna red no publico de verdad.

Variables opcionales, para recuperar a mano una publicacion:
  TURNO=1|2         turno de la cola (lo manda el workflow)
  FECHA=AAAA-MM-DD  fuerza la fecha en vez de usar hoy
  SOLO=ig|fb        publica en una sola red
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
PAGE_ID = "1342032842315941"        # pagina de Facebook "Mas And Co" (cuentas nuevas)
IG_USER_ID = "17841427054482089"    # @masandco.mas

ARG = timezone(timedelta(hours=-3))


class ErrorGraph(RuntimeError):
    def __init__(self, codigo, subcodigo, mensaje):
        super().__init__(f"{codigo}/{subcodigo}: {mensaje}")
        self.codigo = codigo
        self.subcodigo = subcodigo


def llamar(path: str, datos: dict | None = None, intentos: int = 3, espera: int = 8) -> dict:
    """Llama a la Graph API con reintentos y errores legibles.

    La API de Instagram falla transitoriamente seguido (sobre todo con
    cuentas nuevas): sin reintentos, el robot moria por un 400 pasajero.
    """
    url = f"{API}/{path}"
    cuerpo = urllib.parse.urlencode(datos).encode() if datos else None
    ultimo: Exception | None = None
    for i in range(intentos):
        try:
            with urllib.request.urlopen(
                urllib.request.Request(url, data=cuerpo), timeout=90
            ) as r:
                return json.loads(r.read().decode())
        except urllib.error.HTTPError as e:
            err = json.loads(e.read().decode()).get("error", {})
            ultimo = ErrorGraph(err.get("code"), err.get("error_subcode"), (err.get("message") or "")[:150])
            print(f"[!] intento {i + 1}/{intentos} fallo: {ultimo}")
            if i < intentos - 1:
                time.sleep(espera * (i + 1))
    raise ultimo or RuntimeError("Graph API fallo")


def mismo_texto(a: str | None, b: str) -> bool:
    return (a or "").strip() == b.strip()


def ya_esta_en_instagram(token: str, caption: str) -> bool:
    """Mira los ultimos posts de la cuenta para no duplicar en una re-corrida."""
    try:
        data = llamar(
            f"{IG_USER_ID}/media?fields=caption&limit=3&access_token={token}", intentos=1
        ).get("data", [])
    except Exception as e:
        print(f"[i] no pude revisar lo ultimo de Instagram: {e}")
        return False
    return any(mismo_texto(m.get("caption"), caption) for m in data)


def ya_esta_en_facebook(token_pagina: str, caption: str) -> bool:
    try:
        data = llamar(
            f"{PAGE_ID}/published_posts?fields=message&limit=5&access_token={token_pagina}", intentos=1
        ).get("data", [])
    except Exception as e:
        print(f"[i] no pude revisar lo ultimo de Facebook: {e}")
        return False
    return any(mismo_texto(p.get("message"), caption) for p in data)


def contenedor_publicado(cont_id: str, token: str) -> bool:
    """Instagram a veces devuelve error y publica igual: se confirma con el estado."""
    try:
        estado = llamar(f"{cont_id}?fields=status_code&access_token={token}", intentos=2, espera=5)
    except Exception as e:
        print(f"[i] no pude leer el estado del contenedor: {e}")
        return False
    print(f"[i] estado del contenedor: {estado.get('status_code')}")
    return estado.get("status_code") == "PUBLISHED"


def publicar_instagram(token: str, url_imagen: str, caption: str) -> bool:
    if ya_esta_en_instagram(token, caption):
        print("[i] Instagram ya tenia este post: no se repite")
        return True

    cont = llamar(f"{IG_USER_ID}/media", {
        "image_url": url_imagen,
        "caption": caption,
        "access_token": token,
    })
    # El contenedor tarda: publicarlo al instante da 400 porque Meta todavia no
    # termino de bajar la imagen.
    for _ in range(10):
        estado = llamar(f"{cont['id']}?fields=status_code&access_token={token}")
        if estado.get("status_code") == "FINISHED":
            break
        if estado.get("status_code") == "ERROR":
            print("[X] Instagram: el contenedor quedo en ERROR")
            return False
        time.sleep(5)

    try:
        pub = llamar(f"{IG_USER_ID}/media_publish", {
            "creation_id": cont["id"],
            "access_token": token,
        }, intentos=1)
        print(f"[OK] Instagram: media {pub.get('id')}")
        return True
    except Exception as e:
        print(f"[!] media_publish devolvio error: {e}")
        time.sleep(10)
        if contenedor_publicado(cont["id"], token) or ya_esta_en_instagram(token, caption):
            print("[OK] Instagram: el error era falso, el post ya estaba publicado")
            return True
        try:
            pub = llamar(f"{IG_USER_ID}/media_publish", {
                "creation_id": cont["id"],
                "access_token": token,
            }, intentos=2, espera=20)
            print(f"[OK] Instagram: media {pub.get('id')} (segundo intento)")
            return True
        except Exception as e2:
            print(f"[X] Instagram no publico: {e2}")
            return False


def publicar_facebook(token: str, url_imagen: str, caption: str) -> bool:
    try:
        token_pagina = llamar(f"{PAGE_ID}?fields=access_token&access_token={token}", intentos=2)["access_token"]
    except Exception as e:
        print(f"[i] no pude pedir el token de pagina, uso el que vino: {e}")
        token_pagina = token

    if ya_esta_en_facebook(token_pagina, caption):
        print("[i] Facebook ya tenia este post: no se repite")
        return True

    try:
        fb = llamar(f"{PAGE_ID}/photos", {
            "url": url_imagen,
            "message": caption,
            "access_token": token_pagina,
        })
        print(f"[OK] Facebook: post {fb.get('post_id', fb.get('id'))}")
        return True
    except Exception as e:
        print(f"[X] Facebook no publico: {e}")
        return False


def main() -> int:
    token = os.environ.get("META_TOKEN", "").strip()
    if not token:
        print("[X] Falta META_TOKEN")
        return 1

    cola = json.loads((Path(__file__).parent / "cola.json").read_text(encoding="utf-8"))
    # Publicamos dos veces por dia. El turno NO se deduce de la hora: GitHub
    # larga los cron con horas de atraso y eso elegiria el post equivocado.
    # Lo manda el workflow segun cual de los dos cron disparo.
    turno = int(os.environ.get("TURNO", "1"))
    solo = os.environ.get("SOLO", "").strip().lower()

    ahora = datetime.now(ARG)
    # Red de seguridad: si el atraso de GitHub empujo la corrida de la tarde a
    # despues de medianoche, el dia calendario ya avanzo pero el post que
    # corresponde sigue siendo el de AYER. Sin esto la cola se corre sola.
    if turno == 2 and ahora.hour < 6:
        ahora -= timedelta(days=1)
        print("[i] corrida atrasada cruzo la medianoche: uso la fecha de ayer")
    hoy = os.environ.get("FECHA", "").strip() or ahora.strftime("%Y-%m-%d")

    entrada = next(
        (p for p in cola["posts"]
         if p["fecha"] == hoy and int(p.get("turno", 1)) == turno),
        None,
    )
    if not entrada:
        print(f"[i] {hoy} turno {turno}: sin publicacion programada. Nada que hacer.")
        return 0

    url_imagen = cola["base_url"] + entrada["imagen"]
    caption = entrada["caption"]
    print(f"[i] {hoy} turno {turno}: publicando {entrada['imagen']}")

    resultados = {}
    if solo != "fb":
        resultados["Instagram"] = publicar_instagram(token, url_imagen, caption)
    # Facebook va SIEMPRE, aunque Instagram haya fallado.
    if solo != "ig":
        resultados["Facebook"] = publicar_facebook(token, url_imagen, caption)

    fallaron = [red for red, ok in resultados.items() if not ok]
    if fallaron:
        print(f"[X] no publico en: {', '.join(fallaron)}")
        return 1
    print("[OK] publicado en: " + ", ".join(resultados))
    return 0


if __name__ == "__main__":
    sys.exit(main())
