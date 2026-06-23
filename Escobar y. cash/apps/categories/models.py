from django.db import models

class CategoryManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(deleted_at__isnull=True)

class Category(models.Model):
    nombre = models.CharField(max_length=100, verbose_name='Nombre')
    activo = models.BooleanField(default=True, verbose_name='Activo')
    deleted_at = models.DateTimeField(null=True, blank=True, verbose_name='Eliminado en')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Creado en')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Actualizado en')

    objects = CategoryManager()
    all_objects = models.Manager()

    def soft_delete(self):
        from django.utils import timezone
        self.deleted_at = timezone.now()
        self.save()

    def restore(self):
        self.deleted_at = None
        self.save()

    class Meta:
        verbose_name = 'Categoría'
        verbose_name_plural = 'Categorías'
        ordering = ['nombre']

    def __str__(self):
        return self.nombre
