from urllib.parse import quote
from django.conf import settings
from apps.config_app.models import SiteConfig


def get_whatsapp_url(product_name=None):
    config = SiteConfig.get_config()
    number = config.whatsapp or '50575381352'
    if product_name:
        message = config.whatsapp_message.replace('{producto}', product_name).replace('{product}', product_name)
    else:
        message = 'Hola, quiero información sobre sus productos.'
    return f'https://wa.me/{number}?text={quote(message)}'
