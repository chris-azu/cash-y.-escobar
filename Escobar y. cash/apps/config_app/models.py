from django.db import models

class SiteConfig(models.Model):
    nombre_tienda = models.CharField(max_length=200, default='ESCOBAR Y. CASH', verbose_name='Nombre de la tienda')
    slogan = models.CharField(max_length=300, blank=True, default='', verbose_name='Slogan')
    logo_url = models.URLField(max_length=500, blank=True, null=True, verbose_name='URL del logo')

    whatsapp = models.CharField(max_length=20, default='+50575381352', verbose_name='WhatsApp')
    whatsapp_message = models.TextField(
        default='Hola, me interesa este producto: [NOMBRE DEL PRODUCTO]. ¿Me podrían indicar el precio y disponibilidad?',
        verbose_name='Mensaje de WhatsApp'
    )

    hero_titulo = models.CharField(max_length=200, blank=True, default='', verbose_name='Título del Hero')
    hero_subtitulo = models.CharField(max_length=300, blank=True, default='', verbose_name='Subtítulo del Hero')

    direccion = models.CharField(max_length=300, blank=True, default='', verbose_name='Dirección')
    telefono = models.CharField(max_length=20, blank=True, default='', verbose_name='Teléfono')
    email = models.EmailField(blank=True, default='', verbose_name='Email')
    horarios = models.CharField(max_length=200, blank=True, default='', verbose_name='Horarios')

    facebook = models.URLField(blank=True, default='', verbose_name='Facebook')
    instagram = models.URLField(blank=True, default='', verbose_name='Instagram')
    twitter = models.URLField(blank=True, default='', verbose_name='Twitter / X')
    tiktok = models.URLField(blank=True, default='', verbose_name='TikTok')

    about_titulo = models.CharField(max_length=200, blank=True, default='', verbose_name='Título About')
    about_texto = models.TextField(blank=True, default='', verbose_name='Texto About')
    about_mision = models.TextField(blank=True, default='', verbose_name='Misión')
    about_vision = models.TextField(blank=True, default='', verbose_name='Visión')

    stats_anos = models.IntegerField(default=0, verbose_name='Años de experiencia')
    stats_productos = models.IntegerField(default=0, verbose_name='Productos disponibles')
    stats_clientes = models.IntegerField(default=0, verbose_name='Clientes satisfechos')
    stats_marcas = models.IntegerField(default=0, verbose_name='Marcas')

    footer_credit = models.CharField(max_length=200, blank=True, default='', verbose_name='Créditos del footer')
    footer_descripcion = models.TextField(blank=True, default='', verbose_name='Descripción del footer')

    meta_description = models.TextField(blank=True, default='', verbose_name='Meta description')
    meta_keywords = models.TextField(blank=True, default='', verbose_name='Meta keywords')

    primary_color = models.CharField(max_length=7, default='#007AFF', verbose_name='Color primario')
    bg_color = models.CharField(max_length=7, default='#F2F2F7', verbose_name='Color de fondo')
    surface_color = models.CharField(max_length=7, default='#FFFFFF', verbose_name='Color de superficie')
    text_color = models.CharField(max_length=7, default='#1C1C1E', verbose_name='Color de texto')
    header_bg = models.CharField(max_length=7, default='#FFFFFF', verbose_name='Color del header')
    sidebar_bg = models.CharField(max_length=7, default='#FFFFFF', verbose_name='Color del sidebar')
    card_radius = models.IntegerField(default=12, verbose_name='Radio de bordes (px)')
    font_family = models.CharField(max_length=100, default="-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif", verbose_name='Fuente')

    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Creado en')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Actualizado en')

    class Meta:
        verbose_name = 'Configuración'
        verbose_name_plural = 'Configuración'

    def __str__(self):
        return self.nombre_tienda

    @classmethod
    def get_config(cls):
        config, _ = cls.objects.get_or_create(pk=1)
        return config
