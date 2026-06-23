from django.shortcuts import render
from apps.products.models import Product
from apps.categories.models import Category
from apps.banners.models import Banner


def home(request):
    banners = Banner.objects.filter(activo=True)
    featured_products = Product.objects.filter(activo=True)[:6]
    categories = Category.objects.filter(activo=True)
    return render(request, 'index.html', {
        'banners': banners,
        'featured_products': featured_products,
        'categories': categories,
    })


def productos(request):
    category_id = request.GET.get('categoria')
    search = request.GET.get('q', '').strip()
    products = Product.objects.filter(activo=True).select_related('categoria')
    categories = Category.objects.filter(activo=True)

    if category_id:
        products = products.filter(categoria_id=category_id)
    if search:
        products = products.filter(nombre__icontains=search)

    return render(request, 'productos.html', {
        'products': products,
        'categories': categories,
        'current_category': category_id,
        'search': search,
    })


def sobre_nosotros(request):
    return render(request, 'sobre-nosotros.html')


def contacto(request):
    return render(request, 'contacto.html')
