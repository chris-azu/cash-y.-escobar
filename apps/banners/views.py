from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from .models import Banner


@login_required
def banner_list(request):
    banners = Banner.objects.all()
    return render(request, 'admin/banner_list.html', {'banners': banners})


@login_required
def banner_create(request):
    if request.method == 'POST':
        titulo = request.POST.get('titulo', '').strip()
        sort_order = request.POST.get('sort_order', 0)
        banner = Banner.objects.create(
            titulo=titulo,
            sort_order=int(sort_order) if sort_order else 0,
        )
        if 'imagen' in request.FILES:
            banner.imagen = request.FILES['imagen']
            banner.save()
        messages.success(request, 'Banner creado correctamente.')
    return redirect('banner_list')


@login_required
def banner_edit(request, pk):
    banner = get_object_or_404(Banner, pk=pk)
    if request.method == 'POST':
        banner.titulo = request.POST.get('titulo', '').strip()
        banner.sort_order = int(request.POST.get('sort_order', 0))
        if 'imagen' in request.FILES:
            banner.imagen = request.FILES['imagen']
        banner.save()
        messages.success(request, 'Banner actualizado correctamente.')
    return redirect('banner_list')


@login_required
def banner_delete(request, pk):
    banner = get_object_or_404(Banner, pk=pk)
    banner.soft_delete()
    messages.success(request, 'Banner movido a la papelera.')
    return redirect('banner_list')


@login_required
def banner_toggle(request, pk):
    banner = get_object_or_404(Banner, pk=pk)
    banner.activo = not banner.activo
    banner.save()
    messages.success(request, f"Banner {'activado' if banner.activo else 'desactivado'} correctamente.")
    return redirect('banner_list')
