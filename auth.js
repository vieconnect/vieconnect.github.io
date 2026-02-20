const users = {
    '0310902932': { 
         password: '15112015', 
        name: 'Nguyễn Nhật Nam', 
        sbd: 'EIO-1659', 
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
         stt2: '2', 
        subject2:'English International Olypiads (EIO)', 
        round2: 'Vòng Quốc gia', 
        time2: '15/2/2025 20:09', 
        examStatus2: 'Đã hoàn thành',
        result2: '3/10 (Giải Khuyến khích)',
        isLocked: false,
        lockInfo: {
            id: "EIO-1659",
            reason: "Vi phạm điều khoản sử dụng của VieConnect",
            startTime: "10:00 20/02/2026",
            duration: "Vĩnh viễn"
        }
    },
    'nhattiento2704@gmail.com': {
        password: '123456',
        name: 'Nguyễn Nhật Nam',
        isLocked: true,
        // Thông tin chi tiết về việc khóa
        lockInfo: {
            id: "LOCK-2025-001",
            reason: "Vi phạm điều khoản sử dụng của VieConnect",
            startTime: "11:20 20/02/2026",
            duration: "Vĩnh viễn"
        }
    }
};

function clearUserData() {
    localStorage.removeItem('currentUser');
}

function login(username, password) {
    clearUserData(); 
    const user = users[username];

    if (!user || user.password !== password) {
        return { success: false, reason: 'WRONG_AUTH' };
    }

    if (user.isLocked) {
        // Trả về thêm thông tin khóa để hiển thị lên Modal
        return { success: false, reason: 'LOCKED', lockDetails: user.lockInfo };
    }

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
            result1: user.result1,
            stt2: user.stt2,
            subject2: user.subject2,
            time2: user.time2,
            round2: user.round2,
            examStatus2: user.examStatus2,
            result2: user.result2
        
     }));
    return { success: true };
}

function logout() {
    clearUserData();
    // Chuyển hướng về trang đăng nhập
    window.location.href = 'login.html';
    // Ngăn người dùng quay lại trang trước
    setTimeout(() => {
        window.history.replaceState(null, '', 'login.html');
    }, 0);
}

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
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const errorMessage = document.getElementById('errorMessage');

            const result = login(username, password);

            if (result.success) {
                window.location.href = 'dashboard.html';
            } else {
                if (result.reason === 'LOCKED') {
                    // Đổ dữ liệu vào Modal trước khi hiển thị
                    document.getElementById('displayLockID').textContent = result.lockDetails.id;
                    document.getElementById('displayLockReason').textContent = result.lockDetails.reason;
                    document.getElementById('displayLockStart').textContent = result.lockDetails.startTime;
                    document.getElementById('displayLockDuration').textContent = result.lockDetails.duration;

                    const lockModal = new bootstrap.Modal(document.getElementById('lockAccountModal'));
                    lockModal.show();
                    if (errorMessage) errorMessage.style.display = 'none';
                } else {
                    if (errorMessage) {
                        errorMessage.textContent = 'Sai tên đăng nhập hoặc mật khẩu.';
                        errorMessage.style.display = 'block';
                    }
                }
            }
        });
    }
});
