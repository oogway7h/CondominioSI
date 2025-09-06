from django.urls import path
from .views import login_api  
from .views import registro

urlpatterns =[
    path('login/', login_api, name='login_api'),
    path('registro/', registro, name='registro'),
]