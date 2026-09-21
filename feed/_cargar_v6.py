# -*- coding: utf-8 -*-
"""Mete los 12 posts del motor editorial v6 en la cola, del 22 al 25 de septiembre.

Reemplaza los turnos 1, 2 y 3 de esos cuatro dias (el turno 4 ya es el carrusel v6
y no se toca). Los doce posts viejos que estaban en esos turnos se PISAN: quedan
fuera de la cola. No se pierden igual, porque el PNG sigue en esta carpeta y el
cola.json anterior esta en el historial de git (commit 5ca5712 hacia atras); para
volver atras alcanza con `git checkout <commit> -- feed/cola.json`.

Orden pensado, no alfabetico. Cada dia lleva un objeto distinto (busqueda u
horario, despues chat o lista, y al final una pantalla) y tres paletas distintas,
que es la regla de variedad de la skill: si la grilla del perfil repite, se lee
como plantilla.
"""
import json
import pathlib
import shutil

AQUI = pathlib.Path(__file__).parent
ORIGEN = AQUI / "../../negocio/v5-editorial"

CIERRE = ("Escribinos por WhatsApp con el rubro de tu negocio y te pasamos "
          "ejemplos y el presupuesto en el día.")

# (fecha, turno, pieza, paleta, objeto, texto)
PLAN = [
 ("2026-09-22", 1, "v6-p01-te-buscan", "crema", "búsqueda",
  "Alguien busca tu rubro en el celular y aparece el taller de al lado. No es que le "
  "guste más: es el único que Google puede mostrar.\n\n"
  "Con tu página publicada, esa misma búsqueda termina en tu WhatsApp."),

 ("2026-09-22", 2, "v6-p04-preguntas", "arena", "chat",
  "A qué hora abren, si hacen envíos, dónde quedan. Son siempre las mismas y te "
  "llegan todo el día, justo mientras estás atendiendo.\n\n"
  "Tu página las contesta antes de que te escriban. El que llega a tu WhatsApp ya "
  "leyó todo y escribe para comprar."),

 ("2026-09-22", 3, "v6-p03-arbolito", "menta", "pantalla",
  "Así quedó la página de El Arbolito: las fotos del lugar, dónde queda y un botón "
  "para consultar por WhatsApp. Es un cliente nuestro y está publicada en "
  "pehuencoalquileres.com."),

 ("2026-09-23", 1, "v6-p02-local-cierra", "noche", "horario",
  "Tu local cierra a las seis y el domingo no abre. Tu página no cierra nunca.\n\n"
  "El que te busca un domingo a la noche encuentra tus fotos, tus horarios y tu "
  "WhatsApp, y te escribe. Vos lo leés el lunes, pero no lo perdiste."),

 ("2026-09-23", 2, "v6-p07-instagram", "menta", "lista",
  "Instagram muestra tus fotos y tus novedades. Tu página muestra lo que el cliente "
  "nuevo necesita para decidir: qué hacés, dónde estás y el WhatsApp a un toque.\n\n"
  "Una no reemplaza a la otra. La diferencia es que a la página te la encuentra Google."),

 ("2026-09-23", 3, "v6-p09-gastronomia", "crema", "pantalla",
  "Un diseño de muestra para gastronomía: la carta con fotos, los horarios y la "
  "reserva por WhatsApp, todo en una pantalla.\n\n"
  "El que entra ya vio qué hay y escribe para reservar."),

 ("2026-09-24", 1, "v6-p12-google", "arena", "búsqueda",
  "Veterinaria abierta ahora. Farmacia de turno. Cerrajero urgente. El que busca así "
  "no compara: entra al primero que aparece.\n\n"
  "Si tu negocio no está en esa lista, la llamada la recibe otro."),

 ("2026-09-24", 2, "v6-p05-tres-cosas", "crema", "lista",
  "Antes de escribirte, el que no te conoce quiere ver tres cosas: a qué hora abrís, "
  "dónde quedás y fotos de lo que hacés.\n\n"
  "Si las encuentra, escribe. Si no, sigue buscando."),

 ("2026-09-24", 3, "v6-p06-finan", "noche", "pantalla",
  "Así quedó la página de Crédito Finan: qué hacen en una frase, un formulario que "
  "les llega al correo y el WhatsApp a un toque. Es un cliente nuestro y está "
  "publicada en creditofinan.com."),

 ("2026-09-25", 1, "v6-p10-domingo", "crema", "horario",
  "Domingo a la noche. Tu local cerrado, vos descansando y nadie atendiendo el teléfono.\n\n"
  "Tu página sigue abierta: muestra lo que hacés, dónde estás y deja el WhatsApp "
  "listo para el lunes a la mañana."),

 ("2026-09-25", 2, "v6-p08-once-noche", "arena", "chat",
  "Once y media de la noche. El que pregunta a esa hora no espera a mañana: le "
  "escribe al que puede contestarle ahora.\n\n"
  "Con los horarios, la dirección y las fotos publicadas, tu página contesta por vos "
  "mientras dormís."),

 ("2026-09-25", 3, "v6-p11-inmobiliaria", "menta", "pantalla",
  "Un diseño de muestra para inmobiliarias: cada propiedad con sus fotos, su ficha y "
  "su botón para consultar.\n\n"
  "El que te escribe ya vio la propiedad y pregunta por esa. Se terminan las "
  "consultas de las que no tenés."),
]

