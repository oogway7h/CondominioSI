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
]