from django.db import models
from django.utils import timezone


class BannerManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(deleted_at__isnull=True)


class Banner(models.Model):
    titulo = models.CharField(max_length=200, blank=True, verbose_name='Título')
    imagen = models.ImageField(upload_to='banners/', verbose_name='Imagen')
    activo = models.BooleanField(default=True, verbose_name='Activo')
    sort_order = models.IntegerField(default=0, verbose_name='Orden')
    deleted_at = models.DateTimeField(null=True, blank=True, verbose_name='Eliminado en')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Creado en')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Actualizado en')

    objects = BannerManager()
    all_objects = models.Manager()

    class Meta:
        verbose_name = 'Banner'
        verbose_name_plural = 'Banners'
        ordering = ['sort_order']

    def __str__(self):
        return self.titulo or f'Banner #{self.pk}'

    def soft_delete(self):
        self.deleted_at = timezone.now()
        self.activo = False
        self.save()

    def restore(self):
        self.deleted_at = None
        self.activo = True
        self.save()
