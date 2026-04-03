const users = {
    '0310902932': { 
         password: '15112015', 
        name: 'Nguyễn Nhật Nam', 
        sbd: 'EIO-1659', 
        birthday: '15/11/2015', 
        class: '5', 
        school:'TH Nguyễn Văn Tố', 
        room: 'Phòng thi số 39', 
        examTime: '08h00 15/2/2025 (Đã hết thời gian thi)',
        stt1: '1', 
        subject1:'English International Olypiads (EIO)', 
        round1: 'Vòng loại', 
        time1: '13/2/2025 11:52', 
        examStatus1: 'Đã hoàn thành',
        result1: '9/10 (Được vào vòng Quốc gia)',
        resultAfterReview1: 'Chưa đăng ký phúc khảo',
         stt2: '2', 
        subject2:'English International Olypiads (EIO)', 
        round2: 'Vòng Quốc gia', 
        time2: '15/2/2025 20:09', 
        examStatus2: 'Đã hoàn thành',
        result2: '3/10 (Giải Khuyến khích)',
        resultAfterReview2: 'Chưa đăng ký phúc khảo',
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
        examTime: user.examTime,
        stt1: user.stt1,
        subject1: user.subject1,
        time1: user.time1,
        round1: user.round1,
        examStatus1: user.examStatus1,
        result1: user.result1,
        resultAfterReview1: user.resultAfterReview1,
        stt2: user.stt2,
        subject2: user.subject2,
        time2: user.time2,
        round2: user.round2,
        examStatus2: user.examStatus2,
        result2: user.result2,
        resultAfterReview2: user.resultAfterReview2

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

// document.addEventListener('DOMContentLoaded', () => {
//     const loginForm = document.getElementById('loginForm');
//     const alertPlaceholder = document.getElementById('alertPlaceholder');
//     const loadingOverlay = document.getElementById('loadingOverlay');
//     const usernameInput = document.getElementById('username'); // Thêm mới
//     const passwordInput = document.getElementById('password');
//     const loginBtn = document.getElementById('loginBtn'); // Thêm mới
//     const togglePassword = document.getElementById('togglePassword');

//     if (!loginForm) return;

//     // --- LOGIC DISABLE BUTTON (THÊM MỚI) ---
//     const checkInputs = () => {
//         const userVal = usernameInput.value.trim();
//         const passVal = passwordInput.value.trim();
//         loginBtn.disabled = !(userVal && passVal); // Disable nếu 1 trong 2 trống
//     };

//     usernameInput.addEventListener('input', checkInputs);
//     passwordInput.addEventListener('input', checkInputs);
//     // ---------------------------------------

//     const showAlert = (msg) => {
//         alertPlaceholder.innerHTML = ''; 
//         const div = document.createElement('div');
//         div.className = 'custom-alert';
//         div.innerHTML = `<span class="alert-i-circle">i</span><span>${msg}</span>`;
//         alertPlaceholder.appendChild(div);
//     };

//     loginForm.onsubmit = (e) => {
//         e.preventDefault();
//         alertPlaceholder.innerHTML = ''; 
        
//         const userVal = usernameInput.value.trim();
//         const passVal = passwordInput.value.trim();

//         // Giữ nguyên logic kiểm tra thông báo của bạn
//         if (!userVal && !passVal) {
//             showAlert("Tên đăng nhập là bắt buộc");
//             showAlert("Mật khẩu là bắt buộc");
//             return;
//         } else if (!userVal) {
//             showAlert("Tên đăng nhập là bắt buộc");
//             return;
//         } else if (!passVal) {
//             showAlert("Mật khẩu là bắt buộc");
//             return;
//         }

//         loadingOverlay.style.display = 'flex';

//         setTimeout(() => {
//             const result = login(userVal, passVal); 

//             if (result.success) {
//                 window.location.replace('dashboard.html'); 
//             } else {
//                 loadingOverlay.style.display = 'none';
//                 if (result.reason === 'WRONG_AUTH') {
//                     showAlert("Tài khoản hoặc Mật khẩu không đúng!");
//                 } else if (result.reason === 'LOCKED') {
//                     document.getElementById('displayLockID').innerText = result.lockDetails.id;
//                     document.getElementById('displayLockReason').innerText = result.lockDetails.reason;
//                     document.getElementById('displayLockStart').innerText = result.lockDetails.startTime;
//                     document.getElementById('displayLockDuration').innerText = result.lockDetails.duration;
                    
//                     const lockModal = new bootstrap.Modal(document.getElementById('lockAccountModal'));
//                     lockModal.show();
//                 }
//             }
//         }, 2000);
//     };
// });

// ... (Các phần khai báo users và function login giữ nguyên) ...

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const alertPlaceholder = document.getElementById('alertPlaceholder');
    const loadingOverlay = document.getElementById('loadingOverlay');
    const passwordInput = document.getElementById('password');

    if (!loginForm) return;

    // Hàm hiển thị thông báo lỗi màu đỏ với icon tam giác
    const showAlert = (msg) => {
        alertPlaceholder.innerHTML = ''; 
        const div = document.createElement('div');
        div.className = 'custom-alert';
        // Biểu tượng tam giác với dấu chấm than (!)
        div.innerHTML = `<span class="alert-i-circle">!</span><span>${msg}</span>`;
        alertPlaceholder.appendChild(div);
    };

    loginForm.onsubmit = (e) => {
        e.preventDefault();
        alertPlaceholder.innerHTML = ''; 
        
        // Hiện loading xoay xoay cho giống thật
        loadingOverlay.style.display = 'flex';

        setTimeout(() => {
            // Tắt loading và luôn hiển thị lỗi không xác định
            loadingOverlay.style.display = 'none';
            showAlert("Something went wrong. Please try again");
        }, 5000); // Đợi 1 giây rồi báo lỗi
    };
});
