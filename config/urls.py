from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('apps.core.urls')),
    path('admin-panel/', include('apps.accounts.urls')),
    path('admin-panel/', include('apps.categories.urls')),
    path('admin-panel/', include('apps.products.urls')),
    path('admin-panel/', include('apps.banners.urls')),
    path('admin-panel/', include('apps.config_app.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
