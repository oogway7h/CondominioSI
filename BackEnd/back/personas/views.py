
# Create your views here.


from rest_framework.decorators import api_view
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from .models import Persona
from datetime import datetime, timedelta
import jwt
from django.conf import settings


@api_view(['POST'])
def login_api(request):
    correo = request.data.get('correo')
    password = request.data.get('passwor')

    if not correo or not password:
        return Response({"error": "Correo y contraseña requeridos"}, status=400)

    try:
        persona = Persona.objects.get(correo=correo, es_activo=True)
    except Persona.DoesNotExist:
        return Response({"error": "Usuario no encontrado"}, status=401)

    if persona.check_password(password):
        payload = {
            "id": persona.id_persona,
            "correo": persona.correo,
            "exp": datetime.utcnow() + timedelta(hours=1)
        }
        token = jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")
        return Response({
            "id": persona.id_persona,
            "nombre": persona.nombre,
            "correo": persona.correo,
            "token": token
        })
    else:
        return Response({"error": "Contraseña i ncorrecta"}, status=402)



@api_view(['POST'])
def registro(request):
    nombre = request.data.get('nombre')
    correo = request.data.get('correo')
    password = request.data.get('passwor')

    if not nombre or not correo or not password:
        return Response({"error": "Nombre, correo y contraseña requeridos"}, status=400)

    if Persona.objects.filter(correo=correo).exists():
        return Response({"error": "Correo ya registrado"}, status=400)

    persona = Persona(nombre=nombre, correo=correo, es_activo=True)
    persona.set_password(password)
    persona.save()

    return Response({
        "id": persona.id_persona,
        "nombre": persona.nombre,
        "correo": persona.correo
    }, status=201)