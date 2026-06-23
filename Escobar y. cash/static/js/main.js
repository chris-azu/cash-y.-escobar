document.addEventListener('DOMContentLoaded', function () {
    var navToggle = document.getElementById('navToggle');
    var siteNav = document.getElementById('siteNav');
    if (navToggle && siteNav) {
        navToggle.addEventListener('click', function () {
            siteNav.classList.toggle('open');
        });
    }

    var slider = document.getElementById('heroSlider');
    if (slider) {
        var slides = slider.querySelectorAll('.slide');
        var dots = slider.querySelectorAll('.dot');
        var current = 0;
        var interval;

        function goToSlide(index) {
            slides.forEach(function (s) { s.classList.remove('active'); });
            dots.forEach(function (d) { d.classList.remove('active'); });
            slides[index].classList.add('active');
            dots[index].classList.add('active');
            current = index;
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                clearInterval(interval);
                goToSlide(parseInt(this.getAttribute('data-slide')));
                startAutoplay();
            });
        });

        function startAutoplay() {
            interval = setInterval(function () {
                goToSlide((current + 1) % slides.length);
            }, 5000);
        }

        if (slides.length > 1) {
            startAutoplay();
        }
    }

    var zoomBtns = document.querySelectorAll('.btn-zoom');
    zoomBtns.forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            var imageUrl = this.getAttribute('data-image');
            openLightbox(imageUrl);
        });
    });

    var productImages = document.querySelectorAll('.product-image img');
    productImages.forEach(function (img) {
        img.addEventListener('click', function () {
            openLightbox(this.src);
        });
    });

    function openLightbox(src) {
        var existing = document.querySelector('.lightbox');
        if (existing) existing.remove();

        var lightbox = document.createElement('div');
        lightbox.className = 'lightbox active';
        lightbox.innerHTML = '<button class="lightbox-close">&times;</button><img src="' + src + '" alt="Ampliada">';
        document.body.appendChild(lightbox);

        lightbox.querySelector('.lightbox-close').addEventListener('click', function () {
            lightbox.classList.remove('active');
            setTimeout(function () { lightbox.remove(); }, 200);
        });

        lightbox.addEventListener('click', function (e) {
            if (e.target === lightbox) {
                lightbox.classList.remove('active');
                setTimeout(function () { lightbox.remove(); }, 200);
            }
        });

        document.addEventListener('keydown', function handler(e) {
            if (e.key === 'Escape') {
                lightbox.classList.remove('active');
                setTimeout(function () { lightbox.remove(); }, 200);
                document.removeEventListener('keydown', handler);
            }
        });
    }

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.product-card, .stat-item, .about-card, .contact-card').forEach(function (el) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(el);
    });
});
