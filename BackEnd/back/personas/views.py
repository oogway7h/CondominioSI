
# Create your views here.


from rest_framework.decorators import api_view
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from .models import Persona
from .models import Administrador
from datetime import datetime, timedelta
import jwt
from django.conf import settings
from .models import Bitacora
from .utils import registrar_bitacora
from .models import Inquilino,Propietario,Privilegio


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
        registrar_bitacora(persona,"inicio de sesion","inicio sesion correctamente")
        response = Response({
            "id": persona.id_persona,
            "nombre": persona.nombre,
            "correo": persona.correo,
            "token": token
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
    estado=request.data.get('estado')
    cargo = request.data.get('cargo')

    if not nombre or not correo or not password:
        print("nombre o correo requeridos")
        return Response({"error": "Nombre, correo y contraseña requeridos"}, status=400)
        

    if Persona.objects.filter(correo=correo).exists():
        print("repetido")
        return Response({"error": "Correo ya registrado"}, status=400)

    persona = Persona(nombre=nombre, correo=correo, es_activo=True, rol=rol)
    persona.set_password(password)  
    persona.save()

    if rol == 'admin':
        admin = Administrador(id_persona=persona, id_cargo=cargo)
        admin.save()
    elif estado == 'propie':
        propietario = Propietario(id_persona=persona)
        propietario.save()
        privilegio=Privilegio(id_persona=persona,corte_cesped=True,entrada_auto=True,
                              recojo_basura=True,avisos_visita=True,acceso_gimnasio=True, 
                              acceso_piscina=True,acceso_sala_eventos=True)
        privilegio.save()
    elif estado == 'inqui':
        inquilino = Inquilino(id_persona=persona)
        inquilino.save()
        privilegio=Privilegio(id_persona=persona,corte_cesped=True,entrada_auto=True,
                              recojo_basura=True,avisos_visita=True,acceso_gimnasio=True, 
                              acceso_piscina=True,acceso_sala_eventos=True)
        privilegio.save()   

    token = request.COOKIES.get("access_token")
    if token:
        import jwt
        from django.conf import settings
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        admin_actor = Persona.objects.get(correo=payload.get("correo"))

        #resgistrar en bitácora
        registrar_bitacora(
            admin_actor,
            "registro de usuario",
            f"Se registró a {persona.nombre} con id={persona.id_persona}"
        )

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
        print(token)
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
    token = request.COOKIES.get("access_token")
    persona = None

    if token:
        import jwt
        from django.conf import settings
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        persona = Persona.objects.get(correo=payload.get("correo"))
    
    registrar_bitacora(persona,"Cierre de sesion",
                           f"El usuario: {persona.nombre} cerró sesión")
    try:
        response.delete_cookie(
            key="access_token",
            samesite="None"
        )
        
    except Exception as e:
        print("Error al borrar cookie:", e)

    return response



@api_view(['GET'])
def gestionar_usuario(request):
   
    try:
        token = request.COOKIES.get("access_token")
        persona = None

        if token:
            import jwt
            from django.conf import settings
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
            persona = Persona.objects.get(correo=payload.get("correo"))
        
        registrar_bitacora(persona, "Gestionar usuario", "Entró a la vista gestionar usuarios")

        personas = Persona.objects.filter(es_activo=True)

        if not personas.exists():
            return Response({"message": "No se encontraron usuarios"}, status=404)

        datos = [
            {
                "id": p.id_persona,
                "nombre": p.nombre,
                "correo": p.correo,
                "rol": p.rol
            }
            for p in personas
        ]
        
        return Response({"usuarios": datos}, status=200)

    except Exception as e:
        return Response({"error": str(e)}, status=500)



@api_view(['DELETE'])
def eliminar_usuario(request,id):
    try:
        persona=Persona.objects.get(id_persona=id)
        admin=Administrador.objects.get(id_persona=id)
        propietario=Propietario.objects.get(id_persona=id)
        inquilino=Inquilino.objects.get(id_persona=id)
        admin.delete()
        propietario.delete()
        inquilino.delete()
        persona.delete()
        registrar_bitacora(persona,"Borrar usuario",
                           f"se eliminó al usuario {persona.nombre} con id: {persona.id}")    
        return Response({"message": "usuario eliminado con exito"})
        
    except:    
        return Response({"message": "error al eliminar usuario"})
    


@api_view(['GET'])
def obtener_bitacora(request):
    
    registros = Bitacora.objects.all().order_by('-fecha_hora') 
    data = []

    for r in registros:
        data.append({
            "id": r.id_bitacora,
            "usuario": r.id_persona.nombre if r.id_persona else "Desconocido",
            "fecha_hora": r.fecha_hora,
            "accion": r.accion,
            "detalle": r.detalle
        })

    return Response({"bitacora": data})