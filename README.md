# NHAPMON_CNPM_NHOM-4_CAFREE
1. Giới thiệu hệ thống

Hệ thống quản lý cafe (Cafe Management System) là một phần mềm hỗ trợ quán cafe trong việc bán hàng, quản lý bàn, theo dõi hàng hóa, quản lý nhân viên và thống kê doanh thu.
Phần mềm giúp tối ưu quy trình phục vụ, giảm sai sót và tăng tốc độ bán hàng.

Hệ thống phục vụ 3 vai trò chính:

Quản lý

Nhân viên phục vụ

Thu ngân

2. Chức năng chính của hệ thống
2.1. Quản lý bán hàng (POS)

Gọi món trực tiếp trên phần mềm.

Tạo hóa đơn cho khách theo từng bàn.

Cập nhật số lượng, hủy món hoặc thay đổi món.

In hóa đơn khi thanh toán.

Theo dõi trạng thái hóa đơn (đang phục vụ / đã thanh toán).

2.2. Quản lý bàn

Theo dõi danh sách bàn và trạng thái (trống, có khách, đang phục vụ).

Chọn bàn để order.

Chuyển bàn, gộp bàn khi khách yêu cầu.

Nhìn tổng quan sơ đồ bàn để quản lý nhanh.

2.3. Quản lý thực đơn

Thêm/sửa/xóa các món trong menu.

Quản lý giá món.

Quản lý loại đồ uống (cà phê, trà sữa, nước ép, bánh ngọt…).

2.4. Quản lý kho

Theo dõi số lượng nguyên liệu.

Tự động trừ kho khi bán hàng (nếu có định lượng).

Cảnh báo khi nguyên liệu sắp hết.

Lịch sử nhập – xuất – tồn.

2.5. Quản lý nhân viên

Thêm/sửa/xóa thông tin nhân viên.

Phân quyền nhân viên (phục vụ / thu ngân / quản lý).

Tài khoản đăng nhập cho từng vai trò.

2.6. Quản lý doanh thu – báo cáo

Báo cáo doanh thu theo:

Ngày

Tháng

Khoảng thời gian tùy chọn

Thống kê top món bán chạy.

Thống kê hóa đơn theo ca làm việc.

3. Đối tượng sử dụng hệ thống
Vai trò	Quyền hạn
Quản lý	Xem báo cáo, quản lý menu, nhân viên, kho, doanh thu
Nhân viên phục vụ	Gọi món, tạo hóa đơn, cập nhật yêu cầu của khách
Thu ngân	Thanh toán, in hóa đơn, kiểm soát tiền mặt
4. Quy trình hoạt động của hệ thống
Bước 1: Khách chọn bàn → nhân viên chọn bàn trong phần mềm
Bước 2: Nhân viên nhập món khách gọi → tạo hóa đơn
Bước 3: Bếp/pha chế xem order (nếu có module này)
Bước 4: Phục vụ tiếp nhận món và phục vụ khách
Bước 5: Khách thanh toán → thu ngân in hóa đơn → cập nhật trạng thái bàn về “trống”
Bước 6: Hệ thống lưu lại doanh thu trong ngày
5. Công nghệ đề xuất

Frontend: WinForms / WPF / Web (tuỳ bạn học)

Backend: C#, .NET

Database: SQL Server

Quản lý mã nguồn: GitHub

Quản lý công việc: Trello

6. Lợi ích của hệ thống

Giảm thời gian gọi món → tăng hiệu suất phục vụ.

Hạn chế thất thoát tiền bạc nhờ lưu trữ dữ liệu chính xác.

Tăng tính chuyên nghiệp trong vận hành quán.

Dễ dàng xem doanh thu bất cứ lúc nào.

