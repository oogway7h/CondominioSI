from ..models import Mensualidad,Persona,Pago,DetallePago,Infraccion
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status, permissions
from django.utils import timezone
from ..utils import token_required
from decimal import Decimal 
from django.views.decorators.csrf import csrf_exempt

class PagosViews: 


    @api_view(['GET'])
    def listar_mensualidades(request, id):
        
        try:
            residente = Persona.objects.get(id_persona=id, rol='residente')
        except Persona.DoesNotExist:
            return Response({"error": "Residente no encontrado"}, status=404)

        mensualidades = Mensualidad.objects.filter(id_propiedad__id_persona=residente)
        data = []
        for cuota in mensualidades:
            pago = Pago.objects.filter(id_cuota=cuota).first()
            data.append({
                "id_cuota": cuota.id_cuota,
                "mes": cuota.mes,
                "anio": cuota.anio,
                "id_propiedad": cuota.id_propiedad.id_propiedad,
                "estado": pago.estado if pago else "pendiente",
                "monto": 100.00#pago.monto if pago else None no se como ponerlo dinamico xddd
            })

        return Response(data)

    

    """@api_view(['POST'])
    def registrar_pago(request):
        print("datos recibidos en registrar pago:",request.data)
        data = request.data
        monto = Decimal(str(data['monto']))
        try:
            pago = Pago.objects.create(
                id_cuota_id=data['id_cuota'],
                id_persona_id=data['id_persona'],
                fecha=timezone.now().date(),
                monto=monto,
                estado='pagado',
                anio=timezone.now().year
            )
            return Response({
                "id_pago": pago.id_pago,
                "id_cuota": pago.id_cuota_id,
                "id_persona": pago.id_persona_id,
                "fecha": pago.fecha,
                "monto": str(pago.monto),
                "estado": pago.estado,
                "anio": pago.anio
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)"""
    @csrf_exempt
    @api_view(['POST'])
    def registrar_pago(request):
        try:
            print("datos recibidos en registrar pago:", request.data)
            data = request.data
            monto = Decimal(str(data['monto']))
            id_cuota = data['id_cuota']
            id_persona = data['id_persona']

            # Buscar la mensualidad
            mensualidad = Mensualidad.objects.get(pk=id_cuota)
            mensualidad.estado = 'pagado'
            mensualidad.save()

            # Buscar o crear el pago
            pago, created = Pago.objects.get_or_create(
                id_cuota_id=id_cuota,
                id_persona_id=id_persona,
                defaults={
                    'fecha': timezone.now().date(),
                    'monto': monto,
                    'estado': 'pagado',
                    'anio': timezone.now().year
                }
            )

            if not created:
                # Si ya existía, actualizar los datos
                pago.estado = 'pagado'
                pago.monto = monto
                pago.fecha = timezone.now().date()
                pago.anio = timezone.now().year
                pago.save()

            return Response({
                "id_pago": pago.id_pago,
                "id_cuota": pago.id_cuota_id,
                "id_persona": pago.id_persona_id,
                "fecha": pago.fecha,
                "monto": str(pago.monto),
                "estado": pago.estado,
                "anio": pago.anio,
                "estado_cuota": mensualidad.estado
            }, status=status.HTTP_201_CREATED)

        except Mensualidad.DoesNotExist:
            return Response({"error": "Mensualidad no encontrada"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)




    @csrf_exempt
    @api_view(['POST'])
    def registrar_pago_infraccion(request):
        try:
            data = request.data
            monto = Decimal(str(data['monto']))
            id_infraccion = data['id_infraccion']
            id_persona = data['id_persona']

            infraccion = Infraccion.objects.get(pk=id_infraccion, id_persona_id=id_persona)
            infraccion.estado = 'pagado'
            infraccion.save()
            pago, created = Pago.objects.get_or_create(
                id_infraccion_id=id_infraccion,
                id_persona_id=id_persona,
                defaults={
                    'fecha': timezone.now().date(),
                    'monto': monto,
                    'estado': 'pagado',
                    'anio': timezone.now().year
                }
            )

            
            if not created:
                pago.estado = 'pagado'
                pago.monto = monto
                pago.fecha = timezone.now().date()
                pago.save()

            return Response({
                "id_pago": pago.id_pago,
                "id_infraccion": pago.id_infraccion_id,
                "id_persona": pago.id_persona_id,
                "fecha": pago.fecha,
                "monto": str(pago.monto),
                "estado": pago.estado,
                "anio": pago.anio
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        

    @api_view(['GET'])
    def listar_infracciones(request, id):
        try:
            infracciones = Infraccion.objects.filter(id_persona_id=id)
            data = []
            for i in infracciones:
                data.append({
                    "id_infraccion": i.id_infraccion,
                    "id_persona": i.id_persona_id,
                    "monto": str(i.monto), 
                    "descripcion": i.descripcion,
                    "fecha": i.fecha.strftime("%Y-%m-%d"),  
                    "estado": i.estado,
                })
            return Response(data)
        except Exception as e:
            return Response({"error": str(e)}, status=500)



    @api_view(['GET'])
    def listar_todos_pagos(request):
        try:
            pagos = Pago.objects.all()
            data = []
            for p in pagos:
                data.append({
                    "id_pago": p.id_pago,
                    "tipo": "mensualidad" if p.id_cuota else "infraccion",
                    "id_cuota": p.id_cuota.id_cuota if p.id_cuota else None,
                    "id_infraccion": p.id_infraccion.id_infraccion if p.id_infraccion else None,
                    "id_persona": p.id_persona.id_persona,
                    "monto": str(p.monto),
                    "fecha": p.fecha.strftime("%Y-%m-%d"),
                    "estado": p.estado,
                    "anio": p.anio
                })
            return Response(data)
        except Exception as e:
            return Response({"error": str(e)}, status=500)
        

    @api_view(['PATCH'])
    def cambiar_estado(request, id):
        try:
            pago = Pago.objects.get(id_pago=id)
            nuevo_estado = request.data.get('estado', 'pendiente')  
            pago.estado = nuevo_estado
            pago.save()
            return Response({"id_pago": pago.id_pago, "estado": pago.estado})
        except Pago.DoesNotExist:
            return Response({"error": "Pago no encontrado"}, status=404)
        except Exception as e:
            return Response({"error": str(e)}, status=500)