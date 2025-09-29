from django.urls import path
from .views import login_api  
from .views import registro
from .views import obtener_datos
from . import views as v
from .view.propiedasdes import PropiedadViews as p
from .view.pagos import PagosViews as pv


urlpatterns =[
    path('login/', login_api, name='login_api'),
    path('registro/', registro, name='registro'),
    path('obtener_datos/', obtener_datos, name='obtener_datos'),
    path('cerrar_sesion/',v.cerrar_sesion, name='cerrar_sesion'),
    path('gestionar_usuario/', v.gestionar_usuario, name='gestionar_usuario'),
    path('eliminar_usuario/<int:id>/',v.eliminar_usuario, name='eliminar_usuario'),
    path('bitacora/',v.obtener_bitacora, name='bitacora'),
    path('registrar_propiedad/<int:id>/', p.agregar_propiedad, name='registrar_propiedad'),    
    path('gestionar_privilegios/',p.obtener_privilegios,name='gestionar_privilegios'),
    path('actualizar_privilegios/<int:id>/',p.actualizar_privilegios, name='actualizar_privilegios' ),
    path('agregar_infraccion/<int:id>/',p.agregar_infraccion,name='agregar_infraccion'),
    path('obtener_codigo/',v.obtener_codigo,name='obtener_codigo'),    
    path('nueva_contrasena/',v.nueva_contrasena,name='nueva_contrasena'),
    path('cambiar_contrasena/',v.cambiar_contrasena,name='cambiar_contrasena'),
    path('gestionar_vehiculo/',p.gestionar_vehiculo,name='gestionar_vehiculo') ,
    path('crear_aviso/',v.crear_aviso,name='crear_aviso'),
    path('mostrar_avisos/',v.mostrar_avisos,name='mostrar_avisos'),
    path('eliminar_aviso/<int:id>/',v.eliminar_aviso,name='eliminar_aviso'),
    path('editar_aviso/<int:id>/',v.editar_aviso,name='editar_aviso'),

    path('listar_mensualidades/<int:id>/',pv.listar_mensualidades,name='listar_mensualidades'),
    path('registrar_pago/',pv.registrar_pago,name='registrar_pago'),
    path('registrar_pago_infraccion/',pv.registrar_pago_infraccion,name='registrar_pago_infraccion'),
    path('listar_infracciones/<int:id>/',pv.listar_infracciones,name='listar_infracciones'),
    path('listar_todos_pagos/',pv.listar_todos_pagos,name='listar_todos_pagos'),
    path('cambiar_estado/<int:id>/', pv.cambiar_estado, name='cambiar_estado'),

]   