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
- **Python & Flask**: Robust server-side framework.
- **PyMongo**: MongoDB driver for Python.
- **Razorpay API**: Payment gateway integration.
 
### Tools
- **Git & GitHub** | **VS Code** | **Python Venv**
 
---
 
## 📂 Project Structure
 
```text
EduSphere
│
├── Backend/           # Python Flask backend
│   ├── app.py         # Main API & Routing logic
│   ├── requirements.txt # Python dependencies
│   ├── .env           # Sensitive keys (not pushed to Git)
│   └── venv/          # Virtual environment (local only)
│
├── Frontend/         # Client-side application
│   ├── index.html     # Landing Page
│   ├── dashboard.html # User Dashboard (Responsive)
│   ├── css_files/     # Styles (style.css)
│   ├── script.js      # Frontend Logic & API calls
│   └── images/       # Assets
│
├── render.yaml       # Deployment configuration for Render
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
1. **Navigate to Backend**:
   ```bash
   cd Backend
   ```
2. **Create Virtual Environment**:
   ```bash
   python -m venv venv
   .\venv\Scripts\activate  # Windows
   source venv/bin/activate # Linux/Mac
   ```
3. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```
4. **Environment Variables**: Create a `.env` file in the `Backend/` folder:
   ```text
   MONGO_URI=your_mongodb_uri
   RAZORPAY_KEY_ID=your_key_id
   RAZORPAY_KEY_SECRET=your_key_secret
   PORT=5000
   ```
5. **Start the Server**:
   ```bash
   python app.py
   ```
 
### 3. Frontend Setup
The frontend can be served via Flask or opened as a static site.
1. Open `Frontend/index.html` in your browser.
2. Ensure the `API_URL` in `Frontend/script.js` points to `http://localhost:5000/api` for local tests.
 
---
 
## 💳 Payment Workflow
 
1️⃣ **User selects a course**  
2️⃣ **Payment gateway opens** (Razorpay)  
3️⃣ **User completes secure payment**  
4️⃣ **User is enrolled and redirected to Dashboard**
 
---
 
## 🎯 Core Accomplishments
 
• **Responsive Dashboard**: Mobile-friendly user portal for tracking courses.  
• **Secure Keys**: Centralized environment variable management.  
• **Auto Deployment**: Integrated with Render via `render.yaml`.

---

## 👨‍💻 Author

**Vansh**  
BCA Student | Aspiring Full Stack Developer  
🔗 [GitHub](https://github.com/codevansh-22)

---

## 📄 License

This project is built for learning and portfolio purposes.
