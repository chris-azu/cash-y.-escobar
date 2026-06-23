from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from .models import Product
from apps.categories.models import Category
from services.storage import upload_image

@login_required
def product_list(request):
    products = Product.objects.select_related('categoria').all()
    return render(request, 'admin/product_list.html', {'products': products})

@login_required
def product_create(request):
    categories = Category.objects.filter(activo=True)
    if request.method == 'POST':
        nombre = request.POST.get('nombre', '').strip()
        categoria_id = request.POST.get('categoria')
        if not nombre:
            messages.error(request, 'El nombre es obligatorio')
        else:
            imagen_url = ''
            if request.FILES.get('imagen'):
                file = request.FILES['imagen']
                imagen_url = upload_image(file.read(), 'products', file.name)
            product = Product.objects.create(
                nombre=nombre,
                imagen_url=imagen_url or None,
                categoria_id=categoria_id or None,
            )
            messages.success(request, 'Producto creado correctamente')
            return redirect('admin_product_list')
    return render(request, 'admin/product_form.html', {'categories': categories})

@login_required
def product_edit(request, pk):
    product = get_object_or_404(Product, pk=pk)
    categories = Category.objects.filter(activo=True)
    if request.method == 'POST':
        nombre = request.POST.get('nombre', '').strip()
        categoria_id = request.POST.get('categoria')
        if not nombre:
            messages.error(request, 'El nombre es obligatorio')
        else:
            product.nombre = nombre
            product.categoria_id = categoria_id or None
            if request.FILES.get('imagen'):
                file = request.FILES['imagen']
                product.imagen_url = upload_image(file.read(), 'products', file.name)
            product.save()
            messages.success(request, 'Producto actualizado correctamente')
            return redirect('admin_product_list')
    return render(request, 'admin/product_form.html', {'product': product, 'categories': categories})

@login_required
def product_delete(request, pk):
    product = get_object_or_404(Product, pk=pk)
    product.soft_delete()
    messages.success(request, 'Producto movido a la papelera')
    return redirect('admin_product_list')

@login_required
def product_toggle(request, pk):
    product = get_object_or_404(Product, pk=pk)
    product.activo = not product.activo
    product.save()
    status = 'activado' if product.activo else 'desactivado'
    messages.success(request, f'Producto {status} correctamente')
    return redirect('admin_product_list')
