from django.db import models
from apps.categories.models import Category

class ProductManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(deleted_at__isnull=True)

class Product(models.Model):
    nombre = models.CharField(max_length=200, verbose_name='Nombre')
    imagen_url = models.URLField(max_length=500, blank=True, null=True, verbose_name='URL de imagen')
    categoria = models.ForeignKey(
        Category, on_delete=models.SET_NULL, null=True, blank=True,
        related_name='products', verbose_name='Categoría'
    )
    activo = models.BooleanField(default=True, verbose_name='Activo')
    deleted_at = models.DateTimeField(null=True, blank=True, verbose_name='Eliminado en')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Creado en')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Actualizado en')

    objects = ProductManager()
    all_objects = models.Manager()

    def soft_delete(self):
        from django.utils import timezone
        self.deleted_at = timezone.now()
        self.save()

    def restore(self):
        self.deleted_at = None
        self.save()

    class Meta:
        verbose_name = 'Producto'
        verbose_name_plural = 'Productos'
        ordering = ['nombre']

    def __str__(self):
        return self.nombre
