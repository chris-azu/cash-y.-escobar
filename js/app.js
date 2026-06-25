(function () {
  'use strict';

  const isHome = location.pathname.endsWith('index.html') || location.pathname === '/' || location.pathname.endsWith('/tacos%20opencode/');

  // ── Navbar ──
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navbarMenu = document.getElementById('navbarMenu');

  function updateNavbar() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', updateNavbar);
  updateNavbar();

  if (navToggle && navbarMenu) {
    navToggle.addEventListener('click', () => {
      navbarMenu.classList.toggle('open');
    });
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target)) {
        navbarMenu.classList.remove('open');
      }
    });
  }

  const navLinks = document.querySelectorAll('.navbar-menu a');
  const currentPath = location.pathname.split('/').pop() || 'index.html';
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // ── Reveal animations ──
  const revealEls = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  revealEls.forEach(el => observer.observe(el));

  const yearSpan = document.getElementById('footerYear');
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  function initLucide() {
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
      lucide.createIcons();
    }
  }

  // ── Lightbox ──
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImage');
  const lightboxClose = document.getElementById('lightboxClose');

  function openLightbox(src) {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }
  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  // ── Load Config ──
  let cfg = {};

  async function loadConfig() {
    cfg = await EH_DATA.getConfig();

    const brandSpans = document.querySelectorAll('#navBrandName, #footerBrandName, #footerBrandBottom');
    brandSpans.forEach(el => { if (el) el.textContent = cfg.businessName; });

    const hoursEl = document.getElementById('footerHours');
    if (hoursEl) hoursEl.innerHTML = cfg.hours.replace(/\|/g, '<br>');

    const addrEl = document.getElementById('contactAddress');
    if (addrEl) addrEl.textContent = cfg.address;
    const phoneEl = document.getElementById('contactPhone');
    if (phoneEl) phoneEl.textContent = cfg.phone;
    const emailEl = document.getElementById('contactEmail');
    if (emailEl) emailEl.textContent = cfg.email;
    const hoursContact = document.getElementById('contactHours');
    if (hoursContact) hoursContact.innerHTML = cfg.hours.replace(/\|/g, '<br>');
    const waLink = document.getElementById('whatsappLink');
    if (waLink) {
      const waMsg = cfg.whatsappMessage || 'Hola, quiero informacion sobre sus productos.';
      waLink.href = `https://wa.me/${cfg.whatsapp}?text=${encodeURIComponent(waMsg.replace('{NOMBRE_PRODUCTO}', 'sus productos'))}`;
    }

    const socialContainer = document.getElementById('contactSocial');
    if (socialContainer) {
      const links = socialContainer.querySelectorAll('a');
      if (links[0]) links[0].href = cfg.social?.facebook || '#';
      if (links[1]) links[1].href = cfg.social?.instagram || '#';
      if (links[2]) links[2].href = cfg.social?.twitter || '#';
    }

    const aboutEl = document.getElementById('aboutText');
    if (aboutEl) aboutEl.textContent = cfg.aboutText;

    const heroTagEl = document.getElementById('heroTag');
    if (heroTagEl) heroTagEl.textContent = cfg.heroTag || cfg.businessName;
    const heroTitleEl = document.getElementById('heroTitle');
    if (heroTitleEl) heroTitleEl.innerHTML = cfg.heroTitle;
    const heroSubtitleEl = document.getElementById('heroSubtitle');
    if (heroSubtitleEl) heroSubtitleEl.textContent = cfg.heroSubtitle;

    // Page titles/subtitles
    const pageTitleProducts = document.getElementById('pageTitleProducts');
    if (pageTitleProducts) pageTitleProducts.textContent = cfg.sectionTitles?.pageProducts || 'Encuentra lo que necesitas';
    const pageSubtitleProducts = document.getElementById('pageSubtitleProducts');
    if (pageSubtitleProducts) pageSubtitleProducts.textContent = cfg.sectionSubtitles?.pageProducts || '';
    const pageTitleContact = document.getElementById('pageTitleContact');
    if (pageTitleContact) pageTitleContact.textContent = cfg.sectionTitles?.pageContact || 'Estamos para servirte';
    const pageSubtitleContact = document.getElementById('pageSubtitleContact');
    if (pageSubtitleContact) pageSubtitleContact.textContent = cfg.sectionSubtitles?.pageContact || '';
    const pageTitleAbout = document.getElementById('pageTitleAbout');
    if (pageTitleAbout) pageTitleAbout.textContent = cfg.sectionTitles?.pageAbout || 'Sobre Nosotros';
    const pageTitleGallery = document.getElementById('pageTitleGallery');
    if (pageTitleGallery) pageTitleGallery.textContent = cfg.sectionTitles?.pageGallery || 'Nuestra tienda en imagenes';
    const pageSubtitleGallery = document.getElementById('pageSubtitleGallery');
    if (pageSubtitleGallery) pageSubtitleGallery.textContent = cfg.sectionSubtitles?.pageGallery || '';

    // Logo
    if (cfg.logo) {
      const logoPlaceholders = document.querySelectorAll('.logo-placeholder');
      logoPlaceholders.forEach(logoPl => {
        logoPl.innerHTML = `<img src="${cfg.logo}" alt="Logo" style="width:100%;height:100%;object-fit:contain;border-radius:8px;padding:4px">`;
        logoPl.style.background = 'none';
      });
    }

    // Hero image from banner with ubicacion 'hero'
    const heroImgContainer = document.querySelector('.hero-image .img-placeholder');
    if (heroImgContainer) {
      const heroBanner = (cfg.banners || []).find(b => b.ubicacion === 'hero' && b.url);
      if (heroBanner) {
        heroImgContainer.innerHTML = `<img src="${heroBanner.url}" alt="${heroBanner.alt || 'Hero'}" style="width:100%;height:100%;object-fit:contain;border-radius:32px;padding:12px">`;
      }
    }

    // Banners secundarios (ubicacion starts with 'secundario')
    const bannerContainer = document.getElementById('bannersContainer');
    if (bannerContainer && isHome) {
      const banners = (cfg.banners || []).filter(b => b.ubicacion && b.ubicacion.startsWith('secundario') && b.url);
      if (banners.length > 0) {
        bannerContainer.innerHTML = banners.map(b => `
          <div class="banner-item reveal">
            <img src="${b.url}" alt="${b.alt || 'Banner'}">
          </div>
        `).join('');
        bannerContainer.querySelectorAll('.reveal').forEach(el => observer.observe(el));
      }
    }

    // Section tags
    const sectionTagDest = document.getElementById('sectionTagDestacados');
    if (sectionTagDest) sectionTagDest.textContent = cfg.sectionTags?.destacados || 'Lo Mas Buscado';
    const sectionTagBen = document.getElementById('sectionTagBeneficios');
    if (sectionTagBen) sectionTagBen.textContent = cfg.sectionTags?.beneficios || '?Por Que Elegirnos?';
    const sectionTagTest = document.getElementById('sectionTagTestimonios');
    if (sectionTagTest) sectionTagTest.textContent = cfg.sectionTags?.testimonios || 'Testimonios';

    const sectionTitleDest = document.getElementById('sectionTitleDestacados');
    if (sectionTitleDest) sectionTitleDest.textContent = cfg.sectionTitles?.destacados || 'Productos Destacados';
    const sectionSubtitleDest = document.getElementById('sectionSubtitleDestacados');
    if (sectionSubtitleDest) sectionSubtitleDest.textContent = cfg.sectionSubtitles?.destacados || '';

    const sectionTitleBen = document.getElementById('sectionTitleBeneficios');
    if (sectionTitleBen) sectionTitleBen.textContent = cfg.sectionTitles?.beneficios || 'Tu hogar merece lo mejor';
    const sectionSubtitleBen = document.getElementById('sectionSubtitleBeneficios');
    if (sectionSubtitleBen) sectionSubtitleBen.textContent = cfg.sectionSubtitles?.beneficios || '';

    const sectionTitleTest = document.getElementById('sectionTitleTestimonios');
    if (sectionTitleTest) sectionTitleTest.textContent = cfg.sectionTitles?.testimonios || 'Lo que dicen nuestros clientes';
    const sectionSubtitleTest = document.getElementById('sectionSubtitleTestimonios');
    if (sectionSubtitleTest) sectionSubtitleTest.textContent = cfg.sectionSubtitles?.testimonios || '';

    // Footer
    const footerDesc = document.getElementById('footerDesc');
    if (footerDesc) footerDesc.textContent = cfg.footerDescription || '';
    const footerCredits = document.getElementById('footerCredits');
    if (footerCredits) footerCredits.textContent = cfg.footerCredits || 'Todos los derechos reservados.';
    const footerPolicy = document.getElementById('footerPolicy');
    if (footerPolicy) footerPolicy.textContent = cfg.footerPolicy || 'Politica de Privacidad | Terminos y Condiciones';

    // CTA
    const ctaTitle = document.getElementById('ctaTitle');
    if (ctaTitle) ctaTitle.textContent = cfg.ctaTitle || '?Buscas un electrodomestico?';
    const ctaText = document.getElementById('ctaText');
    if (ctaText) ctaText.textContent = cfg.ctaText || '';

    // SEO
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && cfg.metaDescription) metaDesc.setAttribute('content', cfg.metaDescription);
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.name = 'keywords';
      document.head.appendChild(metaKeywords);
    }
    if (cfg.metaKeywords) metaKeywords.setAttribute('content', cfg.metaKeywords);
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', `${cfg.businessName} — ${cfg.slogan || ''}`.trim());
    document.title = `${cfg.businessName} — ${cfg.slogan || ''}`.trim();

    renderBenefits(cfg);
    renderTestimonials(cfg);
    renderStats(cfg);

    initLucide();
  }

  function renderBenefits(cfg) {
    const grid = document.getElementById('benefitsGrid');
    if (!grid) return;
    const benefits = cfg.benefits || [];
    if (benefits.length === 0) { grid.innerHTML = ''; return; }
    grid.innerHTML = benefits.map((b, i) => `
      <div class="glass-card benefit-card reveal reveal-delay-${(i % 4) + 1}">
        <div class="benefit-icon"><i data-lucide="${b.icon || 'circle'}" style="width:28px;height:28px"></i></div>
        <h3>${b.title}</h3>
        <p>${b.text}</p>
      </div>
    `).join('');
    grid.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    initLucide();
  }

  function renderTestimonials(cfg) {
    const grid = document.getElementById('testimonialsGrid');
    if (!grid) return;
    const testimonials = cfg.testimonials || [];
    if (testimonials.length === 0) { grid.innerHTML = ''; return; }
    grid.innerHTML = testimonials.map((t, i) => `
      <div class="glass-card testimonial-card reveal reveal-delay-${(i % 3) + 1}">
        <p>${t.text}</p>
        <div class="testimonial-author">
          <div class="testimonial-avatar">${t.initial || t.name.charAt(0)}</div>
          <div>
            <div class="name">${t.name}</div>
            <div class="role">${t.role}</div>
          </div>
        </div>
      </div>
    `).join('');
    grid.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }

  function renderStats(cfg) {
    const grid = document.getElementById('statsGrid');
    if (!grid) return;
    const stats = cfg.stats || [];
    if (stats.length === 0) { grid.innerHTML = ''; return; }
    grid.innerHTML = stats.map(s => `
      <div class="glass-card" style="text-align:center;padding:32px 20px">
        <div style="font-size:2rem;margin-bottom:12px"><i data-lucide="${s.icon || 'circle'}" style="width:32px;height:32px;color:var(--accent)"></i></div>
        <h3 style="font-size:2rem;font-weight:800;color:var(--accent)">${s.value}</h3>
        <p style="color:var(--text-secondary);font-size:0.9rem">${s.label}</p>
      </div>
    `).join('');
    initLucide();
  }

  loadConfig();

  // ── Cross-tab sync ──
  window.addEventListener('storage', (e) => {
    if (e.key && e.key.startsWith('eh_') && e.oldValue !== e.newValue) {
      location.reload();
    }
  });

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

  // ── Featured products (index) ──
  const featuredGrid = document.getElementById('featuredGrid');
  if (featuredGrid && isHome) {
    EH_DATA.getProducts().then(products => {
      const featured = products.slice(0, 3);
      renderProductCards(featuredGrid, featured);
    });
  }

  // ── Products page ──
  const menuGrid = document.getElementById('menuGrid');
  const searchInput = document.getElementById('searchInput');
  const categoryFilters = document.getElementById('categoryFilters');
  const emptyMenu = document.getElementById('emptyMenu');

  if (menuGrid) {
    let allProducts = [];
    let activeCategory = 'all';
    let searchTerm = '';
    const PER_PAGE = 12;
    let currentPage = 1;

    async function initProducts() {
      allProducts = await EH_DATA.getProducts();
      renderFilters();
      renderMenu();
    }

    async function getCategories() {
      const stored = await EH_DATA.getCategories();
      return ['all', ...stored];
    }

    async function renderFilters() {
      if (!categoryFilters) return;
      const cats = await getCategories();
      const existingBtns = categoryFilters.querySelectorAll('.filter-badge');
      const firstBtn = existingBtns[0];
      existingBtns.forEach(b => b.remove());
      if (firstBtn) categoryFilters.appendChild(firstBtn);

      cats.forEach(cat => {
        if (cat === 'all') return;
        const btn = document.createElement('button');
        btn.className = 'filter-badge';
        btn.dataset.category = cat;
        btn.textContent = cat;
        categoryFilters.appendChild(btn);
      });

      categoryFilters.addEventListener('click', (e) => {
        const btn = e.target.closest('.filter-badge');
        if (!btn) return;
        categoryFilters.querySelectorAll('.filter-badge').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeCategory = btn.dataset.category;
        currentPage = 1;
        renderMenu();
      });
    }

    function renderMenu() {
      let filtered = allProducts;

      if (activeCategory !== 'all') {
        filtered = filtered.filter(p => p.category === activeCategory);
      }

      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filtered = filtered.filter(p =>
          p.name.toLowerCase().includes(term) ||
          p.category.toLowerCase().includes(term)
        );
      }

      const totalPages = Math.ceil(filtered.length / PER_PAGE) || 1;
      if (currentPage > totalPages) currentPage = totalPages;
      const start = (currentPage - 1) * PER_PAGE;
      const pageItems = filtered.slice(start, start + PER_PAGE);

      if (pageItems.length === 0) {
        menuGrid.innerHTML = '';
        if (emptyMenu) emptyMenu.style.display = 'block';
        removePagination();
        return;
      }
      if (emptyMenu) emptyMenu.style.display = 'none';
      renderProductCards(menuGrid, pageItems);
      renderPagination(totalPages);
    }

    function renderPagination(totalPages) {
      let pagEl = document.getElementById('pagination');
      if (!pagEl) {
        pagEl = document.createElement('div');
        pagEl.id = 'pagination';
        pagEl.className = 'pagination';
        menuGrid.parentNode.insertBefore(pagEl, menuGrid.nextSibling);
      }
      pagEl.innerHTML = `
        <button class="page-btn" id="prevPage" ${currentPage <= 1 ? 'disabled' : ''}>Anterior</button>
        <span class="page-info">Pagina ${currentPage} de ${totalPages}</span>
        <button class="page-btn" id="nextPage" ${currentPage >= totalPages ? 'disabled' : ''}>Siguiente</button>
      `;
      document.getElementById('prevPage').addEventListener('click', () => {
        if (currentPage > 1) { currentPage--; renderMenu(); }
      });
      document.getElementById('nextPage').addEventListener('click', () => {
        if (currentPage < totalPages) { currentPage++; renderMenu(); }
      });
    }

    function removePagination() {
      const pagEl = document.getElementById('pagination');
      if (pagEl) pagEl.remove();
    }

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchTerm = e.target.value;
        currentPage = 1;
        renderMenu();
      });
    }

    initProducts();
  }

  function renderProductCards(container, products) {
    container.innerHTML = products.map(p => {
      const waMsg = (cfg.whatsappMessage || 'Hola, me interesa este producto: {NOMBRE_PRODUCTO}. ?Me podrian indicar el precio y disponibilidad?')
        .replace(/\{NOMBRE_PRODUCTO\}/g, p.name);
      const waNum = cfg.whatsapp || '50575381352';
      return `
      <div class="product-card reveal">
        <div class="card-image">
          ${p.image
            ? `<img src="${p.image}" alt="${p.name}" loading="lazy" class="product-img" data-src="${p.image}">`
            : `<span class="placeholder-icon"><i data-lucide="image" style="width:40px;height:40px;color:var(--text-muted)"></i></span>`}
        </div>
        <div class="card-body">
          <div class="card-category"><i data-lucide="tag" style="width:10px;height:10px;display:inline-block"></i> ${p.category}</div>
          <div class="card-title">${p.name}</div>
          <a href="https://wa.me/${waNum}?text=${encodeURIComponent(waMsg)}" target="_blank" class="card-whatsapp-btn" rel="noopener noreferrer">
            <i data-lucide="message-circle" style="width:18px;height:18px"></i> Consultar Precio
          </a>
        </div>
      </div>
    `}).join('');

    container.querySelectorAll('.product-img').forEach(img => {
      img.addEventListener('click', function () {
        openLightbox(this.dataset.src);
      });
    });

    container.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    initLucide();
  }

  // ── Gallery page ──
  const galleryGrid = document.getElementById('galleryGrid');
  if (galleryGrid) {
    EH_DATA.getGallery().then(images => {
      if (images.length === 0) {
        galleryGrid.innerHTML = '<div style="text-align:center;padding:60px 0;color:var(--text-muted)"><p>No hay imagenes en la galeria.</p></div>';
      } else {
        galleryGrid.innerHTML = images.map(img => `
          <div class="gallery-item reveal">
            ${img.url
              ? `<img src="${img.url}" alt="${img.alt}" loading="lazy" class="gallery-img" data-src="${img.url}">`
              : `<div class="placeholder-img"><i data-lucide="image" style="width:40px;height:40px;color:var(--text-muted)"></i></div>`}
          </div>
        `).join('');
        galleryGrid.querySelectorAll('.gallery-img').forEach(img => {
          img.addEventListener('click', function () {
            openLightbox(this.dataset.src);
          });
        });
        galleryGrid.querySelectorAll('.reveal').forEach(el => observer.observe(el));
        initLucide();
      }
    });
  }

})();
