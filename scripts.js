// ===============================
// FILE SCRIPTS.JS HOÀN CHỈNH
// ===============================

// 1. CÁC HÀM CHUNG
function go(page) { window.location.href = page; }

function logout() {
    if (confirm("Bạn có chắc muốn đăng xuất?")) {
        window.location.href = "login.html"; 
    }
}

function getCurrentTime() {
    let now = new Date();
    let h = now.getHours().toString().padStart(2, '0');
    let m = now.getMinutes().toString().padStart(2, '0');
    return `${h}:${m}`;
}

// Hàm tạo mã hóa đơn ngẫu nhiên (Ví dụ: HD20251223-093012-123)
function generateInvoiceCode() {
    let now = new Date();
    let id = now.getFullYear().toString() +
             (now.getMonth() + 1).toString().padStart(2, '0') +
             now.getDate().toString().padStart(2, '0') +
             now.getHours().toString().padStart(2, '0') +
             now.getMinutes().toString().padStart(2, '0') +
             now.getSeconds().toString().padStart(2, '0');
    let random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return "HD" + id + "-" + random; 
}

// 2. QUẢN LÝ DỮ LIỆU
let tableOrders = {}; 
let tableTimestamps = {}; 
let currentTableId = null;

function selectTable(btn, tableId){
    document.querySelectorAll(".table-bar button").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentTableId = tableId;
    document.getElementById("currentTableName").innerText = "Hóa đơn: " + tableId;

    if (!tableOrders[tableId]) tableOrders[tableId] = {};

    if (tableTimestamps[tableId]) {
        document.getElementById("orderTime").innerText = "Giờ vào: " + tableTimestamps[tableId];
    } else {
        document.getElementById("orderTime").innerText = "--:--";
    }
    renderOrder();
}