PROHIBIDO = ("Posadas", "$", "7 días", "siete días", "Misiones")

# --- 1. control de variedad: ningun dia repite objeto ni paleta ---------------
for fecha in sorted({p[0] for p in PLAN}):
    deldia = [p for p in PLAN if p[0] == fecha]
    assert len({p[3] for p in deldia}) == 3, f"{fecha}: paleta repetida"
    assert len({p[4] for p in deldia}) == 3, f"{fecha}: objeto repetido"

# --- 2. reglas de la casa en los textos --------------------------------------
for _, _, pieza, _, _, txt in PLAN:
    for mal in PROHIBIDO:
        assert mal not in txt, f"{pieza}: dice '{mal}'"

# --- 3. copiar los PNG a la fabrica ------------------------------------------
copiados = 0
for _, _, pieza, _, _, _ in PLAN:
    src = (ORIGEN / f"{pieza}.png").resolve()
    assert src.exists(), f"falta el render {src}"
    shutil.copy2(src, AQUI / f"{pieza}.png")
    copiados += 1

# --- 4. reacomodar la cola ---------------------------------------------------
p = AQUI / "cola.json"
cola = json.loads(p.read_text(encoding="utf-8"))
items = cola if isinstance(cola, list) else cola["posts"]

nuevos = {(f, t): (pieza, txt) for f, t, pieza, _, _, txt in PLAN}
desplazados = []
for x in items:
    k = (x.get("fecha"), x.get("turno"))
    if k in nuevos:
        # correrlo dos veces informaba como "desplazados" a los propios v6
        if not str(x["imagen"]).startswith("v6-p"):
            desplazados.append(x["imagen"])
        x["imagen"], x["caption"] = nuevos[k][0] + ".png", nuevos[k][1] + "\n\n" + CIERRE

faltan = [k for k in nuevos if k not in {(x.get("fecha"), x.get("turno")) for x in items}]
assert not faltan, f"estos turnos no existian en la cola: {faltan}"

p.write_text(json.dumps(cola, ensure_ascii=False, indent=1), encoding="utf-8")

print(f"PNG copiados a la fabrica: {copiados}")
print(f"turnos reemplazados:       {len(desplazados)}")
print(f"posts viejos desplazados:  {', '.join(sorted(desplazados))}")
print("\nasi queda la semana:")
for f, t, pieza, pal, obj, _ in PLAN:
    print(f"  {f}  turno {t}  {pieza:22} {pal:6} {obj}")
