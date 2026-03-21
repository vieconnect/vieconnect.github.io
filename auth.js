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
            id: "EIO-2950",
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
    window.location.href = 'login.html';
    setTimeout(() => {
        window.history.replaceState(null, '', 'login.html');
    }, 0);
}

function checkLoginState() {
    const currentUser = localStorage.getItem('currentUser');
    const path = window.location.pathname;
    
    // Kiểm tra xem trang hiện tại có phải trang login hay không
    // Thêm kiểm tra index.html nếu đó là trang mặc định của bạn
    const isLoginPage = path.includes('login.html') || path.endsWith('index.html');

    if (!currentUser && !isLoginPage) {
        // Nếu không có user và không ở trang login -> Quay về login
        window.location.href = 'login.html';
    }
}

function updateDashboardUI() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        const welcomeMessageEl = document.getElementById('welcomeMessage');
        if (welcomeMessageEl) {
            welcomeMessageEl.textContent = `Xin chào, ${currentUser.name}!`;
        }
    }
}

// --- KHỞI CHẠY ---
// --- KHỞI CHẠY ---
// Gọi kiểm tra ngay lập tức khi file JS được load
checkLoginState();

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const alertPlaceholder = document.getElementById('alertPlaceholder');
    const loadingOverlay = document.getElementById('loadingOverlay');
    const passwordInput = document.getElementById('password');
    const togglePassword = document.getElementById('togglePassword');

    if (!loginForm) return; // Bảo vệ nếu JS load ở trang không có form

    const showAlert = (msg) => {
        alertPlaceholder.innerHTML = ''; // Xóa lỗi cũ trước khi hiện lỗi mới
        const div = document.createElement('div');
        div.className = 'custom-alert';
        div.innerHTML = `<span class="alert-i-circle">i</span><span>${msg}</span>`;
        alertPlaceholder.appendChild(div);
    };

    loginForm.onsubmit = (e) => {
        e.preventDefault();
        alertPlaceholder.innerHTML = '';
        
        const userVal = document.getElementById('username').value.trim();
        const passVal = passwordInput.value.trim();

        if (!userVal || !passVal) {
            if (!userVal) showAlert("Tên đăng nhập là bắt buộc");
            if (!passVal) showAlert("Mật khẩu là bắt buộc");
            return;
        }

        loadingOverlay.style.display = 'flex';

        setTimeout(() => {
            const result = login(userVal, passVal); 

            if (result.success) {
                // Đảm bảo đường dẫn này chính xác với cấu trúc thư mục của bạn
                window.location.replace('dashboard.html'); 
            } else {
                loadingOverlay.style.display = 'none';
                if (result.reason === 'WRONG_AUTH') {
                    showAlert("Tài khoản hoặc Mật khẩu không đúng!");
                } else if (result.reason === 'LOCKED') {
                    document.getElementById('displayLockID').innerText = result.lockDetails.id;
                    document.getElementById('displayLockReason').innerText = result.lockDetails.reason;
                    document.getElementById('displayLockStart').innerText = result.lockDetails.startTime;
                    document.getElementById('displayLockDuration').innerText = result.lockDetails.duration;
                    
                    const lockModal = new bootstrap.Modal(document.getElementById('lockAccountModal'));
                    lockModal.show();
                }
            }
        }, 1000);
    };
});
