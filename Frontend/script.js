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

// Add this line at the top of your script.js if it's not already there
const API_URL = "http://localhost:5000/api";

/* =========================================
   2. USER REGISTRATION LOGIC (Backend Integrated)
   ========================================= */
async function handleRegister(event) {
    event.preventDefault(); 

    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const pass = document.getElementById('reg-pass').value;

    try {
        // Send registration data to the backend API
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: name, email: email, password: pass }) // Sending JSON to the server
        });

        const data = await response.json();

        if (response.ok) {
            alert("Registration Successful! Redirecting to Login...");
            window.location.href = 'login.html';
        } else {
            // Handle errors (like email already exists) sent from the server
            alert(data.error);
        }
    } catch (error) {
        // Handle network errors (if the server is not running)
        alert("Server connection failed. Please ensure the backend server is running.");
    }
}

/* =========================================
   3. USER LOGIN LOGIC (Backend Integrated)
   ========================================= */
async function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('login-email').value;
    const pass = document.getElementById('login-pass').value;

    try {
        // Send login credentials to the backend API
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email, password: pass })
        });

        const data = await response.json();

        if (response.ok) {
            // Login Success: Store status and name in localStorage for frontend UI only
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('currentUserName', data.name); 
            
            alert("Login Successful! Welcome " + data.name);
            window.location.href = 'index.html'; // Redirect to Home after login
        } else {
            // Handle login failure message from the server
            alert(data.error);
        }
    } catch (error) {
        alert("Server connection failed. Please ensure the backend server is running.");
    }
}
/* =========================================
   4. ENROLL LOGIC
   ========================================= */
function handleEnroll(courseId) {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
        localStorage.setItem('selectedCourse', courseId);
        window.location.href = 'course_details.html';
    } else {
        alert("You must Register or Login first to enroll!");
        window.location.href = 'register.html';
    }
}

/* =========================================
   5. NAVBAR UPDATE LOGIC (Updated for All Pages)
   ========================================= */
// We use 'DOMContentLoaded' so this runs on EVERY page automatically
document.addEventListener('DOMContentLoaded', function() {
    const userName = localStorage.getItem('currentUserName');
    const isLoggedIn = localStorage.getItem('isLoggedIn');

    // Only run this if user is logged in
    if (isLoggedIn === 'true' && userName) {
        
        // Find links by their HREF attribute
        const loginLink = document.querySelector('a[href="login.html"]');
        const registerLink = document.querySelector('a[href="register.html"]');

        // Update Login Link to show Name
        if (loginLink) {
            loginLink.innerText = "Welcome, " + userName.split(" ")[0]; // Shows first name only
            loginLink.href = "#"; 
            loginLink.style.color = "#38bdf8"; // Electric Blue
            loginLink.style.fontWeight = "600";
            loginLink.style.cursor = "default";
        }

        // Update Register Link to become Logout
        if (registerLink) {
            registerLink.innerText = "Logout";
            registerLink.href = "#";
            registerLink.style.color = "#ff6b6b"; // Red
            
            registerLink.addEventListener('click', function(e) {
                e.preventDefault();
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('currentUserName');
                alert("Logged Out Successfully");
                window.location.reload(); // Reloads current page to reset navbar
            });
        }
    }
});