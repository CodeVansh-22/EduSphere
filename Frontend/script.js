/* =========================================
   COURSE DATABASE
========================================= */

const courseData = {
    "web-dev": { title: "Fundamentals Of Web Development", price: 4999, duration: "3 Months" },
    "data-science": { title: "Data Science Mastery", price: 6999, duration: "6 Months" },
    "graphic-design": { title: "Graphics Design", price: 3499, duration: "2 Months" },
    "app-dev": { title: "App Development", price: 5999, duration: "4 Months" },
    "digital-marketing": { title: "Digital Marketing", price: 2999, duration: "2 Months" },
    "soft-skills": { title: "Soft Skills", price: 1499, duration: "1 Month" },
    "gen-ai": { title: "Generative AI", price: 7999, duration: "3 Months" },
    "ms-office": { title: "MS Office", price: 999, duration: "1 Month" }
};


/* =========================================
   API URL
========================================= */

const API_URL =
    window.location.hostname === "localhost"
        ? "http://localhost:5000/api"
        : "https://edusphere-backend-w1w5.onrender.com/api";


/* =========================================
   REGISTER
========================================= */

async function handleRegister(event) {

    event.preventDefault()

    const name = document.getElementById("reg-name").value
    const email = document.getElementById("reg-email").value
    const pass = document.getElementById("reg-pass").value

    try {

        const res = await fetch(`${API_URL}/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name, email, password: pass
            })
        })

        const data = await res.json()

        if (res.ok) {

            alert("Registration successful")
            window.location = "login.html"

        } else {

            alert(data.error)

        }

    } catch (err) {

        alert("Backend connection failed")

    }

}


/* =========================================
   LOGIN
========================================= */

async function handleLogin(event) {

    event.preventDefault()

    const email = document.getElementById("login-email").value
    const pass = document.getElementById("login-pass").value

    try {

        const res = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email, password: pass
            })
        })

        const data = await res.json()

        if (res.ok) {

            localStorage.setItem("authToken", data.token)
            localStorage.setItem("currentUserName", data.name)
            localStorage.setItem("currentUserEmail", data.email)
            localStorage.setItem("isLoggedIn", "true")

            window.location = "index.html"

        } else {

            alert(data.error)

        }

    } catch (err) {

        alert("Server not reachable")

    }

}