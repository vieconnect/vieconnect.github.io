// Dữ liệu người dùng mẫu
const users = {
    'nhatnam-0888363955@tio.com': { 
        password: 'Nhatnam1511@', 
        name: 'Nguyễn Nhật Nam', 
        sbd: 'TIO-1659', 
        birthday: '15/11/2015', 
        class: '5', 
        school:'TH Nguyễn Văn Tố', 
        room: 'Phòng thi số 39', 
        stt1: '1', 
        subject1:'English International Olypiads (EIO)', 
        round1: 'Vòng loại', 
        time1: '13/2/2025 11:52', 
        examStatus1: 'Đã hoàn thành',
        result1: '9/10 (Được vào vòng Quốc gia)',
         stt1: '2', 
        subject1:'English International Olypiads (EIO)', 
        round1: 'Vòng Quốc gia', 
        time1: '15/2/2025 20:09', 
        examStatus1: 'Đã hoàn thành',
        result1: '3/10 (Giải Khuyến khích)'},
};

// Hàm xóa sạch mọi dữ liệu người dùng khỏi localStorage
function clearUserData() {
    localStorage.removeItem('currentUser');
    // Nếu bạn có lưu thêm các dữ liệu khác sau này (ví dụ: 'userSettings'), hãy xóa ở đây
    // localStorage.removeItem('userSettings'); 
}

// Hàm đăng nhập
function login(username, password) {
    // NGAY LẬP TỨC xóa dữ liệu người dùng cũ trước khi xử lý đăng nhập mới
    clearUserData(); 
    
    const user = users[username];
    if (user && user.password === password) {
        // Lưu thông tin người dùng MỚI vào localStorage
        localStorage.setItem('currentUser', JSON.stringify({ 
            username: username, 
            name: user.name, 
            sbd: user.sbd,
            birthday: user.birthday,
            class: user.class,
            school: user.school,
            room: user.room,
            stt1: user.stt1,
            subject1: user.subject1,
            time1: user.time1,
            round1: user.round1,
            examStatus1: user.examStatus1,
            result1: user.result1
            
        }));
        // Chuyển hướng đến dashboard
        window.location.href = 'dashboard.html';
        return true;
    }
    return false;
}

// Hàm đăng xuất (chỉ cần gọi lại hàm xóa dữ liệu)
function logout() {
    clearUserData();
    // Chuyển hướng về trang đăng nhập
    window.location.href = 'login.html';
    // Ngăn người dùng quay lại trang trước
    setTimeout(() => {
        window.history.replaceState(null, '', 'login.html');
    }, 0);
}

// Hàm kiểm tra trạng thái đăng nhập trên các trang yêu cầu bảo mật
function checkLoginState() {
    const currentUser = localStorage.getItem('currentUser');
    const currentPage = window.location.pathname.split('/').pop(); 
    
    if (!currentUser && currentPage !== 'login.html') {
        window.location.href = 'login.html';
    }
}

// Hàm cập nhật giao diện dashboard
function updateDashboardUI() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        const welcomeMessageEl = document.getElementById('welcomeMessage');
        const examRoomNavItemEl = document.getElementById('examRoomNavItem');

        if (welcomeMessageEl) {
            welcomeMessageEl.textContent = `Xin chào, ${currentUser.name}!`;
        }
        
        if (examRoomNavItemEl) {
            examRoomNavItemEl.style.display = 'block';
        }
    }
}

// --- Logic chạy khi script auth.js được tải ---

// 1. Kiểm tra trạng thái đăng nhập ngay lập tức
checkLoginState();

// 2. Gắn sự kiện cho form đăng nhập (chỉ chạy nếu đang ở trang index.html)
if (window.location.pathname.endsWith('/login.html')) {
    document.addEventListener('DOMContentLoaded', () => {
        document.getElementById('loginForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const errorMessage = document.getElementById('errorMessage');

            if (!login(username, password)) {
                errorMessage.textContent = 'Sai tên đăng nhập hoặc mật khẩu.';
                errorMessage.style.display = 'block';
            }

            if (username="nhatnam-0888363955@tio.com" , password="Nhatnam1511@") {
                errorMessage.innerHTML = 'Tài khoản này đã bị khóa do vi phạm Điều khoản sử dụng của VieConnect. <a href="/dieu-khoan-su-dung.html" target="_blank">Đọc Điều khoản sử dụng</a>'
            }
        });
    });
}
