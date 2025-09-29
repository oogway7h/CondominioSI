from ..models import Propiedad, Persona,Privilegio,Infraccion,Vehiculo
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from ..utils import registrar_bitacora
import jwt
from django.conf import settings


class PropiedadViews:

    @api_view(['POST'])
    def agregar_propiedad(request, id):
        ubicacion = request.data.get('ubicacion')
        pertenece_a = request.data.get('pertenece_a') 

        if not ubicacion:
            return Response(
                {"message": "La ubicación es obligatoria"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            persona = Persona.objects.get(id_persona=id)
        except Persona.DoesNotExist:
            return Response(
                {"message": "La persona no existe"},
                status=status.HTTP_404_NOT_FOUND
            )

        try:
            propiedad = Propiedad.objects.create(
                ubicacion=ubicacion,
                id_persona=persona,
                pertenece_a=pertenece_a if pertenece_a else "N/A"
            )
            return Response(
                {
                    "message": "Propiedad agregada correctamente",
                    "propiedad": {
                        "id_propiedad": propiedad.id_propiedad,
                        "ubicacion": propiedad.ubicacion,
                        "pertenece_a": propiedad.pertenece_a,
                        "id_persona": propiedad.id_persona.id_persona,
                    }
                },
                status=status.HTTP_201_CREATED
            )
        except Exception as e:
            return Response(
                {"message": f"Error al agregar la propiedad: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


    @api_view(['GET'])
    def obtener_privilegios(request):
        try:
            token = request.COOKIES.get('access_token')
            if not token:
                return Response({"error": "No autorizado"}, status=401)

            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
            Persona.objects.get(correo=payload.get("correo")) 
            personas_qs = Persona.objects.all()
            privilegios_qs = Privilegio.objects.select_related('id_persona').all()
            def _get_persona_key(persona_obj):
                return getattr(persona_obj, "id_persona", persona_obj.pk)

            priv_map = {
                _get_persona_key(p.id_persona): p
                for p in privilegios_qs
                if p.id_persona is not None
            }

            usuarios = []
            for persona in personas_qs:
                if persona.rol!="admin":    
                    key = _get_persona_key(persona)
                    priv = priv_map.get(key)

                    usuarios.append({
                        "id": key,
                        "nombre": getattr(persona, "nombre", ""),
                        "correo": getattr(persona, "correo", ""),
                        "corte_cesped": getattr(priv, "corte_cesped", False),
                        "entrada_auto": getattr(priv, "entrada_auto", False),
                        "recojo_basura": getattr(priv, "recojo_basura", False),
                        "avisos_visita": getattr(priv, "avisos_visita", False),
                        "acceso_gimnasio": getattr(priv, "acceso_gimnasio", False),
                        "acceso_piscina": getattr(priv, "acceso_piscina", False),
                        "acceso_sala_eventos": getattr(priv, "acceso_sala_eventos", False),
                        "permisos_especiales": getattr(priv, "permisos_especiales", False),
                    })

            return Response({"usuarios": usuarios}, status=200)

        except Persona.DoesNotExist:
            return Response({"error": "Usuario del token no existe"}, status=401)
        except jwt.ExpiredSignatureError:
            return Response({"error": "Token expirado"}, status=401)
        except jwt.InvalidTokenError:
            return Response({"error": "Token inválido"}, status=401)
        except Exception as e:
            return Response({"error": str(e)}, status=500)
        


    @api_view(['PATCH'])
    def actualizar_privilegios(request, id):
        try:
            privilegio = Privilegio.objects.get(id_persona=id)

            for campo, valor in request.data.items():
                if hasattr(privilegio, campo):
                    setattr(privilegio, campo, valor)

            privilegio.save()
            return Response({"message": "Privilegios actualizados con éxito"}, status=200)

        except Privilegio.DoesNotExist:
            return Response({"error": "Privilegios no encontrados"}, status=404)
        except Exception as e:
            return Response({"error": str(e)}, status=500)
        

    @api_view(['POST'])
    def agregar_infraccion(request, id):
        monto = request.data.get('monto')
        descripcion = request.data.get('descripcion')
        fecha = request.data.get('fecha')
        estado = request.data.get('estado')

        try:
            persona = Persona.objects.get(id_persona=id)
            infraccion = Infraccion.objects.create(
                id_persona=persona,   
                monto=monto,
                descripcion=descripcion,
                fecha=fecha,
                estado=estado
            )
            return Response({"message": "Infracción registrada con éxito", "id_infraccion": infraccion.id_infraccion})
        except Exception as e:
            return Response({"message": f"Error al agregar infracción: {str(e)}"}, status=400)
    
    
    
    
    @api_view(['POST'])
    def gestionar_vehiculo(request):
        placa = request.data.get('placa')
        id_persona = request.data.get('persona')
        marca = request.data.get('marca')
        modelo = request.data.get('modelo')
        color = request.data.get('color')

        try:
            persona = Persona.objects.get(id_persona=id_persona)
        except Persona.DoesNotExist:
            return Response({"message": "La persona no existe"}, status=404)

    
        try:
            vehiculo, creado = Vehiculo.objects.update_or_create(
                placa=placa,
                defaults={
                    "id_persona": persona,
                    "marca": marca,
                    "modelo": modelo,
                    "color": color,
                }
            )

            data = {
                "placa": vehiculo.placa,
                "persona": vehiculo.id_persona.id_persona,
                "marca": vehiculo.marca,
                "modelo": vehiculo.modelo,
                "color": vehiculo.color,
            }

            if creado:
                return Response({
                    "message": "Vehículo registrado con éxito",
                    "vehiculo": data
                }, status=201)
            else:
                return Response({
                    "message": "Vehículo actualizado con éxito",
                    "vehiculo": data
                }, status=200)

        except Exception as e:
            return Response({"message": f"Error al gestionar vehículo: {str(e)}"}, status=400)