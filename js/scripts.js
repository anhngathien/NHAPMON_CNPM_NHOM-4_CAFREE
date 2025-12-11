document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.content-section');

    // Hàm hiển thị section và đánh dấu link active
    function showSection(targetId) {
        // Ẩn tất cả section và xóa active class khỏi nav links
        sections.forEach(section => section.classList.remove('active'));
        navLinks.forEach(link => link.classList.remove('active'));

        // Hiển thị section mong muốn
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        // Đánh dấu link được click là active
        const activeLink = document.querySelector(`.nav a[href="#${targetId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }

    // Xử lý sự kiện click cho Navigation Links
    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            // Lấy ID của section từ thuộc tính href (bỏ dấu #)
            const targetId = event.target.getAttribute('href').substring(1);
            showSection(targetId);
        });
    });

    // Mặc định hiển thị Bảng Điều Khiển khi tải trang lần đầu
    // Lấy ID của section đầu tiên từ link đầu tiên
    const firstTargetId = navLinks[0] ? navLinks[0].getAttribute('href').substring(1) : 'dashboard';
    showSection(firstTargetId);
});

// Bạn có thể thêm các hàm chức năng như thêm món, sửa món vào đây