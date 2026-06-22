# ElectroHogar — Guia de Instalacion

## Requisitos

- Una cuenta gratuita en [Supabase](https://supabase.com)
- Una cuenta gratuita en [Vercel](https://vercel.com)
- Este codigo subido a un repositorio de GitHub

---

## 1. Configurar Supabase

### 1.1 Crear proyecto
1. Ve a [supabase.com](https://supabase.com) e inicia sesion
2. Haz clic en **New Project**
3. Nombre: `electrohogar`
4. Set a secure database password (guardala)
5. Elige la region mas cercana a Nicaragua (Miami, US)
6. Haz clic en **Create new project**

### 1.2 Ejecutar schema SQL
1. En el dashboard de Supabase, ve a **SQL Editor**
2. Haz clic en **New Query**
3. Abre el archivo `supabase-schema.sql` de este proyecto
4. Copia todo el contenido y pegalo en el editor
5. Haz clic en **Run** (o Ctrl+Enter)

### 1.3 Crear usuario admin
1. Ve a **Authentication** > **Users**
2. Haz clic en **Add User**
3. Email: `admin@electrohogar.com` (o el que prefieras)
4. Password: elige una contrasena segura
5. Haz clic en **Create user**

### 1.4 Configurar Storage
1. Ve a **Storage**
2. Crea dos buckets publicos:
   - `product-images`
   - `banner-images`
3. Para cada bucket, ve a **Policies** y agrega:
   - `SELECT` permitido para todos (publico)
   - `INSERT` solo para usuarios autenticados
   - `DELETE` solo para usuarios autenticados

### 1.5 Obtener credenciales
1. Ve a **Project Settings** > **API**
2. Copia la **Project URL** (algo como `https://xxxxx.supabase.co`)
3. Copia la **anon public key** (cadena larga que empieza con `eyJ...`)

---

## 2. Configurar el Frontend

### Opcion A: Configuracion local (para desarrollo)
1. Abre el panel admin en tu navegador: `admin/login.html`
2. Haz clic en la pestana **Configuracion Local**
3. Ingresa la Project URL y anon key de Supabase
4. Haz clic en **Guardar**

### Opcion B: Configuracion directa en codigo
1. Abre `admin/login.html`
2. Busca la seccion del formulario de Supabase
3. Opcional: configura las variables directamente (no recomendado para produccion)

---

## 3. Desplegar en Vercel

1. Sube este codigo a un repositorio de GitHub
2. Ve a [vercel.com](https://vercel.com) e inicia sesion con GitHub
3. Haz clic en **Add New** > **Project**
4. Importa el repositorio de ElectroHogar
5. Framework Preset: **Other**
6. Build Command: dejalo vacio
7. Output Directory: `.` (el directorio raiz)
8. Haz clic en **Deploy**

### Opcional: Variables de entorno en Vercel
Puedes configurar las credenciales de Supabase como variables de entorno:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

Luego el frontend las leerá desde `process.env` (requiere modificar `supabase.js`).

---

## 4. Acceder al Panel Admin

- URL: `https://tudominio.vercel.app/admin/login.html`
- Metodo 1 (local): Contrasena `admin20$`
- Metodo 2 (Supabase): Email y contrasena del usuario creado en Authentication

---

## 5. Estructura del Proyecto

```
electrohogar/
  index.html              Pagina principal
  productos.html          Catalogo de productos
  sobre-nosotros.html     Pagina informativa
  contacto.html           Pagina de contacto
  galeria.html            Galeria de imagenes
  consultar.html          Redirige a productos
  css/
    style.css             Estilos globales
  js/
    storage.js            Capa de datos (localStorage + Supabase)
    supabase.js           Cliente Supabase
    app.js                Logica del frontend
    admin.js              Logica del panel admin
  admin/
    login.html            Inicio de sesion
    dashboard.html        Panel de administracion
  supabase-schema.sql     Esquema de base de datos
  vercel.json             Configuracion de Vercel
  SETUP.md                Esta guia
```

---

## 6. Almacenamiento de Datos

**LocalStorage (fallback):** Cuando Supabase no esta configurado o no hay conexion, los datos se almacenan en localStorage con prefijo `eh_`.

**Supabase (produccion):** Cuando Supabase esta configurado y el usuario ha iniciado sesion, los datos se sincronizan con:
- **PostgreSQL:** Productos, categorias, banners, configuracion
- **Storage:** Imagenes de productos y banners
- **Authentication:** Login de administrador
