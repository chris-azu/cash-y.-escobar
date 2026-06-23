from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from .models import SiteConfig
from services.storage import upload_image

@login_required
def config_edit(request):
    config = SiteConfig.get_config()
    if request.method == 'POST':
        for field in [
            'nombre_tienda', 'slogan', 'whatsapp', 'whatsapp_message',
            'hero_titulo', 'hero_subtitulo',
            'direccion', 'telefono', 'email', 'horarios',
            'facebook', 'instagram', 'twitter', 'tiktok',
            'about_titulo', 'about_texto', 'about_mision', 'about_vision',
            'stats_anos', 'stats_productos', 'stats_clientes', 'stats_marcas',
            'footer_credit', 'footer_descripcion',
            'meta_description', 'meta_keywords',
        ]:
            value = request.POST.get(field, '')
            setattr(config, field, value)
        if request.FILES.get('logo'):
            file = request.FILES['logo']
            config.logo_url = upload_image(file.read(), 'logos', file.name)
        config.save()
        messages.success(request, 'Configuración guardada correctamente')
        return redirect('admin_config')
    return render(request, 'admin/config_form.html', {'config': config})
