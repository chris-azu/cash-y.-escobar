from django.urls import path
from . import views

urlpatterns = [
    path('banners/', views.banner_list, name='banner_list'),
    path('banners/create/', views.banner_create, name='banner_create'),
    path('banners/<int:pk>/edit/', views.banner_edit, name='banner_edit'),
    path('banners/<int:pk>/delete/', views.banner_delete, name='banner_delete'),
    path('banners/<int:pk>/toggle/', views.banner_toggle, name='banner_toggle'),
]
