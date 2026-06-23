from urllib.parse import quote
from apps.config_app.models import SiteConfig

def get_whatsapp_url(product_name=None):
    config = SiteConfig.get_config()
    number = config.whatsapp.replace('+', '').replace(' ', '')
    message = config.whatsapp_message
    if product_name:
        message = message.replace('[NOMBRE DEL PRODUCTO]', product_name)
    return f'https://wa.me/{number}?text={quote(message)}'
