# ESCOBAR Y. CASH - Tienda de Electrodomésticos

## Requisitos
- Python 3.14+
- PostgreSQL (Supabase) - o SQLite para desarrollo local

## Configuración rápida

### 1. Activar entorno virtual
```bash
.\venv\Scripts\Activate.ps1
```

### 2. Configurar variables de entorno
Editar `.env` en la raíz del proyecto:
```
USE_SUPABASE=False          # False para desarrollo local con SQLite
DATABASE_URL=postgresql://postgres:password@host:5432/postgres
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_KEY=tu-api-key
SUPABASE_STORAGE_BUCKET=escobar-cash
```

### 3. Ejecutar migraciones
```bash
python manage.py migrate
```

### 4. Crear superusuario
```bash
python manage.py createsuperuser
```

### 5. Iniciar servidor
```bash
python manage.py runserver
```

### 6. Acceder al panel administrativo
- **URL:** http://localhost:8000/admin-panel/login/
- **Usuario:** Creado en paso 4

### 7. Tienda pública
- **URL:** http://localhost:8000/

## Configurar Supabase Storage (Imágenes)

1. Ve a https://pmyymbrwyucnavuotjac.supabase.co
2. Navega a **Storage** → **Create bucket**
3. Nombre: `escobar-cash`
4. Selecciona **Public bucket**
5. Después, ejecuta:
```bash
python create_bucket.py
```

## Para producción (Hostinger / Render / Railway / VPS)

1. Cambiar `DEBUG=False` en `.env`
2. Configurar `ALLOWED_HOSTS` con tu dominio
3. Cambiar `USE_SUPABASE=True` y verificar `DATABASE_URL`
4. Generar nueva `SECRET_KEY`
5. Ejecutar:
```bash
python manage.py migrate
python manage.py collectstatic
python manage.py createsuperuser
```

### Despliegue con Gunicorn
```bash
gunicorn config.wsgi:application -w 4 -b 0.0.0.0:8000
```

## Estructura del proyecto
```
├── config/              # Configuración de Django
├── apps/
│   ├── accounts/        # Autenticación y dashboard
│   ├── categories/      # Categorías CRUD
│   ├── products/        # Productos CRUD
│   ├── banners/         # Banners CRUD
│   ├── config_app/      # Configuración del sitio
│   └── core/            # Vistas públicas
├── services/            # Lógica de negocio (Storage, WhatsApp, Soft Delete)
├── utils/               # Utilidades
├── templates/
│   ├── admin/           # Plantillas del panel administrativo
│   └── public/          # Plantillas de la tienda pública
├── static/
│   ├── css/             # Estilos iOS (azul y blanco)
│   ├── js/              # JavaScript (lightbox, slider, navegación)
│   └── icons/           # SVG icons
├── .env                 # Variables de entorno
├── requirements.txt     # Dependencias
└── manage.py            # Punto de entrada Django
```

## Funcionalidades
- ✅ Panel administrativo mobile-first con navegación inferior
- ✅ Diseño iOS (azul #007AFF + blanco, bordes redondeados, glassmorphism)
- ✅ CRUD real de productos, categorías y banners
- ✅ Imágenes almacenadas en Supabase Storage (solo URLs en BD)
- ✅ Papelera con soft delete (restaurar / eliminar permanentemente)
- ✅ Configuración del sitio 100% editable desde el panel
- ✅ Autenticación segura con sesiones Django
- ✅ Tienda pública responsive (Android, iPhone, Tablet, PC)
- ✅ WhatsApp integrado con número configurable
- ✅ Lightbox para ampliar imágenes
- ✅ Hero slider con banners
- ✅ Filtro de productos por categoría
- ✅ SEO básico configurable
