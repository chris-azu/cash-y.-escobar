document.addEventListener('DOMContentLoaded', function () {
    var menuToggle = document.getElementById('menuToggle');
    var sidebar = document.getElementById('adminSidebar');
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', function () {
            sidebar.style.display = sidebar.style.display === 'block' ? 'none' : 'block';
        });
        window.addEventListener('resize', function () {
            if (window.innerWidth > 768) {
                sidebar.style.display = '';
            } else {
                sidebar.style.display = 'none';
            }
        });
    }
    var messages = document.querySelectorAll('.message');
    messages.forEach(function (msg) {
        setTimeout(function () {
            msg.style.opacity = '0';
            msg.style.transition = 'opacity 0.3s';
            setTimeout(function () { msg.remove(); }, 300);
        }, 4000);
    });
});
