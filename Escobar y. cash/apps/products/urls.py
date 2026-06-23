from django.urls import path
from . import views

urlpatterns = [
    path('products/', views.product_list, name='admin_product_list'),
    path('products/create/', views.product_create, name='admin_product_create'),
    path('products/<int:pk>/edit/', views.product_edit, name='admin_product_edit'),
    path('products/<int:pk>/delete/', views.product_delete, name='admin_product_delete'),
    path('products/<int:pk>/toggle/', views.product_toggle, name='admin_product_toggle'),
]
