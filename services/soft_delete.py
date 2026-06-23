from django.db import models
from django.utils import timezone


def get_all_trashed():
    results = []
    for model_class in get_models_with_soft_delete():
        items = model_class.all_objects.filter(deleted_at__isnull=False)
        for item in items:
            results.append({
                'id': item.pk,
                'model_name': model_class._meta.verbose_name,
                'model_class': model_class.__name__.lower(),
                'nombre': str(item),
                'deleted_at': item.deleted_at,
            })
    return sorted(results, key=lambda x: x['deleted_at'], reverse=True)


def get_models_with_soft_delete():
    from apps.products.models import Product
    from apps.categories.models import Category
    from apps.banners.models import Banner
    return [Product, Category, Banner]


def restore_item(model_name, pk):
    models = {m.__name__.lower(): m for m in get_models_with_soft_delete()}
    model = models.get(model_name)
    if model:
        item = model.all_objects.filter(pk=pk, deleted_at__isnull=False).first()
        if item:
            item.restore()
            return True
    return False


def permanent_delete(model_name, pk):
    models = {m.__name__.lower(): m for m in get_models_with_soft_delete()}
    model = models.get(model_name)
    if model:
        item = model.all_objects.filter(pk=pk, deleted_at__isnull=False).first()
        if item:
            item.delete()
            return True
    return False
