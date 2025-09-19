from .models import Bitacora
from datetime import datetime

def registrar_bitacora(persona, accion, detalle=None):

    Bitacora.objects.create(
        id_persona=persona,
        fecha_hora=datetime.now(),
        accion=accion,
        detalle=detalle
    )
