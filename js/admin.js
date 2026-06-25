(function () {
  'use strict';

  if (!EH_DATA.getSession()) {
    window.location.href = 'login.html';
    return;
  }

  window.addEventListener('error', (e) => {
    showToast('Error: ' + (e.error?.message || e.message || 'Error desconocido'), 'error');
  });
  window.addEventListener('unhandledrejection', (e) => {
    showToast('Error inesperado: ' + (e.reason?.message || 'Promesa rechazada'), 'error');
  });

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
    addLog(msg, type);
    console.log(`[admin] ${type}: ${msg}`);
    toast.textContent = msg;
    toast.className = `toast ${type}`;
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => toast.classList.remove('show'), 4000);
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
    const confirmBtn = document.getElementById('modalConfirm');
    const handleCancel = () => { overlay.classList.remove('open'); form.onsubmit = null; };
    const handleSubmit = async (e) => {
      e.preventDefault();
      const origText = confirmBtn.textContent;
      confirmBtn.disabled = true;
      confirmBtn.textContent = 'Guardando...';
      try {
        await onSubmit(e);
      } catch (err) {
        console.error('[admin] Error en modal:', err);
        showToast('Error: ' + (err?.message || 'Ocurrió un error inesperado'), 'error');
      } finally {
        overlay.classList.remove('open');
        form.onsubmit = null;
        confirmBtn.disabled = false;
        confirmBtn.textContent = origText;
      }
    };
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
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error('Error al leer el archivo'));
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
    gallery: document.getElementById('panel-gallery'),
    config: document.getElementById('panel-config'),
    trash: document.getElementById('panel-trash')
  };
  const pageTitle = document.getElementById('pageTitle');
  const tabNames = {
    dashboard: 'Dashboard',
    products: 'Productos',
    categories: 'Categorias',
    banners: 'Banners',
    gallery: 'Galeria',
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
      case 'gallery': loadGallery(); break;
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
    if (!p) { showToast('Producto no encontrado.', 'error'); return; }
    const cats = await EH_DATA.getCategories();
    showModal('Editar Producto', `
      <div class="form-group"><label>Nombre *</label><input type="text" class="form-control" id="prodName" value="${(p.name || '').replace(/"/g, '&quot;')}" required></div>
      <div class="form-group"><label>Categoria *</label><select class="form-control" id="prodCategory" required>${cats.map(c => `<option value="${c}" ${c === p.category ? 'selected' : ''}>${c}</option>`).join('')}</select></div>
      <div class="form-group">
        <label>Imagen del Producto</label>
        <input type="file" id="prodFile" accept="image/*" style="margin-bottom:8px">
        <div id="prodPreview" style="margin-top:8px;display:${p.image ? 'block' : 'none'}">
          <img src="${p.image || ''}" style="max-width:100%;max-height:200px;border-radius:8px">
        </div>
      </div>
      <div class="form-group"><label>Estado</label><select class="form-control" id="prodActive"><option value="1" ${p.is_active ? 'selected' : ''}>Activo</option><option value="0" ${!p.is_active ? 'selected' : ''}>Inactivo</option></select></div>
    `, async () => {
      const name = document.getElementById('prodName').value.trim();
      const category = document.getElementById('prodCategory').value;
      const fileInput = document.getElementById('prodFile');
      let image = p.image || '';
      if (fileInput.files && fileInput.files[0]) {
        image = await readFileAsDataURL(fileInput.files[0]);
      }
      const is_active = document.getElementById('prodActive').value === '1';
      if (!name) { showToast('El nombre es obligatorio.', 'error'); closeModal(); return; }
      addLog(`Editando producto: "${name}"`, 'info');
      await EH_DATA.updateProduct(id, { name, category, image, is_active });
      showToast('Producto actualizado.');
      loadProducts();
    });
    const prodFile = document.getElementById('prodFile');
    const prodPreview = document.getElementById('prodPreview');
    if (prodFile && prodPreview) {
      prodFile.addEventListener('change', () => {
        if (prodFile.files && prodFile.files[0]) {
          const reader = new FileReader();
          reader.onload = (e) => {
            prodPreview.querySelector('img').src = e.target.result;
            prodPreview.style.display = 'block';
          };
          reader.readAsDataURL(prodFile.files[0]);
        }
      });
    }
  }

  async function toggleProduct(id) {
    const products = await EH_DATA.getProductsAll();
    const p = products.find(x => String(x.id) === String(id));
    if (!p) { showToast('Producto no encontrado.', 'error'); return; }
    addLog(`Cambiando estado producto "${p.name}": ${p.is_active ? 'desactivar' : 'activar'}`, 'info');
    await EH_DATA.updateProduct(id, { is_active: !p.is_active });
    showToast(p.is_active ? 'Producto desactivado.' : 'Producto activado.');
    loadProducts();
  }

  async function deleteProduct(id) {
    if (!confirm('¿Enviar este producto a la papelera?')) return;
    addLog(`Eliminando producto ID: ${id}`, 'info');
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
      <div class="form-group">
        <label>Imagen del Producto</label>
        <input type="file" id="prodFile" accept="image/*">
        <div id="prodPreview" style="margin-top:8px;display:none">
          <img style="max-width:100%;max-height:200px;border-radius:8px">
        </div>
      </div>
    `, async () => {
      const name = document.getElementById('prodName').value.trim();
      const category = document.getElementById('prodCategory').value;
      const fileInput = document.getElementById('prodFile');
      let image = '';
      if (fileInput.files && fileInput.files[0]) {
        image = await readFileAsDataURL(fileInput.files[0]);
      }
      if (!name) { showToast('El nombre es obligatorio.', 'error'); closeModal(); return; }
      addLog(`Creando producto: "${name}" (${category})...`, 'info');
      await EH_DATA.addProduct({ name, category, image });
      showToast('Producto creado.');
      loadProducts();
    });
    const prodFile = document.getElementById('prodFile');
    const prodPreview = document.getElementById('prodPreview');
    if (prodFile && prodPreview) {
      prodFile.addEventListener('change', () => {
        if (prodFile.files && prodFile.files[0]) {
          const reader = new FileReader();
          reader.onload = (e) => {
            prodPreview.querySelector('img').src = e.target.result;
            prodPreview.style.display = 'block';
          };
          reader.readAsDataURL(prodFile.files[0]);
        }
      });
    }
  }

  // ── Image selector from gallery ──
  function setupImageSelector(selectBtnId, removeBtnId, inputId, previewId) {
    const selectBtn = document.getElementById(selectBtnId);
    const removeBtn = document.getElementById(removeBtnId);
    const input = document.getElementById(inputId);
    const preview = document.getElementById(previewId);

    if (selectBtn) {
      selectBtn.addEventListener('click', async () => {
        await showImageGalleryModal(inputId, previewId);
      });
    }

    if (removeBtn) {
      removeBtn.addEventListener('click', () => {
        input.value = '';
        preview.style.display = 'none';
        preview.querySelector('img').src = '';
      });
    }
  }

  async function showImageGalleryModal(inputId, previewId) {
    const galleryImages = await EH_DATA.getGallery();
    const modalContent = document.createElement('div');
    modalContent.className = 'gallery-modal-content';

    if (galleryImages.length === 0) {
      modalContent.innerHTML = `
        <p style="text-align:center;padding:20px;color:var(--text-muted)">
          No hay imágenes en la galería. Ve a la pestaña "Galería" para agregar imágenes primero.
        </p>
      `;
    } else {
      modalContent.innerHTML = `
        <div class="gallery-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(100px,1fr));gap:10px;max-height:400px;overflow-y:auto;padding:10px">
          ${galleryImages.map(img => `
            <div class="gallery-item" data-url="${img.url}" style="cursor:pointer;border:2px solid transparent;border-radius:8px;overflow:hidden">
              <img src="${img.url}" alt="${img.alt || ''}" style="width:100%;height:100px;object-fit:cover">
            </div>
          `).join('')}
        </div>
      `;

      modalContent.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', () => {
          const url = item.dataset.url;
          document.getElementById(inputId).value = url;
          const preview = document.getElementById(previewId);
          preview.style.display = 'flex';
          preview.querySelector('img').src = url;
          closeModal();
        });
        item.addEventListener('mouseenter', () => {
          item.style.borderColor = 'var(--accent)';
        });
        item.addEventListener('mouseleave', () => {
          item.style.borderColor = 'transparent';
        });
      });
    }

    showModal('Seleccionar Imagen de Galería', modalContent.outerHTML, () => {}, false);
  }

  // ── File upload helper (mantenido para compatibilidad) ──
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
      addLog(`Editando categoria: "${name}" -> "${newName}"`, 'info');
      await EH_DATA.editCategory(name, newName);
      showToast('Categoria actualizada.');
      loadCategories();
    });
  }

  async function deleteCategoryPrompt(name) {
    if (!confirm(`¿Eliminar la categoria "${name}"?`)) return;
    addLog(`Eliminando categoria: "${name}"`, 'info');
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
      addLog(`Creando categoria: "${name}"`, 'info');
      const ok = await EH_DATA.addCategory(name);
      if (!ok) { showToast('Ya existe una categoria con ese nombre.', 'error'); closeModal(); return; }
      showToast('Categoria creada.');
      loadCategories();
    });
  });

  // ── Banners ──
  const UBICACIONES = [
    { value: 'hero', label: 'Hero Principal' },
    { value: 'secundario1', label: 'Banner Secundario 1' },
    { value: 'secundario2', label: 'Banner Secundario 2' },
    { value: 'secundario3', label: 'Banner Secundario 3' }
  ];

  function getUbicacionLabel(value) {
    const ub = UBICACIONES.find(u => u.value === value);
    return ub ? ub.label : value || 'Sin ubicación';
  }

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
        <div class="bc-label">${getUbicacionLabel(b.ubicacion)}</div>
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
    const current = banners[idx] || { url: '', alt: '', ubicacion: 'secundario1' };
    showModal(`Editar Banner`, `
      <div class="form-group">
        <label>Ubicación *</label>
        <select class="form-control" id="banUbicacion" required>
          ${UBICACIONES.map(u => `<option value="${u.value}" ${u.value === current.ubicacion ? 'selected' : ''}>${u.label}</option>`).join('')}
        </select>
      </div>
      <div class="form-group">
        <label>Imagen del Banner</label>
        <input type="file" id="banFile" accept="image/*" style="margin-bottom:8px">
        <div id="banPreview" style="margin-top:8px;display:${current.url ? 'block' : 'none'}">
          <img src="${current.url}" style="max-width:100%;max-height:200px;border-radius:8px">
        </div>
      </div>
      <div class="form-group"><label>Texto alternativo</label><input type="text" class="form-control" id="banAlt" value="${(current.alt || '').replace(/"/g, '&quot;')}"></div>
    `, async () => {
      const fileInput = document.getElementById('banFile');
      let url = current.url || '';
      if (fileInput.files && fileInput.files[0]) {
        url = await readFileAsDataURL(fileInput.files[0]);
      }
      const alt = document.getElementById('banAlt').value.trim();
      const ubicacion = document.getElementById('banUbicacion').value;
      if (!cfg.banners) cfg.banners = [];
      cfg.banners[idx] = { ...(cfg.banners[idx] || { id: idx + 1 }), url, alt, ubicacion };
      addLog('Guardando banner...', 'info');
      await EH_DATA.saveConfig(cfg);
      showToast('Banner actualizado.');
      loadBanners();
    });
    const banFile = document.getElementById('banFile');
    const banPreview = document.getElementById('banPreview');
    if (banFile && banPreview) {
      banFile.addEventListener('change', () => {
        if (banFile.files && banFile.files[0]) {
          const reader = new FileReader();
          reader.onload = (e) => {
            banPreview.querySelector('img').src = e.target.result;
            banPreview.style.display = 'block';
          };
          reader.readAsDataURL(banFile.files[0]);
        }
      });
    }
  }

  async function deleteBanner(idx) {
    if (!confirm('¿Eliminar este banner?')) return;
    cfg = await EH_DATA.getConfig();
    if (cfg.banners && cfg.banners[idx]) {
      cfg.banners[idx].url = '';
      cfg.banners[idx].alt = '';
    }
    addLog('Eliminando banner...', 'info');
    await EH_DATA.saveConfig(cfg);
    showToast('Banner eliminado.');
    loadBanners();
  }

  document.getElementById('addBannerBtn').addEventListener('click', async () => {
    cfg = await EH_DATA.getConfig();
    const banners = cfg.banners || [];
    const ubicacionesOcupadas = banners.filter(b => b.url).map(b => b.ubicacion);
    const ubicacionesDisponibles = UBICACIONES.filter(u => !ubicacionesOcupadas.includes(u.value));

    showModal('Nuevo Banner', `
      <div class="form-group">
        <label>Ubicación *</label>
        <select class="form-control" id="banUbicacion" required>
          ${ubicacionesDisponibles.length > 0
            ? ubicacionesDisponibles.map(u => `<option value="${u.value}">${u.label}</option>`).join('')
            : UBICACIONES.map(u => `<option value="${u.value}">${u.label}</option>`).join('')}
        </select>
        ${ubicacionesDisponibles.length === 0 ? '<small style="color:var(--text-muted)">Todas las ubicaciones están ocupadas. Se reemplazará el banner existente.</small>' : ''}
      </div>
      <div class="form-group">
        <label>Imagen del Banner</label>
        <input type="file" id="banFile" accept="image/*">
        <div id="banPreview" style="margin-top:8px;display:none">
          <img style="max-width:100%;max-height:200px;border-radius:8px">
        </div>
      </div>
      <div class="form-group"><label>Texto alternativo</label><input type="text" class="form-control" id="banAlt" placeholder="Oferta especial"></div>
    `, async () => {
      const fileInput = document.getElementById('banFile');
      let url = '';
      if (fileInput.files && fileInput.files[0]) {
        url = await readFileAsDataURL(fileInput.files[0]);
      }
      const alt = document.getElementById('banAlt').value.trim();
      const ubicacion = document.getElementById('banUbicacion').value;
      if (!cfg.banners) cfg.banners = [];

      const existenteIdx = cfg.banners.findIndex(b => b.ubicacion === ubicacion);
      if (existenteIdx !== -1 && cfg.banners[existenteIdx].url) {
        if (!confirm(`Ya existe un banner en "${getUbicacionLabel(ubicacion)}". ¿Deseas reemplazarlo?`)) {
          return;
        }
        cfg.banners[existenteIdx] = { ...cfg.banners[existenteIdx], url, alt };
      } else {
        if (existenteIdx !== -1) {
          cfg.banners[existenteIdx] = { ...cfg.banners[existenteIdx], url, alt };
        } else {
          cfg.banners.push({ id: cfg.banners.length + 1, url, alt, ubicacion });
        }
      }

      addLog('Creando nuevo banner...', 'info');
      await EH_DATA.saveConfig(cfg);
      showToast('Banner creado.');
      loadBanners();
    });
    const banFile = document.getElementById('banFile');
    const banPreview = document.getElementById('banPreview');
    if (banFile && banPreview) {
      banFile.addEventListener('change', () => {
        if (banFile.files && banFile.files[0]) {
          const reader = new FileReader();
          reader.onload = (e) => {
            banPreview.querySelector('img').src = e.target.result;
            banPreview.style.display = 'block';
          };
          reader.readAsDataURL(banFile.files[0]);
        }
      });
    }
  });

  // ── Gallery (imágenes de galería) ──
  async function loadGallery() {
    const images = await EH_DATA.getGallery();
    const grid = document.getElementById('galleryGrid');
    const empty = document.getElementById('emptyGallery');

    if (images.length === 0) {
      grid.innerHTML = '';
      empty.style.display = 'block';
      initLucide();
      return;
    }
    empty.style.display = 'none';
    grid.innerHTML = images.map((img, i) => `
      <div class="admin-product-card">
        <div class="apc-image">
          ${img.url
            ? `<img src="${img.url}" alt="${img.alt || ''}" loading="lazy">`
            : `<div class="no-img"><i data-lucide="image" style="width:28px;height:28px;color:var(--text-muted)"></i></div>`}
        </div>
        <div class="apc-body">
          <div class="apc-name">${img.alt || 'Sin descripción'}</div>
          <div class="apc-actions">
            <button class="btn-delete-gallery" data-idx="${i}" style="background:rgba(214,40,40,0.15);color:var(--red)">
              <i data-lucide="trash-2" style="width:12px;height:12px"></i> Eliminar
            </button>
          </div>
        </div>
      </div>
    `).join('');
    initLucide();
    grid.querySelectorAll('.btn-delete-gallery').forEach(btn => {
      btn.addEventListener('click', () => deleteGalleryItem(parseInt(btn.dataset.idx)));
    });
  }

  async function deleteGalleryItem(idx) {
    if (!confirm('¿Eliminar esta imagen de la galeria?')) return;
    addLog('Eliminando imagen de galeria...', 'info');
    const images = await EH_DATA.getGallery();
    images.splice(idx, 1);
    await EH_DATA.saveGallery(images);
    showToast('Imagen eliminada.');
    loadGallery();
  }

  document.getElementById('addGalleryBtn').addEventListener('click', async () => {
    showModal('Nueva Imagen', `
      <div class="form-group"><label>URL de imagen</label><div class="file-input-wrapper"><input type="url" class="form-control" id="galleryUrl" placeholder="https://..."><button type="button" class="btn btn-secondary btn-sm" id="galleryUploadBtn">Subir</button><input type="file" id="galleryFile" accept="image/*"></div><img class="img-preview" id="galleryPreview"></div>
      <div class="form-group"><label>Descripcion</label><input type="text" class="form-control" id="galleryAlt" placeholder="Breve descripcion"></div>
    `, async () => {
      const url = document.getElementById('galleryUrl').value.trim();
      const alt = document.getElementById('galleryAlt').value.trim();
      if (!url) { showToast('La URL es obligatoria.', 'error'); closeModal(); return; }
      addLog('Agregando imagen a galeria...', 'info');
      const images = await EH_DATA.getGallery();
      images.push({ id: Date.now(), url, alt });
      await EH_DATA.saveGallery(images);
      showToast('Imagen agregada.');
      loadGallery();
    });
    setTimeout(() => setupFileUpload('galleryUploadBtn', 'galleryFile', 'galleryUrl', 'galleryPreview'), 50);
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
    addLog('Restaurando elemento de la papelera...', 'info');
    await EH_DATA.restoreFromTrash(id);
    showToast('Elemento restaurado.');
    loadTrash();
    updateTrashNotif();
  }

  async function permDeleteItem(id) {
    if (!confirm('¿Eliminar permanentemente? Esta accion no se puede deshacer.')) return;
    addLog('Eliminando permanentemente de la papelera...', 'info');
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
      cfgAboutText: cfg.aboutText || '',
      cfgBenefits: (cfg.benefits || []).map(b => `${b.icon}|${b.title}|${b.text}`).join('\n'),
      cfgTestimonials: (cfg.testimonials || []).map(t => `${t.name}|${t.role}|${t.text}|${t.initial}`).join('\n'),
      cfgStats: (cfg.stats || []).map(s => `${s.icon}|${s.value}|${s.label}`).join('\n')
    };
    Object.entries(map).forEach(([id, val]) => {
      const el = document.getElementById(id);
      if (el) el.value = val || '';
    });

    // Logo preview
    const logoPreview = document.getElementById('cfgLogoPreview');
    if (logoPreview && cfg.logo) {
      logoPreview.querySelector('img').src = cfg.logo;
      logoPreview.style.display = 'block';
    }
  }

  document.getElementById('saveConfigBtn').addEventListener('click', async () => {
    const btn = document.getElementById('saveConfigBtn');
    const origText = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Guardando...';
    cfg = await EH_DATA.getConfig();

    // Handle logo file upload
    const logoFileInput = document.getElementById('cfgLogoFile');
    let logo = cfg.logo || '';
    if (logoFileInput.files && logoFileInput.files[0]) {
      logo = await readFileAsDataURL(logoFileInput.files[0]);
    }

    const updated = {
      ...cfg,
      businessName: document.getElementById('cfgName').value.trim(),
      slogan: document.getElementById('cfgSlogan').value.trim(),
      logo: logo,
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
      aboutText: document.getElementById('cfgAboutText').value.trim(),
      benefits: document.getElementById('cfgBenefits').value.split('\n').filter(Boolean).map(line => {
        const parts = line.split('|');
        return { icon: parts[0]?.trim() || 'circle', title: parts[1]?.trim() || '', text: parts[2]?.trim() || '' };
      }),
      testimonials: document.getElementById('cfgTestimonials').value.split('\n').filter(Boolean).map(line => {
        const parts = line.split('|');
        return { name: parts[0]?.trim() || '', role: parts[1]?.trim() || '', text: parts[2]?.trim() || '', initial: parts[3]?.trim() || '' };
      }),
      stats: document.getElementById('cfgStats').value.split('\n').filter(Boolean).map(line => {
        const parts = line.split('|');
        return { icon: parts[0]?.trim() || 'circle', value: parts[1]?.trim() || '', label: parts[2]?.trim() || '' };
      })
    };
    addLog('Guardando configuracion general...', 'info');
    await EH_DATA.saveConfig(updated);
    showToast('Configuracion guardada.');
    btn.disabled = false;
    btn.textContent = origText;
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
    document.getElementById('addBannerBtn').click();
  });
  document.getElementById('fabGallery').addEventListener('click', () => {
    document.getElementById('fabMenu').classList.remove('open');
    document.getElementById('addGalleryBtn').click();
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

  // ── Activity Log ──
  function addLog(msg, type = 'info') {
    const entries = document.getElementById('activityLogEntries');
    if (!entries) return;
    const time = new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const entry = document.createElement('div');
    entry.className = 'log-entry' + (type === 'error' ? ' log-error' : type === 'success' ? ' log-success' : '');
    entry.innerHTML = `<span class="log-time">[${time}]</span>${msg}`;
    entries.appendChild(entry);
    entries.scrollTop = entries.scrollHeight;
  }

  const logToggle = document.getElementById('activityLogToggle');
  const logPanel = document.getElementById('activityLog');
  if (logToggle && logPanel) {
    logToggle.addEventListener('click', () => {
      const isVisible = logPanel.style.display !== 'none';
      logPanel.style.display = isVisible ? 'none' : 'flex';
    });
  }

  const logClear = document.getElementById('activityLogClear');
  if (logClear) {
    logClear.addEventListener('click', () => {
      document.getElementById('activityLogEntries').innerHTML = '';
    });
  }

  // ── DB Status Badge ──
  function updateDbStatus() {
    const badge = document.getElementById('dbStatus');
    if (!badge) return;
    if (typeof EH !== 'undefined' && EH.isOnline && EH.isOnline()) {
      badge.textContent = 'Supabase';
      badge.className = 'supabase';
    } else {
      badge.textContent = 'localStorage';
      badge.className = 'local';
    }
  }

  // ── DB Log Console ──
  const dbLogToggleBtn = document.getElementById('dbLogToggleBtn');
  const dbLogConsole = document.getElementById('dbLogConsole');
  const dbLogClear = document.getElementById('dbLogClear');
  const dbLogToggle = document.getElementById('dbLogToggle');

  if (dbLogToggleBtn && dbLogConsole) {
    dbLogToggleBtn.addEventListener('click', () => {
      const isOpen = dbLogConsole.classList.contains('open');
      dbLogConsole.classList.toggle('open');
      dbLogToggleBtn.style.opacity = isOpen ? '1' : '0.6';
    });
  }

  if (dbLogClear) {
    dbLogClear.addEventListener('click', () => {
      const entries = document.getElementById('dbLogEntries');
      if (entries) entries.innerHTML = '';
    });
  }

  if (dbLogToggle) {
    dbLogToggle.addEventListener('click', () => {
      dbLogConsole.classList.remove('open');
      if (dbLogToggleBtn) dbLogToggleBtn.style.opacity = '1';
    });
  }

  // ── Logo file upload preview ──
  const cfgLogoFile = document.getElementById('cfgLogoFile');
  const cfgLogoPreview = document.getElementById('cfgLogoPreview');
  if (cfgLogoFile && cfgLogoPreview) {
    cfgLogoFile.addEventListener('change', () => {
      if (cfgLogoFile.files && cfgLogoFile.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
          cfgLogoPreview.querySelector('img').src = e.target.result;
          cfgLogoPreview.style.display = 'block';
        };
        reader.readAsDataURL(cfgLogoFile.files[0]);
      }
    });
  }

  // ── Logout ──
  document.getElementById('logoutBtn').addEventListener('click', (e) => {
    e.preventDefault();
    EH_DATA.logout();
    window.location.href = 'login.html';
  });

  // ── Init ──
  addLog('Panel iniciado', 'success');
  updateDbStatus();
  EH_DATA.showDbLog('Panel admin iniciado — modo: ' + document.getElementById('dbStatus')?.textContent, 'info');
  loadDashboard();
  loadConfigForm();
  updateTrashNotif();
  initLucide();

})();
