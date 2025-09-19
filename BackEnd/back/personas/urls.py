from django.urls import path
from .views import login_api  
from .views import registro
from .views import obtener_datos
from . import views as v

urlpatterns =[
    path('login/', login_api, name='login_api'),
    path('registro/', registro, name='registro'),
    path('obtener_datos/', obtener_datos, name='obtener_datos'),
    path('cerrar_sesion/',v.cerrar_sesion, name='cerrar_sesion'),
    path('gestionar_usuario/', v.gestionar_usuario, name='gestionar_usuario'),
    path('eliminar_usuario/<int:id>/',v.eliminar_usuario, name='eliminar_usuario'),
    path('bitacora/',v.obtener_bitacora, name='bitacora')
]