function addItem(name, price){
    if(!currentTableId){ alert("Vui lòng chọn bàn hoặc 'Mang về' trước!"); return; }
    if (!tableTimestamps[currentTableId]) {
        tableTimestamps[currentTableId] = getCurrentTime();
        document.getElementById("orderTime").innerText = "Giờ vào: " + tableTimestamps[currentTableId];
    }
    let cart = tableOrders[currentTableId];
    if(!cart[name]) cart[name] = { price: price, qty: 1 };
    else cart[name].qty++;
    renderOrder();
    updateTableStatus();
}

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
        </div>`;
    }

    let finalTotal = total;
    let discountHtml = "";
    if (currentTableId === 'Mang về') {
        let discount = total * 0.3; 
        finalTotal = total - discount;
        discountHtml = `<div style="font-size:13px; color:#e74c3c; font-weight:normal;">(Gốc: ${total.toLocaleString()} - Giảm 30%)</div>`;
    }

    container.innerHTML = html;
    document.getElementById("totalMoney").innerHTML = finalTotal.toLocaleString() + " đ" + discountHtml;
}

function updateQty(name, delta) {
    let cart = tableOrders[currentTableId];
    if(cart[name]) {
        cart[name].qty += delta;
        if (cart[name].qty <= 0) delete cart[name];
    }
    renderOrder();
    updateTableStatus();
}

function removeItem(name) {
    if (confirm("Xóa món " + name + "?")) {
        let cart = tableOrders[currentTableId];
        delete cart[name];
        renderOrder();
        updateTableStatus();
    }
}

// 3. THANH TOÁN & MODAL
function pay() {
    if (!currentTableId) { alert("Chưa chọn bàn!"); return; }
    let cart = tableOrders[currentTableId];
    if (Object.keys(cart).length === 0) { alert("Chưa có món nào!"); return; }

    let total = 0;
    for(let k in cart) total += cart[k].qty * cart[k].price;

    let finalTotal = total;
    if (currentTableId === 'Mang về') { finalTotal = total * 0.7; }

    document.getElementById("modalTableName").innerText = currentTableId;
    
    // TẠO MÃ & GÁN VÀO HTML (Nếu HTML thiếu id modalInvoiceCode thì code sẽ lỗi tại đây)
    let invoiceCode = generateInvoiceCode();
    document.getElementById("modalInvoiceCode").innerText = invoiceCode;
    document.getElementById("modalInvoiceCode").dataset.code = invoiceCode;

    document.getElementById("modalTotalMoney").innerText = finalTotal.toLocaleString() + " đ";
    if (currentTableId === 'Mang về') {
         document.getElementById("modalTotalMoney").innerHTML += `<br><span style="font-size:14px; color:#666">(Đã giảm 30%)</span>`;
    }
    document.getElementById("modalTotalMoney").dataset.value = finalTotal;
    document.getElementById("modalPaymentTime").innerText = getCurrentTime();

    document.getElementById("customerPay").value = "";
    document.getElementById("changeText").innerText = "Tiền thừa: 0 đ";
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
    let rawChange = customerPay - total;
    let change = Math.round(rawChange / 1000) * 1000;

    if (change >= 0) {
        document.getElementById("changeText").innerText = "Tiền thừa: " + change.toLocaleString() + " đ";
        document.getElementById("changeText").style.color = "#27ae60";
    } else {
        document.getElementById("changeText").innerText = "Thiếu: " + Math.abs(change).toLocaleString() + " đ";
        document.getElementById("changeText").style.color = "#e74c3c";
    }
}

function confirmPayment(type) {
    let total = parseFloat(document.getElementById("modalTotalMoney").dataset.value);
    
    // 1. LẤY GHI CHÚ
    let noteContent = document.getElementById("noteInput").value; 

    // Xử lý tiền mặt (như cũ)
    if (type === 'cash') {
        let customerPay = parseFloat(document.getElementById("customerPay").value) || 0;
        let change = customerPay - total;
        if (change < 0) {
            // Nếu muốn bắt buộc đủ tiền mới cho qua thì mở comment dòng dưới
            // alert("Khách đưa thiếu tiền!"); return; 
        }
        alert(`Thanh toán THÀNH CÔNG!\nTrả lại: ${change.toLocaleString()} đ`);
    } else {
        alert("Đã xác nhận chuyển khoản thành công!");
    }

    // 2. LƯU VÀO LỊCH SỬ (localStorage) ĐỂ TRANG THỐNG KÊ ĐỌC ĐƯỢC
    let newInvoice = {
        id: "HD" + Date.now(), // Tạo mã hóa đơn ngẫu nhiên theo thời gian
        date: new Date().toLocaleString('vi-VN'), // Ngày giờ hiện tại
        table: currentTableId,
        total: total,
        note: noteContent // <--- LƯU GHI CHÚ VÀO ĐÂY
    };

    // Lấy danh sách cũ ra, thêm cái mới vào, rồi lưu lại
    let history = JSON.parse(localStorage.getItem('salesHistory')) || [];
    history.unshift(newInvoice); // Thêm vào đầu danh sách
    localStorage.setItem('salesHistory', JSON.stringify(history));

    // 3. DỌN DẸP DỮ LIỆU SAU KHI THANH TOÁN
    tableOrders[currentTableId] = {}; // Xóa món trong bàn
    
    document.getElementById("noteInput").value = ""; // <--- LỆNH XÓA GHI CHÚ LÀ ĐÂY
    
    renderOrder();
    updateTableStatus();
    closeModal();
}

function saveInvoiceToStorage(code, table, total) {
    let now = new Date();
    let invoice = {
        code: code,
        date: now.toLocaleDateString('vi-VN'),
        time: getCurrentTime(),
        table: table,
        total: total
    };
    let history = JSON.parse(localStorage.getItem('invoiceHistory')) || [];
    history.unshift(invoice);
    localStorage.setItem('invoiceHistory', JSON.stringify(history));
}

function updateTableStatus() {
    let buttons = document.querySelectorAll(".table-bar button");
    let tableIdMap = { "Bàn 1": "B1", "Bàn 2": "B2", "Bàn 3": "B3", "Bàn 4": "B4", "Bàn 5": "B5", "Mang về": "Mang về" };
    buttons.forEach(btn => {
        let tId = tableIdMap[btn.innerText];
        if (tableOrders[tId] && Object.keys(tableOrders[tId]).length > 0) {
            btn.classList.add("has-order");
        } else {
            btn.classList.remove("has-order");
        }
    });
}