// ===============================
// 1. CÁC HÀM ĐIỀU HƯỚNG & CHUNG
// ===============================
function go(page) {
    window.location.href = page;
}

function logout() {
    const ok = confirm("Bạn có chắc muốn đăng xuất?");
    if (ok) {
        window.location.href = "login.html"; 
    }
}

// Hàm lấy giờ hiện tại (HH:mm)
function getCurrentTime() {
    let now = new Date();
    let h = now.getHours().toString().padStart(2, '0');
    let m = now.getMinutes().toString().padStart(2, '0');
    return `${h}:${m}`;
}

// ===============================
// 2. LOGIC QUẢN LÝ DỮ LIỆU
// ===============================
let tableOrders = {}; 
let tableTimestamps = {}; 
let currentTableId = null;

// --- Chọn bàn ---
function selectTable(btn, tableId){
    // Update giao diện nút bàn
    document.querySelectorAll(".table-bar button").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    currentTableId = tableId;
    document.getElementById("currentTableName").innerText = "Hóa đơn: " + tableId;

    // Tạo dữ liệu nếu chưa có
    if (!tableOrders[tableId]) {
        tableOrders[tableId] = {};
    }

    // Hiển thị giờ vào
    if (tableTimestamps[tableId]) {
        document.getElementById("orderTime").innerText = "Giờ vào: " + tableTimestamps[tableId];
    } else {
        document.getElementById("orderTime").innerText = "--:--";
    }

    renderOrder();
}

