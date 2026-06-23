from django.urls import path
from . import views

urlpatterns = [
    path('config/', views.config_edit, name='config_edit'),
]
