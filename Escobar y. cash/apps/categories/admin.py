from django.contrib import admin
from .models import Category

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'activo', 'created_at']
    list_filter = ['activo']
    search_fields = ['nombre']
