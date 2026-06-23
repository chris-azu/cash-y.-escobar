from django.contrib import admin
from .models import Banner


@admin.register(Banner)
class BannerAdmin(admin.ModelAdmin):
    list_display = ['titulo', 'activo', 'sort_order', 'created_at']
    list_filter = ['activo']
