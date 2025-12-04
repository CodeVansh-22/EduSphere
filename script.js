/* =========================================
   1. COURSE DATABASE
   ========================================= */
const courseData = {
    "web-dev": {    title: "Fundamentals Of Web Development", 
                    price: "₹4,999", 
                    duration: "3 Months", 
                    desc: "Master HTML, CSS, JS." 
                },
    "data-science": {   title: "Data Science Mastery", 
                        price: "₹6,999", 
                        duration: "6 Months", 
                        desc: "Python, ML, and Data." 
                    },
    "graphic-design": {     title: "Graphics Design",
                            price: "₹3,499", 
                            duration: "2 Months", 
                            desc: "Photoshop, Illustrator." 
                        },
    "app-dev": {    title: "App Development", 
                    price: "₹5,999", 
                    duration: "4 Months", 
                    desc: "Flutter for Android & iOS." 
                },
    "digital-marketing": {  title: "Digital Marketing",
                            price: "₹2,999", 
                            duration: "2 Months", 
                            desc: "SEO, Ads, and Social Media." 
                        },
    "soft-skills": {    title: "Soft Skills", 
                        price: "₹1,499", 
                        duration: "1 Month", 
                        desc: "Communication & Confidence." 
                    },
    "gen-ai": {     title: "Generative AI", 
                    price: "₹7,999", 
                    duration: "3 Months", 
                    desc: "LLMs and Prompt Engineering." 
                },
    "ms-office": {  title: "MS-Office", 
                    price: "₹999", 
                    duration: "1 Month", 
                    desc: "Excel, Word, PowerPoint." 
                }
};

/* =========================================
2. USER REGISTRATION LOGIC
   ========================================= */
function handleRegister(event) {
    event.preventDefault(); // Stop form from refreshing

    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const pass = document.getElementById('reg-pass').value;

    // Create a User Object
    const user = { name: name, email: email, pass: pass };

    // Get existing users or create empty list
    let users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Check if email already exists
    if (users.some(u => u.email === email)) {
        alert("Email already registered! Please Login.");
        return;
    }

    // Add new user and save
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));

    alert("Registration Successful! Redirecting to Login...");
    window.location.href = 'login.html';
}

/* =========================================
   3. USER LOGIN LOGIC
   ========================================= */
function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('login-email').value;
    const pass = document.getElementById('login-pass').value;

    // Get users from storage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Find if user exists
    const validUser = users.find(u => u.email === email && u.pass === pass);

    if (validUser) {
        // LOGIN SUCCESS
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUserName', validUser.name); // Save Name
        
        alert("Login Successful! Welcome " + validUser.name);
        window.location.href = 'Course.html';
    } else {
        // LOGIN FAILED
        alert("Invalid Email or Password. Please try again.");
    }
}

/* =========================================
   4. ENROLL LOGIC (From previous steps)
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
   5. WELCOME MESSAGE (Runs on Page Load)
   ========================================= */
window.onload = function() {
    const userName = localStorage.getItem('currentUserName');
    const isLoggedIn = localStorage.getItem('isLoggedIn');

    if (isLoggedIn === 'true' && userName) {
        // Find the Login and Register buttons in the Navbar
        // Note: This looks for links with specific text or hrefs
        const loginLink = document.querySelector('a[href="login.html"]');
        const registerLink = document.querySelector('a[href="register.html"]');

        if (loginLink) {
            loginLink.innerText = "Welcome, " + userName;
            loginLink.href = "#"; // Disable the link
            loginLink.style.color = "#64ffda"; // Change color to highlight
            loginLink.style.fontWeight = "bold";
        }

        if (registerLink) {
            registerLink.innerText = "Logout";
            registerLink.href = "#";
            registerLink.style.color = "#ff6b6b"; // Red color for logout
            
            // Add Logout Functionality
            registerLink.onclick = function() {
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('currentUserName');
                alert("Logged Out Successfully");
                window.location.href = 'index.html';
            };
        }
    }
};
/* =========================================
   6. ADMIN: DOWNLOAD DATABASE TO JSON FILE
   ========================================= */
function downloadUserData() {
    // 1. Get data from Local Storage
    const usersData = localStorage.getItem('users');

    if (!usersData) {
        alert("No registered users found in database.");
        return;
    }

    // 2. Make it look pretty (Format with indentation)
    const formattedJson = JSON.stringify(JSON.parse(usersData), null, 4);

    // 3. Create a downloadable file
    const blob = new Blob([formattedJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    // 4. Create a fake link and click it
    const a = document.createElement('a');
    a.href = url;
    a.download = "database_users.json"; // Name of the file
    document.body.appendChild(a);
    a.click();
    
    // 5. Cleanup
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}