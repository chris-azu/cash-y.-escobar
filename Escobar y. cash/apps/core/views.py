from django.shortcuts import render
from apps.products.models import Product
from apps.categories.models import Category
from apps.banners.models import Banner

def home(request):
    banners = Banner.objects.filter(activo=True)
    products = Product.objects.filter(activo=True).select_related('categoria')[:12]
    return render(request, 'public/index.html', {
        'banners': banners,
        'products': products,
    })

def productos(request):
    categoria_id = request.GET.get('categoria')
    products = Product.objects.filter(activo=True).select_related('categoria')
    if categoria_id:
        products = products.filter(categoria_id=categoria_id)
    categories = Category.objects.filter(activo=True)
    return render(request, 'public/productos.html', {
        'products': products,
        'categories': categories,
        'selected_categoria': int(categoria_id) if categoria_id else None,
    })

def sobre_nosotros(request):
    return render(request, 'public/sobre-nosotros.html')

def contacto(request):
    return render(request, 'public/contacto.html')
