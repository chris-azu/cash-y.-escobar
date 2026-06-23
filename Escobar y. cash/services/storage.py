import os
from supabase import create_client
import uuid

_supabase_client = None

def get_client():
    global _supabase_client
    if _supabase_client is None:
        url = os.getenv('SUPABASE_URL')
        key = os.getenv('SUPABASE_KEY')
        if url and key:
            _supabase_client = create_client(url, key)
    return _supabase_client

def upload_image(file_data, folder='products', filename=None):
    client = get_client()
    if not client:
        return None
    bucket = os.getenv('SUPABASE_STORAGE_BUCKET', 'escobar-cash')
    ext = filename.split('.')[-1] if filename else 'png'
    unique_name = f'{folder}/{uuid.uuid4().hex}.{ext}'
    try:
        result = client.storage.from_(bucket).upload(
            unique_name,
            file_data,
            {'content-type': f'image/{ext}'},
            upsert=True
        )
        public_url = client.storage.from_(bucket).get_public_url(unique_name)
        return public_url
    except Exception as e:
        print(f'Error uploading to Supabase Storage: {e}')
        return None

def delete_image(url):
    client = get_client()
    if not client or not url:
        return False
    bucket = os.getenv('SUPABASE_STORAGE_BUCKET', 'escobar-cash')
    path_parts = url.split(f'{bucket}/')
    if len(path_parts) < 2:
        return False
    path = path_parts[-1].split('?')[0]
    try:
        client.storage.from_(bucket).remove([path])
        return True
    except Exception as e:
        print(f'Error deleting from Supabase Storage: {e}')
        return False
