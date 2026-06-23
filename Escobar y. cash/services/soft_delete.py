from apps.products.models import Product
from apps.categories.models import Category
from apps.banners.models import Banner

def get_models_with_soft_delete():
    return [Product, Category, Banner]

def get_all_trashed():
    items = []
    for model in get_models_with_soft_delete():
        qs = model.all_objects.filter(deleted_at__isnull=False)
        for obj in qs:
            items.append({
                'id': obj.id,
                'nombre': str(obj),
                'tipo': model._meta.verbose_name,
                'modelo': model.__name__.lower(),
                'deleted_at': obj.deleted_at,
                'obj': obj,
            })
    items.sort(key=lambda x: x['deleted_at'], reverse=True)
    return items

def restore_item(model_name, pk):
    model_map = {m.__name__.lower(): m for m in get_models_with_soft_delete()}
    model = model_map.get(model_name)
    if not model:
        return None
    obj = model.all_objects.filter(pk=pk).first()
    if obj and obj.deleted_at:
        obj.restore()
        return obj
    return None

def permanent_delete(model_name, pk):
    model_map = {m.__name__.lower(): m for m in get_models_with_soft_delete()}
    model = model_map.get(model_name)
    if not model:
        return False
    obj = model.all_objects.filter(pk=pk).first()
    if obj:
        obj.delete()
        return True
    return False
