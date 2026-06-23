from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout
from django.shortcuts import render, redirect
from django.contrib import messages
from apps.products.models import Product
from apps.categories.models import Category
from apps.banners.models import Banner


def login_view(request):
    if request.user.is_authenticated:
        return redirect('dashboard')
    if request.method == 'POST':
        username = request.POST.get('username', '')
        password = request.POST.get('password', '')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            messages.success(request, f'Bienvenido, {user.username}.')
            return redirect('dashboard')
        else:
            messages.error(request, 'Usuario o contraseña incorrectos.')
    return render(request, 'admin/login.html')


@login_required
def logout_view(request):
    logout(request)
    return redirect('admin_login')


@login_required
def dashboard(request):
    total_products = Product.objects.count()
    active_products = Product.objects.filter(activo=True).count()
    inactive_products = Product.objects.filter(activo=False).count()
    total_categories = Category.objects.count()
    total_banners = Banner.objects.count()
    trashed_products = Product.all_objects.filter(deleted_at__isnull=False).count()
    trashed_categories = Category.all_objects.filter(deleted_at__isnull=False).count()
    trashed_banners = Banner.all_objects.filter(deleted_at__isnull=False).count()

    return render(request, 'admin/dashboard.html', {
        'total_products': total_products,
        'active_products': active_products,
        'inactive_products': inactive_products,
        'total_categories': total_categories,
        'total_banners': total_banners,
        'trashed_items': trashed_products + trashed_categories + trashed_banners,
    })
