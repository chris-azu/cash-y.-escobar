from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from apps.products.models import Product
from apps.categories.models import Category
from apps.banners.models import Banner
from services.soft_delete import get_all_trashed, restore_item, permanent_delete

def login_view(request):
    if request.user.is_authenticated:
        return redirect('admin_dashboard')
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)
        if user:
            login(request, user)
            return redirect('admin_dashboard')
        messages.error(request, 'Usuario o contraseña incorrectos')
    return render(request, 'admin/login.html')

def logout_view(request):
    logout(request)
    return redirect('admin_login')

@login_required
def dashboard(request):
    context = {
        'total_products': Product.objects.count(),
        'total_categories': Category.objects.count(),
        'total_banners': Banner.objects.count(),
        'active_products': Product.objects.filter(activo=True).count(),
        'trashed_count': len(get_all_trashed()),
    }
    return render(request, 'admin/dashboard.html', context)

@login_required
def trash_list(request):
    items = get_all_trashed()
    return render(request, 'admin/trash.html', {'items': items})

@login_required
def trash_restore(request, model_name, pk):
    obj = restore_item(model_name, pk)
    if obj:
        messages.success(request, f'Elemento restaurado correctamente')
    else:
        messages.error(request, 'No se pudo restaurar el elemento')
    return redirect('admin_trash')

@login_required
def trash_delete_permanent(request, model_name, pk):
    if permanent_delete(model_name, pk):
        messages.success(request, 'Elemento eliminado permanentemente')
    else:
        messages.error(request, 'No se pudo eliminar el elemento')
    return redirect('admin_trash')
