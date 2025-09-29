
# Create your views here.


from rest_framework.decorators import api_view
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from .models import Persona
from .models import Administrador,Aviso
from datetime import datetime, timedelta
import jwt
from django.conf import settings
from .models import Bitacora
from .utils import registrar_bitacora
from .models import Inquilino,Propietario,Privilegio
import secrets
from django.core.mail import send_mail
from django.utils import timezone

from django.db.models import Q



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
        registrar_bitacora(request,persona,"inicio de sesion","inicio sesion correctamente")
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
        registrar_bitacora(request,
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
        #admin = Administrador.objects.get(id_persona=persona.id_persona)

        return Response({
            "nombre": persona.nombre,
            "correo": persona.correo,
            "id": persona.id_persona,
            #"cargo": admin.id_cargo 
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
    
    registrar_bitacora(request,persona,"Cierre de sesion",
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
            try:
                import jwt
                from django.conf import settings
                payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
                persona = Persona.objects.get(correo=payload.get("correo"))
                registrar_bitacora(persona, "Gestionar usuario", "Entró a la vista gestionar usuarios")
            except Exception as e:
                print("Error con token o bitácora:", e)


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
        return Response({"error": str(e)}, status=500   )



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
            "detalle": r.detalle,
            "ip":r.ip
        })

    return Response({"bitacora": data})


@api_view(['POST'])
def obtener_codigo(request):
    correo = request.data.get('correo')
    
    if not correo:
        return Response({"error": "Debe enviar un correo"}, status=400)
    
    try:
        persona = Persona.objects.get(correo=correo)
        codigo_recuperacion = secrets.token_urlsafe(16)
        persona.reset_token = codigo_recuperacion
        persona.reset_token_expiry = timezone.now() + timedelta(minutes=10)
        persona.save()
        
        send_mail(
            subject="Recuperación de contraseña",
            message=f"Para restablecer tu contraseña, haz clic en el siguiente enlace: {codigo_recuperacion}",
            from_email="noreply@smartcondominum.com",
            recipient_list=[correo],
        )
    except Persona.DoesNotExist:
        return Response({"message": "correo no registrado"})
    
    return Response({"message": "Se ha enviado un código de recuperación"})


@api_view(['POST'])
def nueva_contrasena(request):
    correo = request.data.get('correo')
    nuevapass = request.data.get('passwor')
    codigo = request.data.get('reset_token')
    
    try:
        persona = Persona.objects.get(correo=correo)
    except Persona.DoesNotExist:
        return Response({"message": "Correo no registrado"}, status=405)

    if persona.reset_token != codigo:
        return Response({"message": "Código inválido"}, status=400)

    if persona.reset_token_expiry < timezone.now():
        return Response({"message": "El código ha expirado"}, status=400)

    persona.set_password(nuevapass)
    persona.reset_token = None
    persona.reset_token_expiry = None
    persona.save()
    return Response({"message": "Contraseña actualizada con éxito"})



@api_view(['POST'])
def cambiar_contrasena(request):
    token = request.COOKIES.get("access_token")
    if not token:
        return Response({"message": "No autorizado"}, status=401)
    
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        persona = Persona.objects.get(correo=payload.get("correo"))
    except (jwt.ExpiredSignatureError, jwt.DecodeError):
        return Response({"message": "Token inválido"}, status=401)
    except Persona.DoesNotExist:
        return Response({"message": "Usuario no encontrado"}, status=404)
    
    nuevapass = request.data.get("passwor")
    if not nuevapass:
        return Response({"message": "Debe enviar una nueva contraseña"}, status=400)
    
    persona.set_password(nuevapass)
    persona.save()
    
    return Response({"message": "Contraseña actualizada con éxito"})


@api_view(['POST'])
def crear_aviso(request):
    token = request.COOKIES.get("access_token")
    if not token:
        return Response({"error": "No autorizado"}, status=401)

    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        persona = Persona.objects.get(correo=payload.get("correo"))

        if persona.rol != "admin":
            return Response({"error": "No tiene permisos"}, status=403)

        titulo = request.data.get("titulo")
        descripcion = request.data.get("descripcion")
        fecha_expiracion = request.data.get("fecha_expiracion") 

        if not titulo or not descripcion:
            return Response({"error": "Título y descripción requeridos"}, status=400)

        aviso = Aviso(
            titulo=titulo,
            descripcion=descripcion,
            publicado_por=persona,
            visible=True
        )

        if fecha_expiracion:
            try:
                dt = datetime.fromisoformat(fecha_expiracion)
            except ValueError:
                dt = datetime.strptime(fecha_expiracion, "%Y-%m-%d")
            aviso.fecha_expiracion = timezone.make_aware(dt)

        aviso.save()

        registrar_bitacora(request,persona, "Creación de aviso", f"Se creó el aviso '{titulo}'")

        return Response({"message": "Aviso creado con éxito", "id": aviso.id})

    except Exception as e:
        return Response({"error": str(e)}, status=500)
    



@api_view(['GET'])
def mostrar_avisos(request):
    avisos = Aviso.objects.filter(
        visible=True
    ).exclude(
        fecha_expiracion__lt=timezone.now()
    ).order_by("-fecha_publicacion")

    data = [
        {
            "id": aviso.id,
            "titulo": aviso.titulo,
            "descripcion": aviso.descripcion,
            "fecha_publicacion": aviso.fecha_publicacion,
            "fecha_expiracion": aviso.fecha_expiracion,
            "publicado_por": aviso.publicado_por.nombre,
            "vigente": aviso.esta_vigente,
        }
        for aviso in avisos
    ]
    return Response({"avisos": data})



@api_view(['DELETE'])
def eliminar_aviso(request, id):
    token = request.COOKIES.get("access_token")
    if not token:
        return Response({"error": "No autorizado"}, status=401)
    
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        persona = Persona.objects.get(correo=payload.get("correo"))
        if persona.rol != "admin":
            return Response({"error": "No tiene permisos"}, status=403)

        aviso = Aviso.objects.get(id=id)
        aviso.delete()
        #registrar_bitacora(persona, "Eliminación de aviso", f"Se eliminó el aviso '{aviso.titulo}'")
        return Response({"message": "Aviso eliminado correctamente"})
    
    except Aviso.DoesNotExist:
        return Response({"error": "Aviso no encontrado"}, status=404)
    except Exception as e:
        print("Error eliminar_aviso:", e)
        return Response({"error": str(e)}, status=500)


@api_view(['PUT'])
def editar_aviso(request, id):
    token = request.COOKIES.get("access_token")
    if not token:
        return Response({"error": "No autorizado"}, status=401)
    
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        persona = Persona.objects.get(correo=payload.get("correo"))
        if persona.rol != "admin":
            return Response({"error": "No tiene permisos"}, status=403)

        aviso = Aviso.objects.get(id=id)
        titulo = request.data.get("titulo")
        descripcion = request.data.get("descripcion")
        fecha_expiracion = request.data.get("fecha_expiracion")
        visible = request.data.get("visible")

        if titulo:
            aviso.titulo = titulo
        if descripcion:
            aviso.descripcion = descripcion
        if fecha_expiracion:
            from django.utils.dateparse import parse_datetime
            fecha_dt = parse_datetime(fecha_expiracion)
            if fecha_dt is None:
                return Response({"error": "Fecha inválida"}, status=400)
            aviso.fecha_expiracion = fecha_dt
        if visible is not None:
            aviso.visible = visible

        aviso.save()
        registrar_bitacora(persona, "Edición de aviso", f"Se editó el aviso '{aviso.titulo}'")
        return Response({"message": "Aviso actualizado correctamente"})

    except Aviso.DoesNotExist:
        return Response({"error": "Aviso no encontrado"}, status=404)
    except Exception as e:
        return Response({"error": str(e)}, status=500)


