from django.contrib import admin
from .models import Product

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'categoria', 'activo', 'created_at']
    list_filter = ['activo', 'categoria']
    search_fields = ['nombre']
