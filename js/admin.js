(function () {
  'use strict';

  if (!EH_DATA.getSession()) {
    window.location.href = 'login.html';
    return;
  }

  let cfg = {};
  let currentTab = 'dashboard';
  let lucideReady = false;

  function initLucide() {
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
      lucide.createIcons();
      lucideReady = true;
    }
  }

  // ── Toast ──
  function showToast(msg, type = 'success') {
    let toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.className = `toast ${type}`;
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => toast.classList.remove('show'), 3500);
  }

  // ── Modal ──
  function showModal(title, bodyHTML, onSubmit) {
    const overlay = document.getElementById('modalOverlay');
    const titleEl = document.getElementById('modalTitle');
    const bodyEl = document.getElementById('modalBody');
    const form = document.getElementById('modalForm');
    titleEl.textContent = title;
    bodyEl.innerHTML = bodyHTML;
    overlay.classList.add('open');
    const cancelBtn = document.getElementById('modalCancel');
    const handleCancel = () => { overlay.classList.remove('open'); form.onsubmit = null; };
    const handleSubmit = (e) => { e.preventDefault(); onSubmit(e); overlay.classList.remove('open'); form.onsubmit = null; };
    cancelBtn.onclick = handleCancel;
    form.onsubmit = handleSubmit;
    overlay.onclick = (e) => { if (e.target === overlay) { overlay.classList.remove('open'); form.onsubmit = null; } };
    setTimeout(() => { const firstInput = bodyEl.querySelector('input,select,textarea'); if (firstInput) firstInput.focus(); }, 100);
    initLucide();
  }

  function closeModal() {
    document.getElementById('modalOverlay').classList.remove('open');
  }

  function readFileAsDataURL(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(file);
    });
  }

  // ── Tab navigation ──
  const navLinks = document.querySelectorAll('.bottom-nav a[data-tab]');
  const panels = {
    dashboard: document.getElementById('panel-dashboard'),
    products: document.getElementById('panel-products'),
    categories: document.getElementById('panel-categories'),
    banners: document.getElementById('panel-banners'),
    config: document.getElementById('panel-config'),
    trash: document.getElementById('panel-trash')
  };
  const pageTitle = document.getElementById('pageTitle');
  const tabNames = {
    dashboard: 'Dashboard',
    products: 'Productos',
    categories: 'Categorias',
    banners: 'Banners',
    config: 'Configuracion',
    trash: 'Papelera'
  };

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = link.dataset.tab;
      if (!target || !panels[target]) return;
      if (target === currentTab) return;
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      Object.values(panels).forEach(p => p.classList.remove('active'));
      panels[target].classList.add('active');
      if (pageTitle) pageTitle.textContent = tabNames[target] || target;
      currentTab = target;
      loadTab(target);
    });
  });

  function loadTab(tab) {
    switch (tab) {
      case 'dashboard': loadDashboard(); break;
      case 'products': loadProducts(); break;
      case 'categories': loadCategories(); break;
      case 'banners': loadBanners(); break;
      case 'trash': loadTrash(); break;
    }
  }

  // ── Date ──
  const dateEl = document.getElementById('currentDate');
  if (dateEl) {
    dateEl.textContent = new Date().toLocaleDateString('es-MX', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
  }

  // ── Dashboard ──
  async function loadDashboard() {
    const products = await EH_DATA.getProductsAll();
    const active = products.filter(p => p.is_active && !p.deleted_at);
    const inactive = products.filter(p => !p.is_active && !p.deleted_at);
    const trashed = products.filter(p => p.deleted_at);
    const trashList = await EH_DATA.getTrash();

    document.getElementById('statProducts').textContent = products.filter(p => !p.deleted_at).length;
    document.getElementById('statActive').textContent = active.length;
    document.getElementById('statInactive').textContent = inactive.length;
    document.getElementById('statTrash').textContent = trashed.length + trashList.length;
    initLucide();
  }

  // ── Products ──
  async function loadProducts() {
    const products = await EH_DATA.getProductsAll();
    const active = products.filter(p => !p.deleted_at);
    const grid = document.getElementById('productGrid');
    const empty = document.getElementById('emptyProducts');
    if (active.length === 0) {
      grid.innerHTML = '';
      empty.style.display = 'block';
      initLucide();
      return;
    }
    empty.style.display = 'none';
    grid.innerHTML = active.map(p => `
      <div class="admin-product-card">
        <div class="apc-image">
          ${p.image
            ? `<img src="${p.image}" alt="${p.name}" loading="lazy">`
            : `<div class="no-img"><i data-lucide="image" style="width:28px;height:28px;color:var(--text-muted)"></i></div>`}
        </div>
        <div class="apc-body">
          <div class="apc-category">${p.category || 'Sin categoria'}</div>
          <div class="apc-name">${p.name}</div>
          <span class="apc-status ${p.is_active ? 'status-active' : 'status-inactive'}">${p.is_active ? 'Activo' : 'Inactivo'}</span>
          <div class="apc-actions">
            <button class="btn-edit" data-id="${p.id}" style="background:rgba(0,102,204,0.15);color:var(--accent)"><i data-lucide="edit-3" style="width:12px;height:12px"></i> Editar</button>
            ${p.is_active
              ? `<button class="btn-toggle" data-id="${p.id}" style="background:rgba(255,255,255,0.06);color:var(--text-secondary)"><i data-lucide="eye-off" style="width:12px;height:12px"></i></button>`
              : `<button class="btn-toggle" data-id="${p.id}" style="background:rgba(45,106,79,0.15);color:var(--green-light)"><i data-lucide="eye" style="width:12px;height:12px"></i></button>`}
            <button class="btn-delete" data-id="${p.id}" style="background:rgba(214,40,40,0.15);color:var(--red)"><i data-lucide="trash-2" style="width:12px;height:12px"></i></button>
          </div>
        </div>
      </div>
    `).join('');
    initLucide();

    grid.querySelectorAll('.btn-edit').forEach(btn => {
      btn.addEventListener('click', () => editProduct(btn.dataset.id));
    });
    grid.querySelectorAll('.btn-toggle').forEach(btn => {
      btn.addEventListener('click', () => toggleProduct(btn.dataset.id));
    });
    grid.querySelectorAll('.btn-delete').forEach(btn => {
      btn.addEventListener('click', () => deleteProduct(btn.dataset.id));
    });
  }

  async function editProduct(id) {
    const products = await EH_DATA.getProductsAll();
    const p = products.find(x => String(x.id) === String(id));
    if (!p) return;
    const cats = await EH_DATA.getCategories();
    showModal('Editar Producto', `
      <div class="form-group"><label>Nombre *</label><input type="text" class="form-control" id="prodName" value="${(p.name || '').replace(/"/g, '&quot;')}" required></div>
      <div class="form-group"><label>Categoria *</label><select class="form-control" id="prodCategory" required>${cats.map(c => `<option value="${c}" ${c === p.category ? 'selected' : ''}>${c}</option>`).join('')}</select></div>
      <div class="form-group"><label>Imagen (URL)</label><div class="file-input-wrapper"><input type="url" class="form-control" id="prodImageUrl" value="${p.image || ''}" placeholder="https://..."><button type="button" class="btn btn-secondary btn-sm" id="prodUploadBtn">Subir</button><input type="file" id="prodFile" accept="image/*"></div>${p.image ? `<img src="${p.image}" class="img-preview show" id="prodPreview">` : `<img class="img-preview" id="prodPreview">`}</div>
      <div class="form-group"><label>Estado</label><select class="form-control" id="prodActive"><option value="1" ${p.is_active ? 'selected' : ''}>Activo</option><option value="0" ${!p.is_active ? 'selected' : ''}>Inactivo</option></select></div>
    `, async () => {
      const name = document.getElementById('prodName').value.trim();
      const category = document.getElementById('prodCategory').value;
      const image = document.getElementById('prodImageUrl').value.trim();
      const is_active = document.getElementById('prodActive').value === '1';
      if (!name) { showToast('El nombre es obligatorio.', 'error'); closeModal(); return; }
      await EH_DATA.updateProduct(id, { name, category, image, is_active });
      showToast('Producto actualizado.');
      loadProducts();
    });
    setTimeout(() => setupFileUpload('prodUploadBtn', 'prodFile', 'prodImageUrl', 'prodPreview'), 50);
  }

  async function toggleProduct(id) {
    const products = await EH_DATA.getProductsAll();
    const p = products.find(x => String(x.id) === String(id));
    if (!p) return;
    await EH_DATA.updateProduct(id, { is_active: !p.is_active });
    showToast(p.is_active ? 'Producto desactivado.' : 'Producto activado.');
    loadProducts();
  }

  async function deleteProduct(id) {
    if (!confirm('¿Enviar este producto a la papelera?')) return;
    await EH_DATA.deleteProduct(id);
    showToast('Producto movido a la papelera.');
    loadProducts();
    updateTrashNotif();
  }

  // ── Add Product ──
  document.getElementById('addProductBtn').addEventListener('click', showAddProduct);
  document.getElementById('fabProduct').addEventListener('click', () => {
    document.getElementById('fabMenu').classList.remove('open');
    showAddProduct();
  });

  async function showAddProduct() {
    const cats = await EH_DATA.getCategories();
    showModal('Nuevo Producto', `
      <div class="form-group"><label>Nombre *</label><input type="text" class="form-control" id="prodName" required></div>
      <div class="form-group"><label>Categoria *</label><select class="form-control" id="prodCategory" required>${cats.map(c => `<option value="${c}">${c}</option>`).join('')}</select></div>
      <div class="form-group"><label>Imagen (URL)</label><div class="file-input-wrapper"><input type="url" class="form-control" id="prodImageUrl" placeholder="https://..."><button type="button" class="btn btn-secondary btn-sm" id="prodUploadBtn">Subir</button><input type="file" id="prodFile" accept="image/*"></div><img class="img-preview" id="prodPreview"></div>
    `, async () => {
      const name = document.getElementById('prodName').value.trim();
      const category = document.getElementById('prodCategory').value;
      const image = document.getElementById('prodImageUrl').value.trim();
      if (!name) { showToast('El nombre es obligatorio.', 'error'); closeModal(); return; }
      await EH_DATA.addProduct({ name, category, image });
      showToast('Producto creado.');
      loadProducts();
    });
    setTimeout(() => setupFileUpload('prodUploadBtn', 'prodFile', 'prodImageUrl', 'prodPreview'), 50);
  }

  // ── File upload helper ──
  function setupFileUpload(btnId, fileId, urlId, previewId) {
    const uploadBtn = document.getElementById(btnId);
    const fileInput = document.getElementById(fileId);
    const urlInput = document.getElementById(urlId);
    const preview = document.getElementById(previewId);
    if (!uploadBtn || !fileInput) return;
    uploadBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', async () => {
      if (fileInput.files[0]) {
        const dataURL = await readFileAsDataURL(fileInput.files[0]);
        urlInput.value = dataURL;
        if (preview) { preview.src = dataURL; preview.classList.add('show'); }
      }
    });
    if (urlInput && preview) {
      urlInput.addEventListener('input', () => {
        if (urlInput.value) { preview.src = urlInput.value; preview.classList.add('show'); }
        else { preview.classList.remove('show'); }
      });
    }
  }

  // ── Categories ──
  async function loadCategories() {
    const cats = await EH_DATA.getCategories();
    const list = document.getElementById('categoriesList');
    const empty = document.getElementById('emptyCategories');
    if (cats.length === 0) {
      list.innerHTML = '';
      empty.style.display = 'block';
      return;
    }
    empty.style.display = 'none';
    list.innerHTML = cats.map(c => `
      <span class="cat-pill">
        <span>${c}</span>
        <button class="cat-edit" data-name="${c.replace(/"/g, '&quot;')}"><i data-lucide="edit-3" style="width:12px;height:12px"></i></button>
        <button class="cat-delete" data-name="${c.replace(/"/g, '&quot;')}"><i data-lucide="x" style="width:12px;height:12px"></i></button>
      </span>
    `).join('');
    initLucide();
    list.querySelectorAll('.cat-edit').forEach(btn => {
      btn.addEventListener('click', () => editCategoryPrompt(btn.dataset.name));
    });
    list.querySelectorAll('.cat-delete').forEach(btn => {
      btn.addEventListener('click', () => deleteCategoryPrompt(btn.dataset.name));
    });
  }

  async function editCategoryPrompt(name) {
    showModal('Editar Categoria', `
      <div class="form-group"><label>Nombre</label><input type="text" class="form-control" id="catName" value="${name.replace(/"/g, '&quot;')}" required></div>
    `, async () => {
      const newName = document.getElementById('catName').value.trim();
      if (!newName) { showToast('El nombre es obligatorio.', 'error'); closeModal(); return; }
      await EH_DATA.editCategory(name, newName);
      showToast('Categoria actualizada.');
      loadCategories();
    });
  }

  async function deleteCategoryPrompt(name) {
    if (!confirm(`¿Eliminar la categoria "${name}"?`)) return;
    await EH_DATA.deleteCategory(name);
    showToast('Categoria eliminada.');
    loadCategories();
  }

  document.getElementById('addCategoryBtn').addEventListener('click', () => {
    showModal('Nueva Categoria', `
      <div class="form-group"><label>Nombre</label><input type="text" class="form-control" id="catName" required></div>
    `, async () => {
      const name = document.getElementById('catName').value.trim();
      if (!name) { showToast('El nombre es obligatorio.', 'error'); closeModal(); return; }
      const ok = await EH_DATA.addCategory(name);
      if (!ok) { showToast('Ya existe una categoria con ese nombre.', 'error'); closeModal(); return; }
      showToast('Categoria creada.');
      loadCategories();
    });
  });

  // ── Banners ──
  async function loadBanners() {
    cfg = await EH_DATA.getConfig();
    const banners = cfg.banners || [];
    const grid = document.getElementById('bannerGrid');
    const empty = document.getElementById('emptyBanners');
    if (banners.length === 0) {
      grid.innerHTML = '';
      empty.style.display = 'block';
      initLucide();
      return;
    }
    empty.style.display = 'none';
    grid.innerHTML = banners.map((b, i) => `
      <div class="banner-control-item">
        <div class="bc-label">Banner ${i + 1}</div>
        <div class="preview-box" id="bannerPreview${i}">
          ${b.url
            ? `<img src="${b.url}" alt="${b.alt || 'Banner'}">`
            : `<i data-lucide="image" style="width:28px;height:28px;color:var(--text-muted)"></i>`}
        </div>
        <div class="bc-actions">
          <button class="btn-edit" data-idx="${i}" style="background:rgba(0,102,204,0.15);color:var(--accent)">Cambiar</button>
          <button class="btn-delete" data-idx="${i}" style="background:rgba(214,40,40,0.15);color:var(--red)">Eliminar</button>
        </div>
      </div>
    `).join('');
    initLucide();
    grid.querySelectorAll('.btn-edit').forEach(btn => {
      btn.addEventListener('click', () => editBanner(parseInt(btn.dataset.idx)));
    });
    grid.querySelectorAll('.btn-delete').forEach(btn => {
      btn.addEventListener('click', () => deleteBanner(parseInt(btn.dataset.idx)));
    });
  }

  async function editBanner(idx) {
    cfg = await EH_DATA.getConfig();
    const banners = cfg.banners || [];
    const current = banners[idx] || { url: '', alt: '' };
    showModal(`Banner ${idx + 1}`, `
      <div class="form-group"><label>URL de imagen</label><input type="url" class="form-control" id="banUrl" value="${current.url}" placeholder="https://..."></div>
      <div class="form-group"><label>Texto alternativo</label><input type="text" class="form-control" id="banAlt" value="${(current.alt || '').replace(/"/g, '&quot;')}"></div>
    `, async () => {
      const url = document.getElementById('banUrl').value.trim();
      const alt = document.getElementById('banAlt').value.trim();
      if (!cfg.banners) cfg.banners = [];
      cfg.banners[idx] = { ...(cfg.banners[idx] || { id: idx + 1 }), url, alt };
      await EH_DATA.saveConfig(cfg);
      showToast('Banner actualizado.');
      loadBanners();
    });
  }

  async function deleteBanner(idx) {
    if (!confirm('¿Eliminar este banner?')) return;
    cfg = await EH_DATA.getConfig();
    if (cfg.banners && cfg.banners[idx]) {
      cfg.banners[idx].url = '';
      cfg.banners[idx].alt = '';
    }
    await EH_DATA.saveConfig(cfg);
    showToast('Banner eliminado.');
    loadBanners();
  }

  document.getElementById('addBannerBtn').addEventListener('click', async () => {
    cfg = await EH_DATA.getConfig();
    showModal('Nuevo Banner', `
      <div class="form-group"><label>URL de imagen</label><input type="url" class="form-control" id="banUrl" placeholder="https://..."></div>
      <div class="form-group"><label>Texto alternativo</label><input type="text" class="form-control" id="banAlt" placeholder="Oferta especial"></div>
    `, async () => {
      const url = document.getElementById('banUrl').value.trim();
      const alt = document.getElementById('banAlt').value.trim();
      if (!cfg.banners) cfg.banners = [];
      cfg.banners.push({ id: cfg.banners.length + 1, url, alt });
      await EH_DATA.saveConfig(cfg);
      showToast('Banner creado.');
      loadBanners();
    });
  });

  // ── Trash ──
  async function loadTrash() {
    const trash = await EH_DATA.getTrash();
    const list = document.getElementById('trashList');
    const empty = document.getElementById('emptyTrash');
    const count = document.getElementById('trashCount');
    if (count) count.textContent = `${trash.length} elemento${trash.length !== 1 ? 's' : ''}`;
    if (trash.length === 0) {
      list.innerHTML = '';
      empty.style.display = 'block';
      return;
    }
    empty.style.display = 'none';
    list.innerHTML = trash.map(t => {
      const name = t.data ? (t.data.name || 'Sin nombre') : 'Sin nombre';
      const tableName = t.original_table || 'desconocido';
      const date = t.deleted_at ? new Date(t.deleted_at).toLocaleDateString('es-MX') : '—';
      return `
        <div class="trash-item">
          <div class="ti-info">
            <div class="ti-name">${name}</div>
            <div class="ti-meta">${tableName} · Eliminado: ${date}</div>
          </div>
          <div class="ti-actions">
            <button class="btn-restore" data-id="${t.id}" style="background:rgba(45,106,79,0.15);color:var(--green-light)"><i data-lucide="rotate-ccw" style="width:12px;height:12px"></i> Restaurar</button>
            <button class="btn-permdelete" data-id="${t.id}" style="background:rgba(214,40,40,0.15);color:var(--red)"><i data-lucide="trash-2" style="width:12px;height:12px"></i> Eliminar</button>
          </div>
        </div>
      `;
    }).join('');
    initLucide();
    list.querySelectorAll('.btn-restore').forEach(btn => {
      btn.addEventListener('click', () => restoreItem(btn.dataset.id));
    });
    list.querySelectorAll('.btn-permdelete').forEach(btn => {
      btn.addEventListener('click', () => permDeleteItem(btn.dataset.id));
    });
  }

  async function restoreItem(id) {
    if (!confirm('¿Restaurar este elemento?')) return;
    await EH_DATA.restoreFromTrash(id);
    showToast('Elemento restaurado.');
    loadTrash();
    updateTrashNotif();
  }

  async function permDeleteItem(id) {
    if (!confirm('¿Eliminar permanentemente? Esta accion no se puede deshacer.')) return;
    await EH_DATA.permanentDeleteTrash(id);
    showToast('Elemento eliminado permanentemente.');
    loadTrash();
    updateTrashNotif();
  }

  async function updateTrashNotif() {
    const trash = await EH_DATA.getTrash();
    const dot = document.getElementById('trashNotif');
    if (dot) {
      dot.classList.toggle('show', trash.length > 0);
    }
  }

  // ── Config ──
  async function loadConfigForm() {
    cfg = await EH_DATA.getConfig();
    const map = {
      cfgName: cfg.businessName,
      cfgSlogan: cfg.slogan,
      cfgLogo: cfg.logo,
      cfgWhatsapp: cfg.whatsapp,
      cfgHeroTag: cfg.heroTag,
      cfgHeroTitle: cfg.heroTitle,
      cfgHeroSubtitle: cfg.heroSubtitle,
      cfgAddress: cfg.address,
      cfgPhone: cfg.phone,
      cfgEmail: cfg.email,
      cfgHours: cfg.hours,
      cfgFacebook: cfg.social?.facebook || '',
      cfgInstagram: cfg.social?.instagram || '',
      cfgTwitter: cfg.social?.twitter || '',
      cfgHeroImage: cfg.heroImage,
      cfgWhatsappMsg: cfg.whatsappMessage || 'Hola, me interesa este producto: {NOMBRE_PRODUCTO}. ¿Me podrían indicar el precio y disponibilidad?',
      cfgSecTagDest: cfg.sectionTags?.destacados || '',
      cfgSecTitleDest: cfg.sectionTitles?.destacados || '',
      cfgSecTagBen: cfg.sectionTags?.beneficios || '',
      cfgSecTitleBen: cfg.sectionTitles?.beneficios || '',
      cfgSecTagTest: cfg.sectionTags?.testimonios || '',
      cfgSecTitleTest: cfg.sectionTitles?.testimonios || '',
      cfgCtaTitle: cfg.ctaTitle || '',
      cfgCtaText: cfg.ctaText || '',
      cfgFooterDesc: cfg.footerDescription || '',
      cfgFooterCredits: cfg.footerCredits || '',
      cfgFooterPolicy: cfg.footerPolicy || '',
      cfgMetaDesc: cfg.metaDescription || '',
      cfgMetaKeywords: cfg.metaKeywords || '',
      cfgAboutText: cfg.aboutText || ''
    };
    Object.entries(map).forEach(([id, val]) => {
      const el = document.getElementById(id);
      if (el) el.value = val || '';
    });
  }

  document.getElementById('saveConfigBtn').addEventListener('click', async () => {
    cfg = await EH_DATA.getConfig();
    const updated = {
      ...cfg,
      businessName: document.getElementById('cfgName').value.trim(),
      slogan: document.getElementById('cfgSlogan').value.trim(),
      logo: document.getElementById('cfgLogo').value.trim(),
      whatsapp: document.getElementById('cfgWhatsapp').value.trim(),
      heroTag: document.getElementById('cfgHeroTag').value.trim(),
      heroTitle: document.getElementById('cfgHeroTitle').value.trim(),
      heroSubtitle: document.getElementById('cfgHeroSubtitle').value.trim(),
      address: document.getElementById('cfgAddress').value.trim(),
      phone: document.getElementById('cfgPhone').value.trim(),
      email: document.getElementById('cfgEmail').value.trim(),
      hours: document.getElementById('cfgHours').value.trim(),
      social: {
        facebook: document.getElementById('cfgFacebook').value.trim(),
        instagram: document.getElementById('cfgInstagram').value.trim(),
        twitter: document.getElementById('cfgTwitter').value.trim()
      },
      heroImage: document.getElementById('cfgHeroImage').value.trim(),
      whatsappMessage: document.getElementById('cfgWhatsappMsg').value.trim(),
      sectionTags: {
        destacados: document.getElementById('cfgSecTagDest').value.trim(),
        beneficios: document.getElementById('cfgSecTagBen').value.trim(),
        testimonios: document.getElementById('cfgSecTagTest').value.trim()
      },
      sectionTitles: {
        destacados: document.getElementById('cfgSecTitleDest').value.trim(),
        beneficios: document.getElementById('cfgSecTitleBen').value.trim(),
        testimonios: document.getElementById('cfgSecTitleTest').value.trim()
      },
      ctaTitle: document.getElementById('cfgCtaTitle').value.trim(),
      ctaText: document.getElementById('cfgCtaText').value.trim(),
      footerDescription: document.getElementById('cfgFooterDesc').value.trim(),
      footerCredits: document.getElementById('cfgFooterCredits').value.trim(),
      footerPolicy: document.getElementById('cfgFooterPolicy').value.trim(),
      metaDescription: document.getElementById('cfgMetaDesc').value.trim(),
      metaKeywords: document.getElementById('cfgMetaKeywords').value.trim(),
      aboutText: document.getElementById('cfgAboutText').value.trim()
    };
    await EH_DATA.saveConfig(updated);
    showToast('Configuracion guardada.');
  });

  // ── FAB ──
  const fabBtn = document.getElementById('fabBtn');
  const fabMenu = document.getElementById('fabMenu');
  if (fabBtn && fabMenu) {
    fabBtn.addEventListener('click', () => {
      fabMenu.classList.toggle('open');
    });
    document.addEventListener('click', (e) => {
      if (!fabBtn.contains(e.target) && !fabMenu.contains(e.target)) {
        fabMenu.classList.remove('open');
      }
    });
  }

  document.getElementById('fabBanner').addEventListener('click', () => {
    document.getElementById('fabMenu').classList.remove('open');
    document.getElementById('fabBanner').click();
  });

  // ── Change Password ──
  document.getElementById('changePwBtn').addEventListener('click', () => {
    showModal('Cambiar Contrasena', `
      <div class="form-group"><label>Contrasena actual</label><input type="password" class="form-control" id="pwCurrent" required></div>
      <div class="form-group"><label>Nueva contrasena</label><input type="password" class="form-control" id="pwNew" required minlength="4"></div>
      <div class="form-group"><label>Confirmar nueva contrasena</label><input type="password" class="form-control" id="pwConfirm" required></div>
      <div style="font-size:0.75rem;color:var(--text-muted);margin-top:8px">La contrasena se almacena en el navegador (localStorage).</div>
    `, () => {
      const current = document.getElementById('pwCurrent').value;
      const newPw = document.getElementById('pwNew').value;
      const confirm = document.getElementById('pwConfirm').value;
      if (current !== EH_DATA.getStoredPassword()) {
        showToast('Contrasena actual incorrecta.', 'error');
        closeModal();
        return;
      }
      if (newPw.length < 4) {
        showToast('La nueva contrasena debe tener al menos 4 caracteres.', 'error');
        closeModal();
        return;
      }
      if (newPw !== confirm) {
        showToast('Las contrasenas no coinciden.', 'error');
        closeModal();
        return;
      }
      EH_DATA.setStoredPassword(newPw);
      showToast('Contrasena cambiada correctamente.');
    });
  });

  // ── Logout ──
  document.getElementById('logoutBtn').addEventListener('click', (e) => {
    e.preventDefault();
    EH_DATA.logout();
    window.location.href = 'login.html';
  });

  // ── Init ──
  loadDashboard();
  loadConfigForm();
  updateTrashNotif();
  initLucide();

})();
