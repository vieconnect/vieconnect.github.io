(function() {
    const currentUser = localStorage.getItem('currentUser');
    const path = window.location.pathname;
    
    // Kiểm tra xem trang hiện tại có phải là trang đăng nhập/trang chủ công khai không
    const isLoginPage = path.includes('login.html') || path.endsWith('index.html') || path === '/';

    if (!currentUser && !isLoginPage) {
        // Nếu chưa đăng nhập mà vào trang con -> Đuổi về trang login ngay
        window.location.replace('login.html');
    }
})();

// 1. Cấu hình Firebase (Thay thông tin của bạn vào đây)
const firebaseConfig = {
     apiKey: "AIzaSyDDIZ8aq4LVY2NOwawTYl_GnDPjpPoK_JQ",
  authDomain: "vieconnect-8588b.firebaseapp.com",
  databaseURL: "https://vieconnect-8588b-default-rtdb.firebaseio.com",
  projectId: "vieconnect-8588b",
  storageBucket: "vieconnect-8588b.firebasestorage.app",
  messagingSenderId: "819605731952",
  appId: "1:819605731952:web:a599047a644c224996d2b5",
  measurementId: "G-5ELVTH7908"
};

// Khởi tạo Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const database = firebase.database();

// --- LOGIC BẢO MẬT & ĐIỀU HƯỚNG ---

function checkLoginState() {
    const currentUser = localStorage.getItem('currentUser');
    const path = window.location.pathname;
    
    // Xác định các trang không cần đăng nhập (login, index)
    const isLoginPage = path.includes('login.html') || path.endsWith('/') || path.includes('index.html');

    if (!currentUser) {
        // Nếu CHƯA đăng nhập mà cố tình vào trang bên trong (dashboard.html,...)
        if (!isLoginPage) {
            window.location.replace('login.html');
        }
    } else {
        // Nếu ĐÃ đăng nhập mà lại quay lại trang login -> Đẩy thẳng vào dashboard
        if (isLoginPage && !path.includes('index.html')) {
            window.location.replace('dashboard.html');
        }
    }
}

// Gọi kiểm tra ngay lập tức khi file JS này được tải
checkLoginState();

// --- CÁC HÀM XỬ LÝ CHÍNH ---

async function login(username, password) {
    localStorage.removeItem('currentUser'); // Xóa rác cũ
    
    try {
        const snapshot = await database.ref('users/' + username).once('value');
        const user = snapshot.val();

        // Kiểm tra mật khẩu (Ép kiểu về String để tránh lỗi Number/String trên Firebase)
        if (!user || String(user.password) !== String(password)) {
            return { success: false, reason: 'WRONG_AUTH' };
        }

        if (user.isLocked) {
            return { success: false, reason: 'LOCKED', lockDetails: user.lockInfo };
        }

        if (user.isDeleted) {
            return { success: false, reason: 'DELETED' };
        }

        // Lưu thông tin vào localStorage để duy trì trạng thái đăng nhập
        const userData = {
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
        };
        localStorage.setItem('currentUser', JSON.stringify(userData));

        return { success: true };
    } catch (error) {
        console.error("Firebase Error:", error);
        return { success: false, reason: 'ERROR' };
    }
}

function logout() {
    localStorage.removeItem('currentUser');
    // Dùng replace để người dùng không bấm "Back" lại trang cũ được
    window.location.replace('login.html');
}

// --- XỬ LÝ GIAO DIỆN ---

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

    loginForm.onsubmit = async (e) => { // Thêm async ở đây
        e.preventDefault();

        const captchaResponse = grecaptcha.getResponse();
        if (captchaResponse.length === 0) {
            showToast("Bạn chưa xác nhận reCAPTCHA!");
            return;
        }
        
        const userVal = usernameInput.value.trim();
        const passVal = passwordInput.value.trim();

        if (!userVal || !passVal) {
            showToast("Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        // Hiển thị loading
        if (loginBtn) loginBtn.disabled = true;
        if (loadingOverlay) loadingOverlay.style.display = 'block';
        if (loadingToast) loadingToast.style.display = 'flex';

        // Gọi hàm login (xử lý với Firebase)
        const result = await login(userVal, passVal); 

        // Ẩn loading
        if (loadingOverlay) loadingOverlay.style.display = 'none';
        if (loadingToast) loadingToast.style.display = 'none';

        if (result.success) {
            window.location.replace('dashboard.html'); 
        } else {
            if (loginBtn) loginBtn.disabled = false;
            
            if (result.reason === 'WRONG_AUTH') {
                showToast("Tài khoản hoặc Mật khẩu không đúng!");
            } else if (result.reason === 'DELETED') {
                showToast("Tài khoản này đã bị xóa theo chính sách hoạt động của VieConnect. Truy cập https://vieconnect.github.io/dieu-khoan-su-dung để biết thêm thông tin về chính sách");
            } else if (result.reason === 'LOCKED') {
                // Đổ dữ liệu vào Modal khóa (giống code cũ của bạn)
                document.getElementById('displayLockID').innerText = result.lockDetails.id;
                document.getElementById('displayLockReason').innerText = result.lockDetails.reason;
                document.getElementById('displayLockStart').innerText = result.lockDetails.startTime;
                document.getElementById('displayLockDuration').innerText = result.lockDetails.duration;
                new bootstrap.Modal(document.getElementById('lockAccountModal')).show();
            } else {
                showToast("Có lỗi xảy ra, vui lòng thử lại sau.");
            }
        }
    };
});
