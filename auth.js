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
        },
    isDeleted: false,
    },
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

    if (user.isDeleted) {
        return {success: false, reason: 'DELETED'}
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

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const loadingOverlay = document.getElementById('loadingOverlay');
    const loadingToast = document.getElementById('loadingToast');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const togglePassword = document.getElementById('togglePassword');
    
    let loginBtn = document.getElementById('loginBtn');
    if (!loginBtn && loginForm) {
        loginBtn = loginForm.querySelector('button[type="submit"]');
    }

    if (!loginForm) return;

    // Hàm tạo Toast động
   const showToast = (msg) => {
        const container = document.querySelector('.toast-container');
        if (!container) return;

        const toastId = 'toast-' + Date.now();
        const toastHTML = `
            <div id="${toastId}" class="toast align-items-center text-white bg-danger border-0 custom-toast-slide show" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="d-flex">
                    <div class="toast-body d-flex align-items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-exclamation-triangle-fill me-2 flex-shrink-0" viewBox="0 0 16 16">
                            <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                        </svg>
                        <span style="flex-grow: 1;">${msg}</span>
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
                <div class="progress" style="height: 3px; background: rgba(255,255,255,0.2);">
                    <div class="progress-bar bg-white" role="progressbar" style="width: 100%; animation: toastProgressAnim 4s linear forwards;"></div>
                </div>
            </div>`;

        container.insertAdjacentHTML('beforeend', toastHTML);
        const toastNode = document.getElementById(toastId);
        
        // Khởi tạo Bootstrap Toast
        const bsToast = new bootstrap.Toast(toastNode, { 
            delay: 4000,
            autohide: true 
        });
        
        bsToast.show();

        // Xóa khỏi DOM sau khi hiệu ứng trượt kết thúc (đợi 500ms để kịp trượt ra)
        toastNode.addEventListener('hidden.bs.toast', () => {
            setTimeout(() => { toastNode.remove(); }, 500);
        });
    };

    loginForm.onsubmit = (e) => {
        e.preventDefault();

                const captchaResponse = grecaptcha.getResponse();
    
    if (captchaResponse.length === 0) {
        showToast("Bạn chưa tích vào ô xác nhận reCAPTCHA!");
        return; // Dừng xử lý đăng nhập
    }
        
        
        const userVal = usernameInput.value.trim();
        const passVal = passwordInput.value.trim();

        if (!userVal || !passVal) {
            if (!userVal) showToast("Tên đăng nhập là bắt buộc");
            if (!passVal) showToast("Mật khẩu là bắt buộc");
            return;
        }

        if (loginBtn) loginBtn.disabled = true;
        if (loadingOverlay) loadingOverlay.style.display = 'block';
        if (loadingToast) loadingToast.style.display = 'flex';

        setTimeout(() => {
            const result = login(userVal, passVal); 
            if (result.reason === 'DELETED') {
                showToast("Tài khoản này đã bị xóa theo chính sách hoạt động của VieConnect. Truy cập https://vieconnect.github.io/dieu-khoan-su-dung để biết thêm thông tin về chính sách")
            }
            if (result.success) {
                window.location.replace('dashboard.html'); 
            } else {
                if (loginBtn) loginBtn.disabled = false;
                if (loadingOverlay) loadingOverlay.style.display = 'none';
                if (loadingToast) loadingToast.style.display = 'none';

                if (result.reason === 'WRONG_AUTH') {
                    showToast("Tài khoản hoặc Mật khẩu không đúng!");
                } else if (result.reason === 'LOCKED') {
                    const displayId = document.getElementById('displayLockID');
                    const displayReason = document.getElementById('displayLockReason');
                    const displayStart = document.getElementById('displayLockStart');
                    const displayDuration = document.getElementById('displayLockDuration');

                    if (displayId) displayId.innerText = result.lockDetails.id;
                    if (displayReason) displayReason.innerText = result.lockDetails.reason;
                    if (displayStart) displayStart.innerText = result.lockDetails.startTime;
                    if (displayDuration) displayDuration.innerText = result.lockDetails.duration;
                    
                    const lockModalEl = document.getElementById('lockAccountModal');
                    if (lockModalEl) {
                        const lockModal = new bootstrap.Modal(lockModalEl);
                        lockModal.show();
                    }
                }
            }
        }, 3000);
    };
}); // Kết thúc DOMContentLoaded chuẩn xác
