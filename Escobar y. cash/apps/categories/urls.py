from django.urls import path
from . import views

urlpatterns = [
    path('categories/', views.category_list, name='admin_category_list'),
    path('categories/create/', views.category_create, name='admin_category_create'),
    path('categories/<int:pk>/edit/', views.category_edit, name='admin_category_edit'),
    path('categories/<int:pk>/delete/', views.category_delete, name='admin_category_delete'),
    path('categories/<int:pk>/toggle/', views.category_toggle, name='admin_category_toggle'),
]
