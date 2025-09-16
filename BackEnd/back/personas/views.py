
# Create your views here.


from rest_framework.decorators import api_view
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from .models import Persona
from .models import Administrador
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
        persona = Persona.objects.get(correo=correo, es_activo=True, rol='admin')
    except Persona.DoesNotExist:
        return Response({"error": "Usuario no encontrado"}, status=401)

    if persona.check_password(password):
        payload = {
            "id": persona.id_persona,
            "correo": persona.correo,
            "exp": datetime.utcnow() + timedelta(hours=1)
        }
        token = jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")
    
        response = Response({
            "id": persona.id_persona,
            "nombre": persona.nombre,
            "correo": persona.correo,
        })
        response.set_cookie(
            key="access_token",
            value=token,
            httponly=True,
            secure=True,   #poner en True solo en producción con https
            samesite="None"
    )
        return response
    else:
        return Response({"error": "Contraseña incorrecta"}, status=402)



@api_view(['POST'])
def registro(request):
    nombre = request.data.get('nombre')
    correo = request.data.get('correo')
    password = request.data.get('passwor')
    rol = request.data.get('rol')   
    cargo = request.data.get('cargo')

    if not nombre or not correo or not password:
        return Response({"error": "Nombre, correo y contraseña requeridos"}, status=400)

    if Persona.objects.filter(correo=correo).exists():
        return Response({"error": "Correo ya registrado"}, status=400)
    print (rol)
    persona = Persona(nombre=nombre, correo=correo, es_activo=True, rol=rol)
    persona.set_password(password)  
    persona.save()

    admin = Administrador(id_persona=persona, id_cargo=cargo)
    admin.save()

    return Response({
        "id": persona.id_persona,
        "nombre": persona.nombre,
        "correo": persona.correo
    }, status=201)




@api_view(['GET'])
def obtener_datos(request):
    token = request.COOKIES.get("access_token")
    print("el token",token)    
    if not token:
        return Response({"error": "No autenticado"}, status=404)

    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        correo = payload.get("correo") 

        persona = Persona.objects.get(correo=correo, es_activo=True)
        admin = Administrador.objects.get(id_persona=persona.id_persona)

        return Response({
            "nombre": persona.nombre,
            "correo": persona.correo,
            "id": persona.id_persona,
            "cargo": admin.id_cargo 
        })
    except jwt.ExpiredSignatureError:
        return Response({"error": "Token expirado"}, status=401)
    except jwt.InvalidTokenError:
        return Response({"error": "Token inválido"}, status=402)
    except Persona.DoesNotExist:
        return Response({"error": "Usuario no encontrado"}, status=404)
    except Administrador.DoesNotExist:
        return Response({"error": "Administrador no encontrado"}, status=403)
    

@api_view(['POST'])
def cerrar_sesion(request):
  
    response = Response({"message": "Sesión cerrada exitosamente"}, status=200)

    try:
        response.delete_cookie(
            key="access_token",
            samesite="None"
        )
    except Exception as e:
        print("Error al borrar cookie:", e)

    return response

    