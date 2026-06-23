from django.db import models


class SiteConfig(models.Model):
    nombre_tienda = models.CharField(max_length=200, default='Escobar y.Cash', verbose_name='Nombre de la tienda')
    slogan = models.CharField(max_length=300, blank=True, default='Calidad y tecnología para tu hogar', verbose_name='Eslogan')
    logo = models.ImageField(upload_to='config/', blank=True, null=True, verbose_name='Logo')

    whatsapp = models.CharField(max_length=50, default='50575381352', verbose_name='Número WhatsApp')
    whatsapp_message = models.TextField(
        default='Hola, me interesa este producto: {producto}. ¿Me podrían indicar el precio y disponibilidad?',
        verbose_name='Mensaje WhatsApp'
    )

    hero_titulo = models.CharField(max_length=200, blank=True, default='Los mejores electrodomésticos', verbose_name='Hero Título')
    hero_subtitulo = models.TextField(blank=True, default='Calidad y tecnología para tu hogar', verbose_name='Hero Subtítulo')

    direccion = models.CharField(max_length=300, blank=True, default='Av. Principal #123, Col. Centro', verbose_name='Dirección')
    telefono = models.CharField(max_length=50, blank=True, default='+505 7538-1352', verbose_name='Teléfono')
    email = models.EmailField(blank=True, default='contacto@escobarycash.com', verbose_name='Email')
    horarios = models.CharField(max_length=200, blank=True, default='Lun - Sab: 9:00 - 20:00 | Dom: 10:00 - 18:00', verbose_name='Horarios')

    facebook = models.URLField(blank=True, default='#', verbose_name='Facebook')
    instagram = models.URLField(blank=True, default='#', verbose_name='Instagram')
    twitter = models.URLField(blank=True, default='#', verbose_name='Twitter (X)')
    tiktok = models.URLField(blank=True, default='#', verbose_name='TikTok')

    about_titulo = models.CharField(max_length=200, blank=True, default='Sobre Nosotros', verbose_name='About Título')
    about_texto = models.TextField(blank=True, default='Somos una empresa dedicada a ofrecer los mejores electrodomésticos para tu hogar.', verbose_name='About Texto')
    about_mision = models.TextField(blank=True, default='Ofrecer productos de calidad que mejoren la vida de nuestros clientes.', verbose_name='About Misión')
    about_vision = models.TextField(blank=True, default='Ser la tienda de electrodomésticos líder en Nicaragua.', verbose_name='About Visión')

    stats_anos = models.IntegerField(default=5, verbose_name='Años de experiencia')
    stats_productos = models.IntegerField(default=500, verbose_name='Productos vendidos')
    stats_clientes = models.IntegerField(default=1000, verbose_name='Clientes satisfechos')
    stats_marcas = models.IntegerField(default=50, verbose_name='Marcas disponibles')

    footer_credit = models.CharField(max_length=200, blank=True, default='© 2025 Escobar y.Cash. Todos los derechos reservados.', verbose_name='Créditos footer')
    footer_descripcion = models.TextField(blank=True, default='Tu tienda de electrodomésticos de confianza.', verbose_name='Descripción footer')

    meta_description = models.CharField(max_length=300, blank=True, default='Escobar y.Cash - Los mejores electrodomésticos para tu hogar', verbose_name='Meta Description')
    meta_keywords = models.CharField(max_length=300, blank=True, default='electrodomésticos, hogar, Nicaragua', verbose_name='Meta Keywords')

    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Creado en')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Actualizado en')

    class Meta:
        verbose_name = 'Configuración'
        verbose_name_plural = 'Configuración'

    def __str__(self):
        return self.nombre_tienda

    @classmethod
    def get_config(cls):
        config, created = cls.objects.get_or_create(pk=1)
        return config
