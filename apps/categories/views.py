from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from .models import Category


@login_required
def category_list(request):
    categories = Category.objects.all()
    return render(request, 'admin/category_list.html', {'categories': categories})


@login_required
def category_create(request):
    if request.method == 'POST':
        nombre = request.POST.get('nombre', '').strip()
        if nombre:
            Category.objects.create(nombre=nombre)
            messages.success(request, 'Categoría creada correctamente.')
        else:
            messages.error(request, 'El nombre es obligatorio.')
    return redirect('category_list')


@login_required
def category_edit(request, pk):
    category = get_object_or_404(Category, pk=pk)
    if request.method == 'POST':
        nombre = request.POST.get('nombre', '').strip()
        if nombre:
            category.nombre = nombre
            category.save()
            messages.success(request, 'Categoría actualizada correctamente.')
        else:
            messages.error(request, 'El nombre es obligatorio.')
    return redirect('category_list')


@login_required
def category_delete(request, pk):
    category = get_object_or_404(Category, pk=pk)
    category.soft_delete()
    messages.success(request, 'Categoría movida a la papelera.')
    return redirect('category_list')


@login_required
def category_toggle(request, pk):
    category = get_object_or_404(Category, pk=pk)
    category.activo = not category.activo
    category.save()
    messages.success(request, f"Categoría {'activada' if category.activo else 'desactivada'} correctamente.")
    return redirect('category_list')