// --- Thêm món ---
function addItem(name, price){
    if(!currentTableId){
        alert("Vui lòng chọn bàn hoặc 'Mang về' trước!");
        return;
    }

    // Set giờ vào nếu chưa có
    if (!tableTimestamps[currentTableId]) {
        tableTimestamps[currentTableId] = getCurrentTime();
        document.getElementById("orderTime").innerText = "Giờ vào: " + tableTimestamps[currentTableId];
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

// --- Hiển thị danh sách món (CÓ LOGIC GIẢM GIÁ) ---
function renderOrder(){
    if (!currentTableId) return;

    let cart = tableOrders[currentTableId];
    let container = document.getElementById("orderList");
    let html = "";
    let total = 0;

    // Nếu giỏ hàng rỗng
    if (Object.keys(cart).length === 0) {
        container.innerHTML = '<p style="text-align:center; color:#888; margin-top:50px;">Chưa có món nào</p>';
        document.getElementById("totalMoney").innerText = "0 đ";
        return;
    }

    // Duyệt món
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

    // --- LOGIC GIẢM GIÁ MANG VỀ ---
    let finalTotal = total;
    let discountHtml = "";
    
    if (currentTableId === 'Mang về') {
        let discount = total * 0.3; // Tính 30%
        finalTotal = total - discount;
        
        // Tạo dòng hiển thị giảm giá màu đỏ
        discountHtml = `<div style="font-size:13px; color:#e74c3c; font-weight:normal;">
                            (Gốc: ${total.toLocaleString()} - Giảm 30%)
                        </div>`;
    }

    container.innerHTML = html;
    
    // Cập nhật tổng tiền hiển thị
    document.getElementById("totalMoney").innerHTML = finalTotal.toLocaleString() + " đ" + discountHtml;
}

// --- Tăng giảm số lượng ---
function updateQty(name, delta) {
    let cart = tableOrders[currentTableId];
    if(cart[name]) {
        cart[name].qty += delta;
        if (cart[name].qty <= 0) delete cart[name];
    }
    renderOrder();
    updateTableStatus();
}

// --- Xóa món ---
function removeItem(name) {
    if (confirm("Xóa món " + name + "?")) {
        let cart = tableOrders[currentTableId];
        delete cart[name];
        renderOrder();
        updateTableStatus();
    }
}

// ===============================
// 3. LOGIC THANH TOÁN & MODAL
// ===============================

// Mở Popup Thanh toán
function pay() {
    if (!currentTableId) { alert("Chưa chọn bàn!"); return; }
    
    let cart = tableOrders[currentTableId];
    if (Object.keys(cart).length === 0) {
        alert("Chưa có món nào để thanh toán!");
        return;
    }

    // Tính lại tổng tiền gốc
    let total = 0;
    for(let k in cart) total += cart[k].qty * cart[k].price;

    // Tính giảm giá nếu là Mang về
    let finalTotal = total;
    if (currentTableId === 'Mang về') {
        finalTotal = total * 0.7; // Giảm 30% còn 70%
    }

    document.getElementById("modalTableName").innerText = currentTableId;
    
    // Hiển thị tiền cuối cùng lên Modal
    document.getElementById("modalTotalMoney").innerText = finalTotal.toLocaleString() + " đ";
    
    // Nếu có giảm giá thì hiển thị thêm chú thích
    if (currentTableId === 'Mang về') {
         document.getElementById("modalTotalMoney").innerHTML += `<br><span style="font-size:14px; color:#666">(Đã giảm 30%)</span>`;
    }

    document.getElementById("modalTotalMoney").dataset.value = finalTotal;
    
    // Hiển thị giờ thanh toán
    document.getElementById("modalPaymentTime").innerText = getCurrentTime();

    // Reset form
    document.getElementById("customerPay").value = "";
    document.getElementById("changeText").innerText = "Tiền thừa: 0 đ";
    
    document.getElementById("paymentModal").style.display = "flex";
}

// Đóng Popup
function closeModal() {
    document.getElementById("paymentModal").style.display = "none";
}

// Chuyển đổi Tiền mặt / QR
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

// Tính tiền thừa
function calcChange() {
    let total = parseFloat(document.getElementById("modalTotalMoney").dataset.value);
    let customerPay = parseFloat(document.getElementById("customerPay").value) || 0;
    let change = customerPay - total;

    if (change >= 0) {
        document.getElementById("changeText").innerText = "Tiền thừa: " + change.toLocaleString() + " đ";
        document.getElementById("changeText").style.color = "#27ae60";
    } else {
        document.getElementById("changeText").innerText = "Thiếu: " + Math.abs(change).toLocaleString() + " đ";
        document.getElementById("changeText").style.color = "#e74c3c";
    }
}

// Xác nhận thanh toán cuối cùng
function confirmPayment(type) {
    let total = parseFloat(document.getElementById("modalTotalMoney").dataset.value);
    
    if (type === 'cash') {
        let customerPay = parseFloat(document.getElementById("customerPay").value) || 0;
        let change = customerPay - total;
        
        // Cho phép thanh toán kể cả khi thiếu (tùy chọn)
        if (change >= 0) {
            alert(`Thanh toán THÀNH CÔNG!\nTrả lại khách: ${change.toLocaleString()} đ`);
        } else {
             alert("Thanh toán thành công!");
        }
    } else {
        alert("Xác nhận đã nhận tiền chuyển khoản!\nThanh toán thành công.");
    }

    // Xóa dữ liệu
    tableOrders[currentTableId] = {};
    delete tableTimestamps[currentTableId]; 
    document.getElementById("orderTime").innerText = "--:--";

    renderOrder();
    updateTableStatus();
    closeModal();
}

// Cập nhật trạng thái nút bàn
function updateTableStatus() {
    let buttons = document.querySelectorAll(".table-bar button");
    
    // Bản đồ ánh xạ tên nút -> ID bàn (Thêm "Mang về")
    let tableIdMap = {
        "Bàn 1": "B1", "Bàn 2": "B2", "Bàn 3": "B3", "Bàn 4": "B4", "Bàn 5": "B5",
        "Mang về": "Mang về"
    };

    buttons.forEach(btn => {
        let tId = tableIdMap[btn.innerText];
        // Nếu bàn có order
        if (tableOrders[tId] && Object.keys(tableOrders[tId]).length > 0) {
            btn.classList.add("has-order");
        } else {
            btn.classList.remove("has-order");
        }
    });
}