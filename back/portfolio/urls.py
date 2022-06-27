from django.urls import path
# from . import views
from .views import *

urlpatterns = [
    path('api/projects/', ProjectList.as_view()),
    path('api/projects/<int:pk>', ProjectDetailed.as_view()),
    path('api/catskill/', CatSkiList.as_view()),
    path('api/sendemail/', Sendemail.as_view(), name='email')
]
