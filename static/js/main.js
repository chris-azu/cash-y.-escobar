document.addEventListener('DOMContentLoaded', function () {
    initNav();
    initHeroSlider();
    initLightbox();
    initScrollReveal();
});

function initNav() {
    const toggle = document.getElementById('navToggle');
    const menu = document.getElementById('navMenu');
    if (toggle && menu) {
        toggle.addEventListener('click', function () {
            menu.classList.toggle('active');
            toggle.classList.toggle('active');
        });
        document.addEventListener('click', function (e) {
            if (!toggle.contains(e.target) && !menu.contains(e.target)) {
                menu.classList.remove('active');
                toggle.classList.remove('active');
            }
        });
    }
}

function initHeroSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.dot');
    if (!slides.length) return;
    let current = 0;
    const total = slides.length;
    let interval;

    function goTo(index) {
        slides.forEach(s => s.classList.remove('active'));
        dots.forEach(d => d.classList.remove('active'));
        slides[index].classList.add('active');
        if (dots[index]) dots[index].classList.add('active');
        current = index;
    }

    function next() { goTo((current + 1) % total); }

    dots.forEach(dot => {
        dot.addEventListener('click', function () {
            goTo(parseInt(this.dataset.index));
            resetInterval();
        });
    });

    function resetInterval() {
        clearInterval(interval);
        interval = setInterval(next, 5000);
    }

    if (total > 1) {
        interval = setInterval(next, 5000);
    }
}

function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const closeBtn = lightbox ? lightbox.querySelector('.lightbox-close') : null;

    document.addEventListener('click', function (e) {
        const zoomBtn = e.target.closest('.btn-zoom');
        if (zoomBtn) {
            const imgSrc = zoomBtn.dataset.img;
            if (imgSrc && lightbox && lightboxImg) {
                lightboxImg.src = imgSrc;
                lightbox.classList.add('active');
            }
        }
    });

    if (lightbox && closeBtn) {
        closeBtn.addEventListener('click', function () {
            lightbox.classList.remove('active');
        });
        lightbox.addEventListener('click', function (e) {
            if (e.target === lightbox) {
                lightbox.classList.remove('active');
            }
        });
    }

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && lightbox) {
            lightbox.classList.remove('active');
        }
    });
}

function initScrollReveal() {
    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.product-card, .benefit-card, .stat-card, .mision-card, .vision-card, .contact-card').forEach(el => {
        el.classList.add('reveal');
        observer.observe(el);
    });
}

const style = document.createElement('style');
style.textContent = `
    .reveal { opacity: 0; transform: translateY(30px); transition: opacity 0.6s ease, transform 0.6s ease; }
    .reveal.visible { opacity: 1; transform: translateY(0); }
`;
document.head.appendChild(style);
