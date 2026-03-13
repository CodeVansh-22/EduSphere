# 🎓 EduSphere
### A Complete Online Learning Platform

EduSphere is a full-stack online learning platform where users can explore courses and securely purchase them using Razorpay integration. This project demonstrates frontend UI development, backend logic, and payment gateway integration in a real-world style learning platform.

---

## 🌐 Live Demo

🔗 **Live Website**: [https://codevansh-22.github.io/EduSphere](https://codevansh-22.github.io/EduSphere)  
🎥 **Working Demo Video**: [https://go.screenpal.com/watch/cOeIjCnZCgi](https://go.screenpal.com/watch/cOeIjCnZCgi)

---

## 🚀 Features

✅ **Modern Responsive Landing Page**  
✅ **Course Listing Interface**  
✅ **Razorpay Payment Gateway Integration**  
✅ **Smooth UI Interactions using JavaScript**  
✅ **Clean UI/UX Design**  
✅ **Fast Loading Frontend Pages**  
✅ **User Authentication System** (Backend supported)

---

## 🛠 Tech Stack

### Frontend
- **HTML5 & CSS3**: Modern UI structure and styling.
- **Vanilla JavaScript**: Dynamic interactions and API consumption.

### Backend
- **Node.js & Express.js**: Server-side framework.
- **MongoDB & Mongoose**: Database management.
- **Razorpay API**: Payment gateway integration.

### Tools
- **Git & GitHub** | **VS Code**

---

## 📂 Project Structure

```text
EduSphere
│
├── Backend/          # Node.js server, API logic, and Database configs
│   └── server.js     # Entry point
│
├── Frontend/         # Client-side application
│   ├── index.html    # Home Page
│   ├── courses.html  # Courses Page
│   ├── payment.html  # Payment Page
│   ├── css/          # Stylesheets (style.css, responsive.css)
│   ├── js/           # Scripts (script.js, payment.js)
│   └── assets/       # Images and Icons
│
└── README.md
```

---

## ⚙️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/codevansh-22/EduSphere.git
cd EduSphere
```

### 2. Backend Setup
The backend handles authentication and payments.
1. Navigate to the Backend directory:
   ```bash
   cd Backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. **Configuration**: Set your MongoDB URI and Razorpay credentials in `server.js` or via `.env`.
4. Start the server:
   ```bash
   npm start
   ```
   *Runs on `http://localhost:5000` by default.*

### 3. Frontend Setup
The frontend is a static web application.
1. Navigate to the Frontend directory:
   ```bash
   cd Frontend
   ```
2. Open `index.html` in your browser (or use Live Server).
   *Update `API_URL` in `Frontend/js/script.js` to `http://localhost:5000/api` for local testing.*

---

## 💳 Payment Workflow

1️⃣ **User selects a course**  
2️⃣ **Payment gateway opens** (Razorpay)  
3️⃣ **User completes secure payment**  
4️⃣ **Payment confirmation is returned**

---

## 🎯 Future Improvements

• Student Dashboard & Course Progress Tracking  
• Instructor Panel & Video Streaming Integration  
• Advanced Database for Course Management  

---

## 👨‍💻 Author

**Vansh**  
BCA Student | Aspiring Full Stack Developer  
🔗 [GitHub](https://github.com/codevansh-22)

---

## 📄 License

This project is built for learning and portfolio purposes.
