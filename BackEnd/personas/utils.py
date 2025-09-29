from .models import Bitacora
from datetime import datetime
import jwt
from django.conf import settings
from rest_framework.response import Response
from functools import wraps



def token_required(view_func):
    @wraps(view_func)
    def wrapped_view(request, *args, **kwargs):
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return Response({"error": "Token no proporcionado"}, status=401)

        token = auth_header.split(" ")[1]
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
            request.persona_id = payload.get("id") 
        except jwt.ExpiredSignatureError:
            return Response({"error": "Token expirado"}, status=401)
        except jwt.InvalidTokenError:
            return Response({"error": "Token inválido"}, status=401)

        return view_func(request, *args, **kwargs)
    return wrapped_view


def registrar_bitacora(request,persona, accion, detalle=None):
    ip = get_client_ip(request)
    Bitacora.objects.create(
        id_persona=persona,
        fecha_hora=datetime.now(),
        accion=accion,
        detalle=detalle,
       ip=ip
    )

def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip