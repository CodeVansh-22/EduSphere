/* =========================================
   1. COURSE DATABASE
   ========================================= */
const courseData = {
    "web-dev": { title: "Fundamentals Of Web Development", price: "₹4,999", duration: "3 Months", desc: "Master HTML, CSS, JS." },
    "data-science": { title: "Data Science Mastery", price: "₹6,999", duration: "6 Months", desc: "Python, ML, and Data." },
    "graphic-design": { title: "Graphics Design", price: "₹3,499", duration: "2 Months", desc: "Photoshop, Illustrator." },
    "app-dev": { title: "App Development", price: "₹5,999", duration: "4 Months", desc: "Flutter for Android & iOS." },
    "digital-marketing": { title: "Digital Marketing", price: "₹2,999", duration: "2 Months", desc: "SEO, Ads, and Social Media." },
    "soft-skills": { title: "Soft Skills", price: "₹1,499", duration: "1 Month", desc: "Communication & Confidence." },
    "gen-ai": { title: "Generative AI", price: "₹7,999", duration: "3 Months", desc: "LLMs and Prompt Engineering." },
    "ms-office": { title: "MS-Office", price: "₹999", duration: "1 Month", desc: "Excel, Word, PowerPoint." }
};

const API_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:5000/api"
    : "https://edusphere-backend-w1w5.onrender.com/api";

/* =========================================
   2. USER REGISTRATION LOGIC
   ========================================= */
async function handleRegister(event) {
    event.preventDefault();

    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const pass = document.getElementById('reg-pass').value;
    const confirmPass = document.getElementById('reg-confirm').value;

    if (pass !== confirmPass) {
        alert("Passwords do not match!");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: name, email: email, password: pass })
        });

        const data = await response.json();

        if (response.ok) {
            alert("Registration Successful! Redirecting to Login...");
            window.location.href = "login.html";
        } else {
            console.error("Registration Error Data:", data);
            alert(data.error || "Registration failed. Please try again.");
        }
    } catch (error) {
        console.error("Registration Fetch Error:", error);
        alert("Server connection failed. Please ensure the backend server is running.");
    }
}

/* =========================================
   3. USER LOGIN LOGIC
   ========================================= */
async function handleLogin(event) {
    // CRITICAL: Prevents the page from reloading when you click submit
    event.preventDefault();

    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-pass").value.trim();
    const btn = event.target.querySelector('button[type="submit"]');
    const originalText = btn.innerText;

    // UI Feedback
    btn.innerText = "Logging in...";
    btn.disabled = true;

    try {
        const response = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email: email, password: password })
        });

        const data = await response.json();

        if (response.ok) {
            // Save authentication details to browser storage
            localStorage.setItem("authToken", data.token);
            localStorage.setItem("currentUserName", data.name || "User");
            localStorage.setItem("currentUserEmail", data.email);

            // --- CRITICAL FIX ADDED HERE ---
            localStorage.setItem("isLoggedIn", "true");

            alert("Login Successful!");
            // Redirect to home or dashboard
            window.location.href = "index.html";
        } else {
            console.error("Login Error Data:", data);
            alert(data.error || "Invalid Credentials. Please try again.");
        }
    } catch (error) {
        console.error("Login Fetch Error:", error);
        alert("Network error: Could not connect to the server. Make sure the backend is running.");
    } finally {
        // Reset button state
        btn.innerText = originalText;
        btn.disabled = false;
    }
}

/* =========================================
   4. ENROLL LOGIC
   ========================================= */
function handleEnroll(courseId) {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn === "true") {
        localStorage.setItem('selectedCourse', courseId);
        window.location.href = "course_details.html";
    } else {
        alert("You must Register or Login first to enroll!");
        window.location.href = "register.html";
    }
}

/* =========================================
   5. NAVBAR UPDATE LOGIC
   ========================================= */
document.addEventListener('DOMContentLoaded', function () {
    const userName = localStorage.getItem('currentUserName');
    const isLoggedIn = localStorage.getItem('isLoggedIn');

    if (isLoggedIn === "true" && userName) {
        const loginLink = document.querySelector('a[href="login.html"]');
        const registerLink = document.querySelector('a[href="register.html"]');

        // Inject Dashboard Link
        const navRight = document.querySelector('.nav-right');
        if (navRight && !document.querySelector('a[href="dashboard.html"]')) {
            const dashboardLink = document.createElement('a');
            dashboardLink.className = 'opt';
            dashboardLink.href = 'dashboard.html';
            dashboardLink.innerText = 'Dashboard';
            dashboardLink.style.color = "#64ffda";

            // Insert before login/logout
            if (loginLink) {
                navRight.insertBefore(dashboardLink, loginLink);
            } else {
                navRight.appendChild(dashboardLink);
            }
        }

        if (loginLink) {
            loginLink.innerText = "Welcome, " + userName.split(" ")[0];
            loginLink.href = "#";
            loginLink.style.color = "#38bdf8";
            loginLink.style.fontWeight = "600";
            loginLink.style.cursor = "default";
        }

        if (registerLink) {
            registerLink.innerText = "Logout";
            registerLink.href = "#";
            registerLink.style.color = "#ff6b6b";
            registerLink.classList.add('logout-link'); // Added class for CSS

            registerLink.addEventListener('click', function (e) {
                e.preventDefault();
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('authToken'); // Remove JWT
                localStorage.removeItem('currentUserName');
                localStorage.removeItem('currentUserEmail');
                alert("Logged Out Successfully");
                window.location.reload();
            });
        }
    }
});

/* =========================================
   6. PASSWORD TOGGLE LOGIC
   ========================================= */
function togglePasswordVisibility(inputId, iconId) {
    const input = document.getElementById(inputId);
    const icon = document.getElementById(iconId);

    if (input.type === "password") {
        input.type = "text";
        // Swap FontAwesome classes
        icon.classList.remove("fa-eye");
        icon.classList.add("fa-eye-slash");
    } else {
        input.type = "password";
        // Swap FontAwesome classes back
        icon.classList.remove("fa-eye-slash");
        icon.classList.add("fa-eye");
    }
}