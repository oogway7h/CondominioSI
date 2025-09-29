
from django.utils import timezone
from django.db import transaction
from ..models import Propiedad, Mensualidad
import logging

logger = logging.getLogger(__name__)

def generar_mensualidades():
    """
    Crea (si no existe) una Mensualidad por propiedad para mes/año actual.
    Diseñada para ejecutarse desde django-crontab.
    """
    hoy = timezone.now()
    mes_actual = hoy.month
    anio_actual = hoy.year
    creadas = 0
    try:
        with transaction.atomic():  
            for propiedad in Propiedad.objects.all():
                mensualidad, creada = Mensualidad.objects.get_or_create(
                    id_propiedad=propiedad,
                    mes=mes_actual,
                    anio=anio_actual,
                    estado='pendiente'
                )
                if creada:
                    creadas += 1
                    logger.info(f"Mensualidad creada id={mensualidad.id_cuota} propiedad={propiedad.id_propiedad}")
        logger.info(f"generar_mensualidades: finalizado. creadas={creadas} ({mes_actual}/{anio_actual})")
    except Exception as e:
        logger.exception("Error al generar mensualidades: %s", e)
