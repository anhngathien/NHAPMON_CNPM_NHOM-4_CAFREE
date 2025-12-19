// ===============================
// ĐIỀU HƯỚNG TRANG
// ===============================
function go(page) {
    window.location.href = page;
}

// ===============================
// ĐĂNG XUẤT
// ===============================
function logout() {
    const ok = confirm("Bạn có chắc muốn đăng xuất?");
    if (ok) {
        window.location.href = "login-check.html";
    }
}

// ===============================
// ACTIVE MENU (nếu dùng nav)
// ===============================
document.addEventListener("DOMContentLoaded", function () {
    const links = document.querySelectorAll(".nav a");
    const currentPage = window.location.pathname.split("/").pop();

    links.forEach(link => {
        const href = link.getAttribute("href");
        if (href === currentPage) {
            link.classList.add("active");
        }
    });
});
