-- ElectroHogar - Esquema de Supabase
-- Ejecutar en SQL Editor de Supabase Dashboard

-- 1. TABLAS PRINCIPALES

CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT DEFAULT '',
  is_active BOOLEAN DEFAULT true,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE banners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT DEFAULT '',
  text TEXT DEFAULT '',
  is_active BOOLEAN DEFAULT true,
  deleted_at TIMESTAMPTZ,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE gallery (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT DEFAULT '',
  alt TEXT DEFAULT '',
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE config (
  id INTEGER PRIMARY KEY DEFAULT 1,
  business_name TEXT DEFAULT 'ElectroHogar',
  slogan TEXT DEFAULT 'Calidad y tecnología para tu hogar',
  logo_url TEXT DEFAULT '',
  hero_image TEXT DEFAULT '',
  hero_tag TEXT DEFAULT 'ElectroHogar',
  hero_title TEXT DEFAULT 'Calidad y <span class=\"highlight\">tecnología</span> para tu hogar',
  hero_subtitle TEXT DEFAULT 'Equipa tu hogar con los mejores electrodomésticos de las marcas más reconocidas.',
  banners JSONB DEFAULT '[]',
  address TEXT DEFAULT 'Av. Principal #123, Col. Centro',
  whatsapp TEXT DEFAULT '50575381352',
  phone TEXT DEFAULT '+505 7538-1352',
  email TEXT DEFAULT 'contacto@electrohogar.com',
  social JSONB DEFAULT '{"facebook":"#","instagram":"#","twitter":"#"}',
  hours TEXT DEFAULT 'Lun - Sáb: 9:00 - 20:00 | Dom: 10:00 - 18:00',
  about_text TEXT DEFAULT 'En ElectroHogar nos dedicamos a ofrecer los mejores electrodomésticos.',
  footer_description TEXT DEFAULT 'Calidad y tecnología para tu hogar.',
  footer_credits TEXT DEFAULT 'Todos los derechos reservados.',
  footer_policy TEXT DEFAULT 'Política de Privacidad | Términos y Condiciones',
  meta_description TEXT DEFAULT 'ElectroHogar — Los mejores electrodomésticos para tu hogar.',
  meta_keywords TEXT DEFAULT 'electrodomésticos, hogar, refrigeración, lavandería, cocina',
  cta_title TEXT DEFAULT '¿Buscas un electrodoméstico?',
  cta_text TEXT DEFAULT 'Consulta precios y disponibilidad por WhatsApp.',
  whatsapp_message TEXT DEFAULT 'Hola, me interesa este producto: {NOMBRE_PRODUCTO}. ¿Me podrían indicar el precio y disponibilidad?',
  benefits JSONB DEFAULT '[]',
  testimonials JSONB DEFAULT '[]',
  stats JSONB DEFAULT '[]',
  section_tags JSONB DEFAULT '{}',
  section_titles JSONB DEFAULT '{}',
  section_subtitles JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. SOFT DELETE / PAPELERA

CREATE TABLE trash (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  original_table TEXT NOT NULL,
  original_id UUID,
  data JSONB NOT NULL,
  deleted_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. SEED DATA

INSERT INTO config (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

INSERT INTO categories (name) VALUES
  ('Refrigeración'),
  ('Lavandería'),
  ('Cocina'),
  ('Climatización'),
  ('Electrodomésticos Menores')
ON CONFLICT DO NOTHING;

INSERT INTO products (name, category) VALUES
  ('Refrigerador No Frost 400L', 'Refrigeración'),
  ('Lavadora Automática 20kg', 'Lavandería'),
  ('Microondas Digital 30L', 'Cocina'),
  ('Aire Acondicionado Split 12K BTU', 'Climatización'),
  ('Licuadora Profesional 5 Velocidades', 'Electrodomésticos Menores'),
  ('Televisor Smart 55" 4K UHD', 'Electrodomésticos Menores');

-- 4. ROW LEVEL SECURITY

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE config ENABLE ROW LEVEL SECURITY;
ALTER TABLE trash ENABLE ROW LEVEL SECURITY;

-- Políticas: clientes pueden leer, solo admin autenticado puede escribir
-- Nota: Crear un usuario admin en Authentication > Users primero

CREATE POLICY "products_read_all" ON products FOR SELECT USING (true);
CREATE POLICY "products_admin_all" ON products USING (auth.role() = 'authenticated');

CREATE POLICY "categories_read_all" ON categories FOR SELECT USING (true);
CREATE POLICY "categories_admin_all" ON categories USING (auth.role() = 'authenticated');

CREATE POLICY "banners_read_all" ON banners FOR SELECT USING (true);
CREATE POLICY "banners_admin_all" ON banners USING (auth.role() = 'authenticated');

CREATE POLICY "gallery_read_all" ON gallery FOR SELECT USING (true);
CREATE POLICY "gallery_admin_all" ON gallery USING (auth.role() = 'authenticated');

CREATE POLICY "config_read_all" ON config FOR SELECT USING (true);
CREATE POLICY "config_admin_all" ON config USING (auth.role() = 'authenticated');

CREATE POLICY "trash_admin_all" ON trash USING (auth.role() = 'authenticated');

-- 5. STORAGE BUCKETS
-- Ejecutar en Supabase Dashboard > Storage:
-- 1. Crear bucket: 'product-images' (público)
-- 2. Crear bucket: 'banner-images' (público)
-- 3. Política para lectura pública en ambos buckets
-- 4. Política para escritura solo admin autenticado

/*
CREATE POLICY "storage_read_all" ON storage.objects FOR SELECT USING (true);
CREATE POLICY "storage_admin_all" ON storage.objects USING (auth.role() = 'authenticated');
*/
