from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.login_view, name='admin_login'),
    path('logout/', views.logout_view, name='admin_logout'),
    path('', views.dashboard, name='admin_dashboard'),
    path('trash/', views.trash_list, name='admin_trash'),
    path('trash/restore/<str:model_name>/<int:pk>/', views.trash_restore, name='admin_trash_restore'),
    path('trash/delete/<str:model_name>/<int:pk>/', views.trash_delete_permanent, name='admin_trash_delete'),
]
