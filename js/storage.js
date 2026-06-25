const EH_DATA = (function () {
  'use strict';

  const PREFIX = 'eh_';

  // ── localStorage helpers ──

  function lsGet(key) {
    try { return JSON.parse(localStorage.getItem(PREFIX + key)); }
    catch { return null; }
  }

  function lsSet(key, data) {
    localStorage.setItem(PREFIX + key, JSON.stringify(data));
  }

  // ── Visible DB log ──
  const dbLogs = [];

  function showDbLog(msg, type = 'info') {
    const time = new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    dbLogs.push({ time, msg, type });
    const container = document.getElementById('dbLogEntries');
    if (container) {
      const line = document.createElement('div');
      line.className = 'db-log-line db-log-' + type;
      line.textContent = `[${time}] ${msg}`;
      container.appendChild(line);
      container.scrollTop = container.scrollHeight;
    }
    console.log(`[DB] ${type}: ${msg}`);
  }

  // ── Default seed data ──

  const DEFAULTS = {
    categories: ['Refrigeración', 'Lavandería', 'Cocina', 'Climatización', 'Electrodomésticos Menores'],
    products: [
      { id: 1, name: 'Refrigerador No Frost 400L', category: 'Refrigeración', image: '', is_active: true, deleted_at: null },
      { id: 2, name: 'Lavadora Automática 20kg', category: 'Lavandería', image: '', is_active: true, deleted_at: null },
      { id: 3, name: 'Microondas Digital 30L', category: 'Cocina', image: '', is_active: true, deleted_at: null },
      { id: 4, name: 'Aire Acondicionado Split 12K BTU', category: 'Climatización', image: '', is_active: true, deleted_at: null },
      { id: 5, name: 'Licuadora Profesional 5 Velocidades', category: 'Electrodomésticos Menores', image: '', is_active: true, deleted_at: null },
      { id: 6, name: 'Televisor Smart 55" 4K UHD', category: 'Electrodomésticos Menores', image: '', is_active: true, deleted_at: null },
    ],
    config: {
      businessName: 'ElectroHogar',
      slogan: 'Calidad y tecnología para tu hogar',
      logo: '',
      heroTag: 'ElectroHogar',
      heroTitle: 'Calidad y <span class="highlight">tecnología</span> para tu hogar',
      heroSubtitle: 'Equipa tu hogar con los mejores electrodomésticos de las marcas más reconocidas. Te asesoramos para encontrar el producto ideal.',
      banners: [
        { id: 1, url: '', alt: 'Hero Principal', ubicacion: 'hero' },
        { id: 2, url: '', alt: 'Banner Secundario 1', ubicacion: 'secundario1' },
        { id: 3, url: '', alt: 'Banner Secundario 2', ubicacion: 'secundario2' },
        { id: 4, url: '', alt: 'Banner Secundario 3', ubicacion: 'secundario3' },
      ],
      address: 'Jinotepe, Carazo, Nicaragua',
      whatsapp: '50575381352',
      phone: '+505 7538-1352',
      email: 'contacto@electrohogar.com',
      social: { facebook: '#', instagram: '#', twitter: '#' },
      hours: 'Lun - Sáb: 9:00 - 20:00 | Dom: 10:00 - 18:00',
      aboutText: 'En ElectroHogar nos dedicamos a ofrecer los mejores electrodomésticos para tu hogar. Trabajamos con las marcas más reconocidas del mercado, garantizando calidad, durabilidad y el mejor precio.',
      footerDescription: 'Calidad y tecnología para tu hogar. Electrodomésticos de las mejores marcas con los precios más competitivos.',
      footerCredits: 'Todos los derechos reservados.',
      footerPolicy: 'Política de Privacidad | Términos y Condiciones',
      metaDescription: 'ElectroHogar — Los mejores electrodomésticos para tu hogar. Refrigeración, lavandería, cocina, climatización y más. ¡Cotiza por WhatsApp!',
      metaKeywords: 'electrodomésticos, hogar, refrigeración, lavandería, cocina, climatización, WhatsApp',
      ctaTitle: '¿Buscas un electrodoméstico?',
      ctaText: 'Consulta precios y disponibilidad por WhatsApp. Te responderemos a la brevedad.',
      whatsappMessage: 'Hola, me interesa este producto: {NOMBRE_PRODUCTO}. ¿Me podrían indicar el precio y disponibilidad?',
      benefits: [
        { icon: 'award', title: 'Marcas Reconocidas', text: 'Trabajamos con las mejores marcas del mercado para garantizarte calidad y durabilidad en cada producto.' },
        { icon: 'message-circle', title: 'Asesoría Personalizada', text: 'Te ayudamos a elegir el electrodoméstico ideal para tus necesidades. Consulta por WhatsApp y recibe atención experta.' },
        { icon: 'truck', title: 'Envío Rápido', text: 'Recibe tu pedido en la puerta de tu casa. Contamos con logística eficiente para entregas seguras y puntuales.' },
        { icon: 'wrench', title: 'Soporte Técnico', text: 'Respaldamos cada venta con servicio postventa y soporte técnico profesional para tu tranquilidad.' }
      ],
      testimonials: [
        { name: 'María G.', role: 'Cliente satisfecha', text: 'Excelente atención y muy buen precio. Me ayudaron a elegir el refrigerador perfecto para mi cocina.', initial: 'M' },
        { name: 'Carlos R.', role: 'Cliente habitual', text: 'Compré mi lavadora con ellos y el proceso fue muy sencillo. La asesoría por WhatsApp fue rápida y resolvieron todas mis dudas.', initial: 'C' },
        { name: 'Ana L.', role: 'Cliente frecuente', text: 'El aire acondicionado que compré funciona de maravilla. La instalación fue rápida y el equipo se nota de buena calidad.', initial: 'A' }
      ],
      stats: [
        { icon: 'calendar', value: '2016', label: 'Año de fundación' },
        { icon: 'package', value: '+10K', label: 'Productos vendidos' },
        { icon: 'tag', value: '+50', label: 'Marcas disponibles' },
        { icon: 'star', value: '9/10', label: 'Calificación' }
      ],
      sectionTags: { destacados: 'Lo Más Buscado', beneficios: '¿Por Qué Elegirnos?', testimonios: 'Testimonios' },
      sectionTitles: {
        destacados: 'Productos Destacados',
        pageProducts: 'Encuentra lo que necesitas',
        pageContact: 'Estamos para servirte',
        pageAbout: 'Sobre Nosotros',
        pageGallery: 'Nuestra tienda en imágenes'
      },
      sectionSubtitles: {
        destacados: 'Los electrodomésticos preferidos por nuestros clientes',
        beneficios: 'Trabajamos para ofrecerte la mejor experiencia de compra',
        testimonios: 'La opinión de quienes ya confiaron en nosotros',
        pageProducts: 'Equipa tu hogar con los mejores electrodomésticos',
        pageContact: 'Visítanos, llámanos o escríbenos. Siempre serás bienvenido',
        pageGallery: 'Así es ElectroHogar: calidad, variedad y atención profesional'
      }
    },
    trash: []
  };

  let nextId = 100;

  function genId() {
    return Date.now() + Math.floor(Math.random() * 1000);
  }

  // ── Use Supabase if available, fallback to localStorage ──
  function useSupabase() {
    return true; // Usar Supabase para persistencia remota
  }

  // ── Categories ──

  async function getCategories() {
    if (useSupabase()) {
      try {
        const data = await EH.list('categories');
        if (data && data.length > 0) {
          showDbLog('getCategories: leído desde Supabase (' + data.length + ' categorías)', 'info');
          return data.map(c => c.name);
        }
        showDbLog('getCategories: Supabase vacío, usando localStorage', 'warn');
      } catch (e) {
        showDbLog('getCategories: error en Supabase → ' + e.message + ', usando localStorage', 'error');
      }
    }
    let cats = lsGet('categories');
    if (!cats || cats.length === 0) {
      cats = [...DEFAULTS.categories];
      lsSet('categories', cats);
      showDbLog('getCategories: inicializado con datos por defecto', 'info');
    }
    showDbLog('getCategories: usando localStorage (' + cats.length + ' categorías)', 'success');
    return cats;
  }

  async function getCategoriesFull() {
    if (useSupabase()) {
      try {
        const data = await EH.list('categories');
        if (data && data.length > 0) {
          showDbLog('getCategoriesFull: leído desde Supabase (' + data.length + ' categorías)', 'info');
          return data;
        }
        showDbLog('getCategoriesFull: Supabase vacío, cayendo a localStorage', 'warn');
      } catch (e) {
        showDbLog('getCategoriesFull: error en Supabase → ' + e.message, 'error');
      }
    }
    const names = await getCategories();
    showDbLog('getCategoriesFull: usando localStorage (' + names.length + ' categorías)', 'success');
    return names.map((n, i) => ({ id: i + 1, name: n, is_active: true, deleted_at: null }));
  }

  async function saveCategories(cats) {
    lsSet('categories', cats);
    showDbLog('saveCategories: guardado en localStorage', 'success');
  }

  async function addCategory(name) {
    const cats = await getCategories();
    if (cats.includes(name)) return false;
    cats.push(name);
    await saveCategories(cats);
    return true;
  }

  async function editCategory(oldName, newName) {
    const cats = await getCategories();
    const idx = cats.indexOf(oldName);
    if (idx === -1) return false;
    const products = await getProducts();
    products.forEach(p => { if (p.category === oldName) p.category = newName; });
    await saveProducts(products);
    cats[idx] = newName;
    await saveCategories(cats);
    return true;
  }

  async function deleteCategory(name) {
    const cats = await getCategories();
    const products = await getProducts();
    products.forEach(p => { if (p.category === name) p.category = ''; });
    await saveProducts(products);
    const filtered = cats.filter(c => c !== name);
    await saveCategories(filtered);
    return true;
  }

  // ── Products ──

  async function getProducts() {
    if (useSupabase()) {
      try {
        const data = await EH.list('products');
        if (data && data.length > 0) {
          showDbLog('getProducts: leído desde Supabase (' + data.length + ' productos)', 'info');
          return data.map(p => ({
            id: p.id,
            name: p.name,
            category: p.category,
            image: p.image_url || '',
            is_active: p.is_active,
            deleted_at: p.deleted_at
          }));
        }
        showDbLog('getProducts: Supabase vacío, usando localStorage', 'warn');
      } catch (e) {
        showDbLog('getProducts: error en Supabase → ' + e.message + ', usando localStorage', 'error');
      }
    }
    let p = lsGet('products');
    // SOLO inicializar con defaults si localStorage está completamente vacío
    if (p === null || p === undefined || p.length === 0) {
      p = JSON.parse(JSON.stringify(DEFAULTS.products));
      lsSet('products', p);
      showDbLog('getProducts: inicializado con datos por defecto', 'info');
    }
    showDbLog('getProducts: usando localStorage (' + p.filter(x => !x.deleted_at).length + ' productos activos)', 'success');
    return p.filter(x => !x.deleted_at);
  }

  async function getProductsAll() {
    if (useSupabase()) {
      try {
        const data = await EH.listAll('products');
        if (data && data.length > 0) {
          showDbLog('getProductsAll: leído desde Supabase (' + data.length + ' productos)', 'info');
          return data.map(p => ({
            id: p.id,
            name: p.name,
            category: p.category,
            image: p.image_url || '',
            is_active: p.is_active,
            deleted_at: p.deleted_at
          }));
        }
        showDbLog('getProductsAll: Supabase vacío, cayendo a localStorage', 'warn');
      } catch (e) {
        showDbLog('getProductsAll: error en Supabase → ' + e.message, 'error');
      }
    }
    const local = lsGet('products') || [];
    showDbLog('getProductsAll: usando localStorage (' + local.length + ' productos)', 'success');
    return local;
  }

  async function saveProducts(products) {
    if (useSupabase()) {
      try {
        for (const p of products) {
          const record = {
            name: p.name,
            category: p.category,
            image_url: p.image || '',
            is_active: p.is_active !== undefined ? p.is_active : true,
            deleted_at: p.deleted_at || null
          };
          if (p.id && typeof p.id === 'string' && p.id.includes('-')) {
            await EH.update('products', p.id, record);
          } else if (p.id && !p._new) {
            const existing = lsGet('products') || [];
            const found = existing.find(x => x.id === p.id);
            if (found) {
              record.id = p.id;
              lsSet('products', products);
              return;
            }
          }
        }
      } catch (e) { console.error('[storage]', e); }
    }
    lsSet('products', products);
  }

  async function addProduct(product) {
    const list = await getProductsAll();
    const newId = genId();
    const entry = {
      id: newId,
      name: product.name,
      category: product.category,
      image: product.image || '',
      is_active: true,
      deleted_at: null,
      _new: true
    };
    // Guardar directamente en localStorage
    list.push(entry);
    lsSet('products', list);
    showDbLog('addProduct: guardado en localStorage (id: ' + entry.id + ')', 'success');
    return entry;
  }

  async function updateProduct(id, updates) {
    const list = await getProductsAll();
    const idx = list.findIndex(p => String(p.id) === String(id));
    if (idx !== -1) {
      Object.assign(list[idx], updates);
      lsSet('products', list);
      console.log('[updateProduct] Producto actualizado:', list[idx].name);
      showDbLog('updateProduct: guardado en localStorage (id: ' + id + ')', 'success');
    } else {
      console.error('[updateProduct] Producto no encontrado con ID:', id, 'en lista de', list.length, 'productos');
    }
  }

  async function deleteProduct(id) {
    const list = await getProductsAll();
    const idx = list.findIndex(p => String(p.id) === String(id));
    if (idx !== -1) {
      const item = list[idx];
      item.deleted_at = new Date().toISOString();
      item.is_active = false;

      // Guardar productos actualizados
      lsSet('products', list);

      // Obtener y actualizar papelera directamente
      let trashList = lsGet('trash') || [];
      trashList.push({
        id: genId(),
        original_table: 'products',
        original_id: item.id,
        data: JSON.parse(JSON.stringify(item)),
        deleted_at: new Date().toISOString()
      });
      lsSet('trash', trashList);

      console.log('[deleteProduct] Producto eliminado, papelera ahora tiene:', trashList.length);
      showDbLog('deleteProduct: movido a papelera en localStorage (id: ' + id + ')', 'success');
    } else {
      console.error('[deleteProduct] Producto no encontrado con ID:', id);
    }
  }

  // ── Trash ──

  async function getTrash() {
    if (useSupabase()) {
      try {
        const data = await EH.listAll('trash');
        if (data && data.length > 0) {
          showDbLog('getTrash: leído desde Supabase (' + data.length + ' elementos)', 'info');
          return data.map(t => ({
            id: t.id,
            original_table: t.original_table,
            original_id: t.original_id,
            data: t.data,
            deleted_at: t.deleted_at
          }));
        }
        showDbLog('getTrash: Supabase vacío, cayendo a localStorage', 'warn');
      } catch (e) {
        showDbLog('getTrash: error en Supabase → ' + e.message, 'error');
      }
    }
    const local = lsGet('trash') || [];
    showDbLog('getTrash: usando localStorage (' + local.length + ' elementos)', 'success');
    return local;
  }

  async function restoreFromTrash(trashId) {
    let trashList = lsGet('trash') || [];
    const entry = trashList.find(t => String(t.id) === String(trashId));
    if (!entry) {
      console.error('[restoreFromTrash] Entrada no encontrada con ID:', trashId);
      return false;
    }
    const table = entry.original_table;
    if (table === 'products') {
      let list = await getProductsAll();
      const item = list.find(p => String(p.id) === String(entry.original_id));
      if (item) {
        item.deleted_at = null;
        item.is_active = true;
        lsSet('products', list);
        console.log('[restoreFromTrash] Producto restaurado:', item.name);
      } else {
        console.error('[restoreFromTrash] Producto no encontrado en lista con ID:', entry.original_id);
      }
    }
    trashList = trashList.filter(t => String(t.id) !== String(trashId));
    lsSet('trash', trashList);
    showDbLog('restoreFromTrash: restaurado desde papelera', 'success');
    return true;
  }

  async function permanentDeleteTrash(trashId) {
    let trashList = lsGet('trash') || [];
    const entry = trashList.find(t => String(t.id) === String(trashId));
    if (!entry) {
      console.error('[permanentDeleteTrash] Entrada no encontrada con ID:', trashId);
      return false;
    }
    const table = entry.original_table;
    if (table === 'products') {
      let list = await getProductsAll();
      list = list.filter(p => String(p.id) !== String(entry.original_id));
      lsSet('products', list);
      console.log('[permanentDeleteTrash] Producto eliminado permanentemente con ID:', entry.original_id);
    }
    trashList = trashList.filter(t => String(t.id) !== String(trashId));
    lsSet('trash', trashList);
    showDbLog('permanentDeleteTrash: eliminado permanentemente', 'success');
    return true;
  }

  // ── Config ──

  async function getConfig() {
    if (useSupabase()) {
      try {
        const data = await EH.getConfig();
        if (data) {
          showDbLog('getConfig: leído desde Supabase', 'info');
          return mapConfigFromDB(data);
        }
        showDbLog('getConfig: Supabase sin datos, usando localStorage', 'warn');
      } catch (e) {
        showDbLog('getConfig: error en Supabase → ' + e.message + ', usando localStorage', 'error');
      }
    }
    let c = lsGet('config');
    if (!c) {
      c = JSON.parse(JSON.stringify(DEFAULTS.config));
      lsSet('config', c);
      showDbLog('getConfig: inicializado con valores por defecto', 'info');
    } else {
      let merged = false;
      Object.keys(DEFAULTS.config).forEach(key => {
        if (!(key in c)) {
          c[key] = JSON.parse(JSON.stringify(DEFAULTS.config[key]));
          merged = true;
        }
      });
      if (merged) lsSet('config', c);
      showDbLog('getConfig: usando localStorage', 'success');
    }
    return c;
  }

  function mapConfigFromDB(data) {
    return {
      businessName: data.business_name || 'ElectroHogar',
      slogan: data.slogan || '',
      logo: data.logo_url || '',
      heroTag: data.hero_tag || 'ElectroHogar',
      heroTitle: data.hero_title || 'Calidad y <span class="highlight">tecnología</span> para tu hogar',
      heroSubtitle: data.hero_subtitle || '',
      banners: data.banners || DEFAULTS.config.banners,
      address: data.address || '',
      whatsapp: data.whatsapp || '50575381352',
      phone: data.phone || '',
      email: data.email || '',
      social: data.social || { facebook: '#', instagram: '#', twitter: '#' },
      hours: data.hours || '',
      aboutText: data.about_text || '',
      footerDescription: data.footer_description || '',
      footerCredits: data.footer_credits || '',
      footerPolicy: data.footer_policy || '',
      metaDescription: data.meta_description || '',
      metaKeywords: data.meta_keywords || '',
      ctaTitle: data.cta_title || '',
      ctaText: data.cta_text || '',
      whatsappMessage: data.whatsapp_message || 'Hola, me interesa este producto: {NOMBRE_PRODUCTO}. ¿Me podrían indicar el precio y disponibilidad?',
      benefits: data.benefits || DEFAULTS.config.benefits,
      testimonials: data.testimonials || DEFAULTS.config.testimonials,
      stats: data.stats || DEFAULTS.config.stats,
      sectionTags: data.section_tags || DEFAULTS.config.sectionTags,
      sectionTitles: data.section_titles || DEFAULTS.config.sectionTitles,
      sectionSubtitles: data.section_subtitles || DEFAULTS.config.sectionSubtitles
    };
  }

  function mapConfigToDB(c) {
    return {
      business_name: c.businessName,
      slogan: c.slogan,
      logo_url: c.logo,
      hero_tag: c.heroTag,
      hero_title: c.heroTitle,
      hero_subtitle: c.heroSubtitle,
      banners: c.banners,
      address: c.address,
      whatsapp: c.whatsapp,
      phone: c.phone,
      email: c.email,
      social: c.social,
      hours: c.hours,
      about_text: c.aboutText,
      footer_description: c.footerDescription,
      footer_credits: c.footerCredits,
      footer_policy: c.footerPolicy,
      meta_description: c.metaDescription,
      meta_keywords: c.metaKeywords,
      cta_title: c.ctaTitle,
      cta_text: c.ctaText,
      whatsapp_message: c.whatsappMessage,
      benefits: c.benefits,
      testimonials: c.testimonials,
      stats: c.stats,
      section_tags: c.sectionTags,
      section_titles: c.sectionTitles,
      section_subtitles: c.sectionSubtitles
    };
  }

  async function saveConfig(cfg) {
    lsSet('config', cfg);
    showDbLog('saveConfig: guardado en localStorage', 'success');
  }

  // ── Gallery ──

  async function getGallery() {
    if (useSupabase()) {
      try {
        const data = await EH.list('gallery');
        if (data && data.length > 0) {
          showDbLog('getGallery: leído desde Supabase (' + data.length + ' imágenes)', 'info');
          return data.map(g => ({ id: g.id, url: g.image_url, alt: g.alt }));
        }
        showDbLog('getGallery: Supabase vacío, cayendo a localStorage', 'warn');
      } catch (e) {
        showDbLog('getGallery: error en Supabase → ' + e.message, 'error');
      }
    }
    const local = lsGet('gallery') || [];
    showDbLog('getGallery: usando localStorage (' + local.length + ' imágenes)', 'success');
    return local;
  }

  async function saveGallery(gallery) {
    lsSet('gallery', gallery);
    showDbLog('saveGallery: guardado en localStorage (' + gallery.length + ' imágenes)', 'success');
  }

  // ── Session (local only, Supabase handles auth separately) ──

  function getSession() {
    return lsGet('session') === true;
  }

  function setSession(val) {
    lsSet('session', val);
  }

  function getStoredPassword() {
    return localStorage.getItem(PREFIX + 'admin_password') || 'admin20$';
  }

  function setStoredPassword(newPw) {
    localStorage.setItem(PREFIX + 'admin_password', newPw);
  }

  function login(password) {
    if (password === getStoredPassword()) {
      setSession(true);
      return true;
    }
    return false;
  }

  function logout() {
    setSession(false);
    if (useSupabase()) {
      EH.signOut().catch(() => {});
    }
  }

  return {
    getCategories,
    getCategoriesFull,
    saveCategories,
    addCategory,
    editCategory,
    deleteCategory,
    getProducts,
    getProductsAll,
    saveProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    getTrash,
    restoreFromTrash,
    permanentDeleteTrash,
    getConfig,
    saveConfig,
    getGallery,
    saveGallery,
    getSession,
    setSession,
    login,
    logout,
    getStoredPassword,
    setStoredPassword,
    genId,
    showDbLog
  };
})();
