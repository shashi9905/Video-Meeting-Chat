from django.urls import path
from .views import *  

urlpatterns = [
    path('room/', room, ),  
    path('lobby/', Lobby, ),
    path('home/', main) ,
    path('get_token/' , getToken),
    path('create_member/',createMember),
    path('get_member/', getMember),
]

