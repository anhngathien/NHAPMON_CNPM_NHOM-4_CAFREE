// --- 0. DỮ LIỆU MENU MẶC ĐỊNH (DATA) ---
const defaultMenu = [
    { name: "Trà sữa xoài", price: 35000, img: "images/tra-sua-xoai.jpg" },
    { name: "Trà sữa matcha", price: 35000, img: "images/tra-sua-matcha.jpg" },
    { name: "Sữa tươi đường nâu", price: 35000, img: "images/sua-tuoi-duong-nau.jpg" },
    { name: "Trà sữa đào", price: 35000, img: "images/tra-sua-dao.jpg" },
    { name: "Trà sữa thạch", price: 35000, img: "images/tra-sua-thach.jpg" },
    { name: "Tào phớ trà xanh", price: 35000, img: "images/tao-pho-tra-xanh.jpg" },
    { name: "Trà sữa kem cheese", price: 35000, img: "images/tra-sua-kem-cheese.jpg" },
    { name: "Trà xanh", price: 35000, img: "images/tra-xanh.jpg" },
    { name: "Smoothie dâu", price: 35000, img: "images/smoothie-dau.jpg" },
    { name: "Trà sữa đậu đỏ", price: 35000, img: "images/tra-sua-dau-do.jpg" },
    { name: "Trà ô long", price: 35000, img: "images/tra-o-long.jpg" },
    { name: "Trà sữa oreo", price: 35000, img: "images/tra-sua-oreo.jpg" },
    { name: "Trà hoa nhài", price: 35000, img: "images/tra-hoa-nhai.jpg" },
    { name: "Cà phê đen", price: 25000, img: "images/cafe-den.jpg" },
    { name: "Cà phê sữa", price: 28000, img: "images/cafe-sua.jpg" },
    { name: "Bạc xỉu", price: 30000, img: "images/bac-xiu.jpg" },
    { name: "Latte", price: 35000, img: "images/latte.jpg" },
    { name: "Cappuccino", price: 38000, img: "images/cappuccino.jpg" },
    { name: "Trà đào", price: 35000, img: "images/tra-dao.jpg" },
    { name: "Trà chanh", price: 30000, img: "images/tra-chanh.jpg" },
    { name: "Trà sữa truyền thống", price: 40000, img: "images/tra-sua.jpg" },
    { name: "Nước cam", price: 35000, img: "images/nuoc-ep-cam.jpg" }
];

// Hàm tải menu từ bộ nhớ ra màn hình
function loadMenu() {
    const menuGrid = document.querySelector(".menu-grid");
    if (!menuGrid) return; // Nếu không tìm thấy chỗ hiển thị thì thôi

    // Lấy menu từ bộ nhớ. Nếu chưa có thì dùng menu mặc định ở trên
    let storedMenu = JSON.parse(localStorage.getItem('cafeMenu'));
    if (!storedMenu || storedMenu.length === 0) {
        storedMenu = defaultMenu;
        localStorage.setItem('cafeMenu', JSON.stringify(storedMenu));
    }

    menuGrid.innerHTML = ""; // Xóa sạch nội dung cũ

    // Vẽ từng món ra màn hình
    storedMenu.forEach(item => {
        let html = `
            <div class="card" onclick="addItem('${item.name}', ${item.price})">
                <img src="${item.img}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/150?text=CAFREE'">
                <div class="card-body">
                    <b>${item.name}</b>
                    <div class="price">${item.price.toLocaleString()} đ</div>
                </div>
            </div>
        `;
        menuGrid.innerHTML += html;
    });
}

// Tự động chạy hàm loadMenu khi trang web tải xong
window.addEventListener('DOMContentLoaded', (event) => {
    loadMenu();
});
// --- 1. BIẾN TOÀN CỤC ---
let tableOrders = {}; 
let currentTableId = null;
let currentMenu = []; // Sẽ dùng cho bước 2

// --- 2. CÁC HÀM ĐIỀU HƯỚNG & HỆ THỐNG ---
function go(page) { window.location.href = page; }

function logout() {
    if (confirm("Bạn có chắc muốn đăng xuất?")) {
        window.location.href = "giao diện đăng nhập.html"; 
    }
}

function getCurrentTime() {
    let now = new Date();
    let h = now.getHours().toString().padStart(2, '0');
    let m = now.getMinutes().toString().padStart(2, '0');
    return `${h}:${m}`;
}

// Tạo mã hóa đơn ngẫu nhiên
function generateInvoiceCode() {
    let now = new Date();
    let id = now.getFullYear().toString() +
             (now.getMonth() + 1).toString().padStart(2, '0') +
             now.getDate().toString().padStart(2, '0') +
             now.getHours().toString().padStart(2, '0') +
             now.getMinutes().toString().padStart(2, '0');
    let random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return "HD" + id + "-" + random; 
}

