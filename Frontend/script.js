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
            localStorage.setItem("userRole", data.role || "student");

            // --- CRITICAL FIX ADDED HERE ---
            localStorage.setItem("isLoggedIn", "true");

            alert("Login Successful!");
            // Redirect based on role
            if (data.role === 'admin') {
                window.location.href = "admin_dashboard.html";
            } else {
                window.location.href = "index.html";
            }
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
   5. DYNAMIC UI UPDATES
   ========================================= */
document.addEventListener('DOMContentLoaded', function () {
    updateUI();
});

function updateUI() {
    const userName = localStorage.getItem('currentUserName');
    const isLoggedIn = localStorage.getItem('isLoggedIn') === "true";

    // 1. Update Navigation Bar
    const navRight = document.querySelector('.nav-right');
    const bottomNav = document.querySelector('.bottom-nav');

    if (navRight) {
        const role = localStorage.getItem('userRole');
        // Desktop Top Navbar
        let navHTML = `
            <a class="opt ${isPageActive('index.html') || window.location.pathname === '/' ? 'active' : ''}" href="index.html">Home</a>
            <a class="opt ${isPageActive('Course.html') ? 'active' : ''}" href="Course.html">Courses</a>
            <a class="opt ${isPageActive('About.html') ? 'active' : ''}" href="About.html">About</a>
            <a class="opt ${isPageActive('Contact.html') ? 'active' : ''}" href="Contact.html">Contact</a>
        `;

        if (isLoggedIn) {
            if (role === 'admin') {
                navHTML += `
                    <a class="opt ${isPageActive('admin_dashboard.html') ? 'active' : ''}" href="admin_dashboard.html" style="color: var(--primary);">Admin Dashboard</a>
                `;
            } else {
                navHTML += `
                    <a class="opt ${isPageActive('dashboard.html') ? 'active' : ''}" href="dashboard.html" style="color: var(--primary);">Dashboard</a>
                `;
            }
            navHTML += `
                <a href="#" class="opt logout-link" onclick="handleLogout(event)" style="color: #ff4757;">Logout</a>
            `;
        } else {
            navHTML += `
                <a class="opt ${isPageActive('login.html') ? 'active' : ''}" href="login.html">Login</a>
                <a class="opt ${isPageActive('register.html') ? 'active' : ''}" href="register.html">Register</a>
            `;
        }
        navRight.innerHTML = navHTML;
    }

    // 2. Update Bottom Nav (Mobile Only)
    if (bottomNav) {
        const role = localStorage.getItem('userRole');
        let bottomHTML = `
            <a href="index.html" class="bottom-nav-item ${isPageActive('index.html') || window.location.pathname === '/' ? 'active' : ''}">
                <i class="fa fa-home"></i><span>Home</span>
            </a>
            <a href="Course.html" class="bottom-nav-item ${isPageActive('Course.html') ? 'active' : ''}">
                <i class="fa fa-book"></i><span>Courses</span>
            </a>
        `;

        if (isLoggedIn) {
            if (role === 'admin') {
                bottomHTML += `
                    <a href="admin_dashboard.html" class="bottom-nav-item ${isPageActive('admin_dashboard.html') ? 'active' : ''}">
                        <i class="fa fa-cog"></i><span>Admin</span>
                    </a>
                `;
            } else {
                bottomHTML += `
                    <a href="dashboard.html" class="bottom-nav-item ${isPageActive('dashboard.html') ? 'active' : ''}">
                        <i class="fa fa-th-large"></i><span>Dashboard</span>
                    </a>
                `;
            }
            bottomHTML += `
                <a href="#" class="bottom-nav-item logout-link" onclick="handleLogout(event)">
                    <i class="fa fa-sign-out"></i><span>Logout</span>
                </a>
            `;
        } else {
            bottomHTML += `
                <a href="login.html" class="bottom-nav-item ${isPageActive('login.html') ? 'active' : ''}">
                    <i class="fa fa-sign-in"></i><span>Login</span>
                </a>
                <a href="register.html" class="bottom-nav-item ${isPageActive('register.html') ? 'active' : ''}">
                    <i class="fa fa-user-plus"></i><span>Join</span>
                </a>
            `;
        }
        bottomNav.innerHTML = bottomHTML;
    }

    // 3. Welcome Message on Index.html
    const welcomeContainer = document.getElementById('welcome-user');
    if (welcomeContainer) {
        if (isLoggedIn && userName) {
            welcomeContainer.innerHTML = `Welcome back, <span class="highlight">${userName.split(' ')[0]}</span>! 👋`;
            welcomeContainer.style.display = 'block';
        } else {
            welcomeContainer.style.display = 'none';
        }
    }
}

// Helper to check if a page is currently active
function isPageActive(filename) {
    return window.location.pathname.toLowerCase().includes(filename.toLowerCase());
}

function handleLogout(event) {
    if (event) event.preventDefault();
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUserName');
    localStorage.removeItem('currentUserEmail');
    localStorage.removeItem('userRole');
    alert("Logged Out Successfully");
    window.location.href = "index.html";
}

/* =========================================
   7. LOAD DYNAMIC COURSES
   ========================================= */
async function loadCourses() {
    const container = document.getElementById('course-list');
    if (!container) return;

    try {
        const response = await fetch(`${API_URL}/courses`);
        const courses = await response.json();

        if (courses.length === 0) {
            container.innerHTML = "<p style='grid-column: 1/-1; text-align: center;'>No courses available at the moment.</p>";
            return;
        }

        container.innerHTML = courses.map(course => `
            <div class="course-card">
                <img src="${course.image}" alt="${course.title}" onerror="this.src='images/Course Card1.jpg'">
                <h3>${course.title}</h3>
                <p>${course.desc}</p>
                <button onclick="handleEnroll('${course.id}')">Enroll Now</button>
            </div>
        `).join('');
    } catch (error) {
        console.error("Error loading courses:", error);
        container.innerHTML = "<p style='grid-column: 1/-1; text-align: center; color: #ff4757;'>Failed to load courses. Please try again later.</p>";
    }
}

// Ensure courses load on Course.html
if (isPageActive('Course.html')) {
    document.addEventListener('DOMContentLoaded', loadCourses);
}

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