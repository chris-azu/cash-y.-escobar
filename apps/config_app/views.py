from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
from django.contrib import messages
from .models import SiteConfig


@login_required
def config_edit(request):
    config = SiteConfig.get_config()
    if request.method == 'POST':
        fields = [
            'nombre_tienda', 'slogan', 'whatsapp', 'whatsapp_message',
            'hero_titulo', 'hero_subtitulo',
            'direccion', 'telefono', 'email', 'horarios',
            'facebook', 'instagram', 'twitter', 'tiktok',
            'about_titulo', 'about_texto', 'about_mision', 'about_vision',
            'stats_anos', 'stats_productos', 'stats_clientes', 'stats_marcas',
            'footer_credit', 'footer_descripcion',
            'meta_description', 'meta_keywords',
        ]
        for field in fields:
            value = request.POST.get(field, '')
            if field.startswith('stats_'):
                try:
                    value = int(value)
                except (ValueError, TypeError):
                    value = 0
            setattr(config, field, value)

        if 'logo' in request.FILES:
            config.logo = request.FILES['logo']

        config.save()
        messages.success(request, 'Configuración actualizada correctamente.')
        return redirect('config_edit')

    return render(request, 'admin/config_form.html', {'config': config})