// --- 3. QUẢN LÝ BÁN HÀNG (POS) ---

// Chọn bàn
function selectTable(btn, tableId){
    // Xóa class active ở các nút khác
    document.querySelectorAll(".table-bar button").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    currentTableId = tableId;
    document.getElementById("currentTableName").innerText = "Hóa đơn: " + tableId;
    document.getElementById("orderTime").innerText = "Giờ: " + getCurrentTime();

    if (!tableOrders[tableId]) {
        tableOrders[tableId] = {};
    }

    renderOrder();
}

// Thêm món vào giỏ
function addItem(name, price){
    if(!currentTableId){
        alert("Vui lòng chọn bàn trước khi gọi món!");
        return;
    }

    let cart = tableOrders[currentTableId];
    if(!cart[name]) {
        cart[name] = { price: price, qty: 1 };
    } else {
        cart[name].qty++;
    }
    renderOrder();
    updateTableStatus();
}

// Hiển thị danh sách món bên phải
function renderOrder(){
    if (!currentTableId) return;

    let cart = tableOrders[currentTableId];
    let container = document.getElementById("orderList");
    let html = "";
    let total = 0;

    if (Object.keys(cart).length === 0) {
        container.innerHTML = '<p style="text-align:center; color:#888; margin-top:50px;">Chưa có món nào</p>';
        document.getElementById("totalMoney").innerText = "0 đ";
        return;
    }

    for (let name in cart) {
        let item = cart[name];
        let itemTotal = item.qty * item.price;
        total += itemTotal;

        html += `
        <div class="order-item">
            <div>
                <div style="font-weight:bold; font-size:15px;">${name}</div>
                <div class="qty-control">
                    <button class="qty-btn" onclick="updateQty('${name}', -1)">-</button>
                    <span>${item.qty}</span>
                    <button class="qty-btn" onclick="updateQty('${name}', 1)">+</button>
                    <div style="font-size:12px; color:#666; margin-left:5px;">x ${item.price.toLocaleString()}</div>
                </div>
            </div>
            <div>
                <div style="font-weight:bold;">${itemTotal.toLocaleString()} đ</div>
                <div style="text-align:right;"><i class="fa-solid fa-trash remove-btn" onclick="removeItem('${name}')"></i></div>
            </div>
        </div>
        `;
    }

    container.innerHTML = html;
    document.getElementById("totalMoney").innerText = total.toLocaleString() + " đ";
}

// Tăng giảm số lượng
function updateQty(name, delta) {
    let cart = tableOrders[currentTableId];
    if(cart[name]) {
        cart[name].qty += delta;
        if (cart[name].qty <= 0) delete cart[name];
    }
    renderOrder();
    updateTableStatus();
}

// Xóa món
function removeItem(name) {
    if (confirm("Xóa món " + name + "?")) {
        let cart = tableOrders[currentTableId];
        delete cart[name];
        renderOrder();
        updateTableStatus();
    }
}

// Cập nhật trạng thái xanh/đỏ của bàn
function updateTableStatus() {
    let buttons = document.querySelectorAll(".table-bar button");
    // Mapping tên hiển thị sang ID lưu trữ
    let tableIdMap = {};
    buttons.forEach(btn => {
        // Lấy text của nút (VD: "Bàn 1") hoặc onclick value nếu có
        // Ở đây ta dựa vào logic trong HTML của bạn
        let text = btn.innerText; 
        // Logic đơn giản: Check xem trong tableOrders có dữ liệu cho bàn này không
        // Lưu ý: Trong HTML bạn gọi selectTable(this, 'B1') nhưng hiển thị là 'Bàn 1'
        // Để đơn giản, ta sẽ check lại logic HTML sau.
    });

    // Cách đơn giản hơn: Loop qua object tableOrders
    buttons.forEach(btn => {
         // Lấy ID bàn từ thuộc tính onclick (phân tích chuỗi) hoặc gán cứng
         // Tạm thời chỉ đổi màu nếu bàn hiện tại có món
         if(btn.classList.contains('active') && currentTableId && tableOrders[currentTableId] && Object.keys(tableOrders[currentTableId]).length > 0){
             btn.classList.add("has-order");
         }
    });
}

// --- 4. THANH TOÁN & MODAL ---

function pay() {
    if (!currentTableId) { alert("Chưa chọn bàn!"); return; }
    
    let cart = tableOrders[currentTableId];
    if (!cart || Object.keys(cart).length === 0) {
        alert("Bàn này chưa có món nào!");
        return;
    }

    // Tính tổng tiền
    let total = 0;
    for(let k in cart) total += cart[k].qty * cart[k].price;

    // Hiển thị thông tin lên Modal
    document.getElementById("modalTableName").innerText = currentTableId;
    document.getElementById("modalTotalMoney").innerText = total.toLocaleString() + " đ";
    document.getElementById("modalTotalMoney").dataset.value = total; 
    document.getElementById("modalInvoiceCode").innerText = generateInvoiceCode();
    document.getElementById("modalPaymentTime").innerText = getCurrentTime();
    
    // Reset form
    document.getElementById("customerPay").value = "";
    document.getElementById("changeText").innerText = "Tiền thừa: 0 đ";
    
    // Mở Modal
    document.getElementById("paymentModal").style.display = "flex";
}

