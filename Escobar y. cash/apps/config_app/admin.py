from django.contrib import admin
from .models import SiteConfig

@admin.register(SiteConfig)
class SiteConfigAdmin(admin.ModelAdmin):
    list_display = ['nombre_tienda', 'whatsapp', 'updated_at']
