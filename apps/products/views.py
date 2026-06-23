from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from .models import Product
from apps.categories.models import Category


@login_required
def product_list(request):
    products = Product.objects.select_related('categoria').all()
    categories = Category.objects.all()
    return render(request, 'admin/product_list.html', {
        'products': products,
        'categories': categories,
    })


@login_required
def product_create(request):
    if request.method == 'POST':
        nombre = request.POST.get('nombre', '').strip()
        categoria_id = request.POST.get('categoria')
        if nombre:
            product = Product.objects.create(
                nombre=nombre,
                categoria_id=categoria_id if categoria_id else None,
            )
            if 'imagen' in request.FILES:
                product.imagen = request.FILES['imagen']
                product.save()
            messages.success(request, 'Producto creado correctamente.')
        else:
            messages.error(request, 'El nombre es obligatorio.')
    return redirect('product_list')


@login_required
def product_edit(request, pk):
    product = get_object_or_404(Product, pk=pk)
    if request.method == 'POST':
        nombre = request.POST.get('nombre', '').strip()
        categoria_id = request.POST.get('categoria')
        if nombre:
            product.nombre = nombre
            product.categoria_id = categoria_id if categoria_id else None
            if 'imagen' in request.FILES:
                product.imagen = request.FILES['imagen']
            product.save()
            messages.success(request, 'Producto actualizado correctamente.')
        else:
            messages.error(request, 'El nombre es obligatorio.')
    return redirect('product_list')


@login_required
def product_delete(request, pk):
    product = get_object_or_404(Product, pk=pk)
    product.soft_delete()
    messages.success(request, 'Producto movido a la papelera.')
    return redirect('product_list')


@login_required
def product_toggle(request, pk):
    product = get_object_or_404(Product, pk=pk)
    product.activo = not product.activo
    product.save()
    messages.success(request, f"Producto {'activado' if product.activo else 'desactivado'} correctamente.")
    return redirect('product_list')
