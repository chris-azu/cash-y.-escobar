from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from .models import Banner
from services.storage import upload_image

@login_required
def banner_list(request):
    banners = Banner.objects.all()
    return render(request, 'admin/banner_list.html', {'banners': banners})

@login_required
def banner_create(request):
    if request.method == 'POST':
        titulo = request.POST.get('titulo', '').strip()
        imagen_url = ''
        if request.FILES.get('imagen'):
            file = request.FILES['imagen']
            imagen_url = upload_image(file.read(), 'banners', file.name)
        if not imagen_url:
            messages.error(request, 'La imagen es obligatoria')
        else:
            Banner.objects.create(
                titulo=titulo,
                imagen_url=imagen_url,
            )
            messages.success(request, 'Banner creado correctamente')
            return redirect('admin_banner_list')
    return render(request, 'admin/banner_form.html')

@login_required
def banner_edit(request, pk):
    banner = get_object_or_404(Banner, pk=pk)
    if request.method == 'POST':
        titulo = request.POST.get('titulo', '').strip()
        banner.titulo = titulo
        if request.FILES.get('imagen'):
            file = request.FILES['imagen']
            banner.imagen_url = upload_image(file.read(), 'banners', file.name)
        banner.save()
        messages.success(request, 'Banner actualizado correctamente')
        return redirect('admin_banner_list')
    return render(request, 'admin/banner_form.html', {'banner': banner})

@login_required
def banner_delete(request, pk):
    banner = get_object_or_404(Banner, pk=pk)
    banner.soft_delete()
    messages.success(request, 'Banner movido a la papelera')
    return redirect('admin_banner_list')

@login_required
def banner_toggle(request, pk):
    banner = get_object_or_404(Banner, pk=pk)
    banner.activo = not banner.activo
    banner.save()
    status = 'activado' if banner.activo else 'desactivado'
    messages.success(request, f'Banner {status} correctamente')
    return redirect('admin_banner_list')
