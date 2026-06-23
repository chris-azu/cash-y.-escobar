from django.db import models

class BannerManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(deleted_at__isnull=True)

class Banner(models.Model):
    titulo = models.CharField(max_length=200, blank=True, verbose_name='Título')
    imagen_url = models.URLField(max_length=500, verbose_name='URL de imagen')
    activo = models.BooleanField(default=True, verbose_name='Activo')
    sort_order = models.IntegerField(default=0, verbose_name='Orden')
    deleted_at = models.DateTimeField(null=True, blank=True, verbose_name='Eliminado en')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Creado en')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Actualizado en')

    objects = BannerManager()
    all_objects = models.Manager()

    def soft_delete(self):
        from django.utils import timezone
        self.deleted_at = timezone.now()
        self.save()

    def restore(self):
        self.deleted_at = None
        self.save()

    class Meta:
        verbose_name = 'Banner'
        verbose_name_plural = 'Banners'
        ordering = ['sort_order']

    def __str__(self):
        return self.titulo or f'Banner #{self.id}'
