document.addEventListener('DOMContentLoaded', function () {
    initAdminNav();
    initMessages();
});

function initAdminNav() {
    const toggle = document.getElementById('adminNavToggle');
    const menu = document.getElementById('adminNavMenu');
    if (toggle && menu) {
        toggle.addEventListener('click', function () {
            menu.classList.toggle('active');
        });
    }
}

function initMessages() {
    document.querySelectorAll('.message').forEach(msg => {
        setTimeout(function () {
            msg.style.opacity = '0';
            msg.style.transition = 'opacity 0.3s ease';
            setTimeout(function () { msg.remove(); }, 300);
        }, 4000);
    });
}