function closeModal() {
    document.getElementById("paymentModal").style.display = "none";
}

function switchMethod(method) {
    document.querySelectorAll('.pay-section').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.pay-btn').forEach(el => el.classList.remove('active'));

    if (method === 'cash') {
        document.getElementById('section-cash').classList.add('active');
        document.querySelectorAll('.pay-btn')[0].classList.add('active');
    } else {
        document.getElementById('section-qr').classList.add('active');
        document.querySelectorAll('.pay-btn')[1].classList.add('active');
    }
}

function calcChange() {
    let total = parseFloat(document.getElementById("modalTotalMoney").dataset.value);
    let customerPay = parseFloat(document.getElementById("customerPay").value) || 0;
    let change = customerPay - total;

    let textEl = document.getElementById("changeText");
    if (change >= 0) {
        textEl.innerText = "Tiền thừa: " + change.toLocaleString() + " đ";
        textEl.style.color = "#27ae60";
    } else {
        textEl.innerText = "Thiếu: " + Math.abs(change).toLocaleString() + " đ";
        textEl.style.color = "#e74c3c";
    }
}

function confirmPayment(type) {
    let total = parseFloat(document.getElementById("modalTotalMoney").dataset.value);
    let note = document.getElementById("noteInput").value;
    let invoiceCode = document.getElementById("modalInvoiceCode").innerText;

    if (type === 'cash') {
        let customerPay = parseFloat(document.getElementById("customerPay").value) || 0;
        let change = customerPay - total;
        // Có thể thêm logic chặn nếu thiếu tiền ở đây
        alert(`Thanh toán THÀNH CÔNG!\nTrả lại khách: ${change.toLocaleString()} đ`);
    } else {
        alert("Xác nhận đã nhận chuyển khoản thành công!");
    }

    // --- LƯU LỊCH SỬ VÀO LOCALSTORAGE ---
    let newInvoice = {
        id: invoiceCode,
        date: new Date().toLocaleString('vi-VN'),
        table: currentTableId,
        total: total,
        note: note
    };

    let history = JSON.parse(localStorage.getItem('salesHistory')) || [];
    history.unshift(newInvoice);
    localStorage.setItem('salesHistory', JSON.stringify(history));

    // Reset bàn
    tableOrders[currentTableId] = {};
    document.getElementById("noteInput").value = "";
    
    renderOrder();
    updateTableStatus();
    closeModal();
}
// --- PHẦN XỬ LÝ PHÂN QUYỀN (Auth Logic) ---

// Sự kiện này đảm bảo HTML đã tải xong thì mới chạy code bên trong
document.addEventListener("DOMContentLoaded", function() {
    checkUserPermission();
});

function checkUserPermission() {
    // 1. Chỉ chạy logic này nếu đang ở trang có cần đăng nhập (Tránh lỗi ở trang Login)
    // Nếu không tìm thấy vùng hiển thị tên user -> có thể đang ở trang Login -> bỏ qua
    if (!document.getElementById("welcomeMsg")) return;

    // 2. Lấy user từ bộ nhớ
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));

    // 3. Nếu chưa đăng nhập -> Đuổi về Login
    if (!currentUser) {
        alert("Vui lòng đăng nhập để tiếp tục!");
        window.location.href = "login.html";
        return;
    }

    // 4. Hiển thị tên và vai trò
    const roleName = currentUser.role === 'admin' ? 'Chủ quán' : 'Nhân viên';
    const welcomeMsg = document.getElementById("welcomeMsg");
    if (welcomeMsg) {
        welcomeMsg.innerHTML = `Xin chào, <strong>${currentUser.name}</strong> (${roleName})`;
    }

    // 5. NẾU LÀ NHÂN VIÊN -> ẨN CÁC NÚT QUẢN LÝ
    if (currentUser.role !== 'admin') {
        // Danh sách các ID của nút cần ẩn
        const buttonsToHide = ["btnSuaMenu", "btnThongKe", "btnAdminOnly"];

        buttonsToHide.forEach(id => {
            const btn = document.getElementById(id);
            if (btn) {
                btn.style.display = "none"; // Ẩn nút đi
            }
        });
    }
}

// Hàm đăng xuất (để global để nút HTML gọi được)
function logout() {
    if(confirm("Bạn muốn đăng xuất khỏi hệ thống?")) {
        sessionStorage.removeItem('currentUser');
        window.location.href = "login.html";
    }
}