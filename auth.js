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
    const currentPage = window.location.pathname.split('/').pop(); 
    
    // Chỉ chuyển hướng nếu không phải đang ở trang login
    if (!currentUser && currentPage !== 'login.html' && currentPage !== '') {
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
checkLoginState();

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const alertPlaceholder = document.getElementById('alertPlaceholder');
    const loadingOverlay = document.getElementById('loadingOverlay'); // Lấy element loading

    const showAlert = (message, type) => {
        if (!alertPlaceholder) return;
        alertPlaceholder.innerHTML = '';
        const wrapper = document.createElement('div');
        wrapper.innerHTML = [
            `<div class="alert alert-outline-danger alert-dismissible fade show" role="alert" id="activeAlert">`,
            `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-exclamation-triangle-fill" viewBox="0 0 16 16">
  <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
</svg>   <div>${message}</div>`,
            '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
            '</div>'
        ].join('');
        alertPlaceholder.append(wrapper);
    };

    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // 1. Hiển thị hiệu ứng loading
            if (loadingOverlay) loadingOverlay.style.display = 'flex';

            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            // 2. Chờ 1.5 giây rồi mới kiểm tra login
            setTimeout(() => {
                const result = login(username, password);

                // Tắt hiệu ứng loading sau khi chờ xong
                if (loadingOverlay) loadingOverlay.style.display = 'none';

                if (result.success) {
                    window.location.href = 'dashboard.html';
                } else {
                    if (result.reason === 'LOCKED') {
                        if (alertPlaceholder) alertPlaceholder.innerHTML = '';
                        
                        document.getElementById('displayLockID').textContent = result.lockDetails.id;
                        document.getElementById('displayLockReason').textContent = result.lockDetails.reason;
                        document.getElementById('displayLockStart').textContent = result.lockDetails.startTime;
                        document.getElementById('displayLockDuration').textContent = result.lockDetails.duration;

                        const lockModalElement = document.getElementById('lockAccountModal');
                        if (lockModalElement) {
                            const lockModal = new bootstrap.Modal(lockModalElement);
                            lockModal.show();
                        }
                    } else {
                        showAlert('Sai tên đăng nhập hoặc mật khẩu. Vui lòng kiểm tra lại!', 'danger');
                    }
                }
            }, 1500); // Thời gian chờ 1500ms = 1.5 giây
        });
    }
    
    updateDashboardUI();
});
