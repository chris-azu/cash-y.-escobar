from django.urls import path
from . import views, trash_views

urlpatterns = [
    path('login/', views.login_view, name='admin_login'),
    path('logout/', views.logout_view, name='admin_logout'),
    path('dashboard/', views.dashboard, name='dashboard'),
    path('trash/', trash_views.trash_list, name='trash_list'),
    path('trash/restore/<str:model_name>/<int:pk>/', trash_views.trash_restore, name='trash_restore'),
    path('trash/delete/<str:model_name>/<int:pk>/', trash_views.trash_delete_permanent, name='trash_delete_permanent'),
]
