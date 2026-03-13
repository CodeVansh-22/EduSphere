from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from pymongo import MongoClient
import razorpay
import datetime
import os
import jwt
from functools import wraps
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__, static_url_path='', static_folder='../Frontend')
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Configuration from Environment Variables
MONGO_URI = os.getenv("MONGO_URI")
RAZORPAY_KEY_ID = os.getenv("RAZORPAY_KEY_ID")
RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET")
PORT = int(os.getenv("PORT", 5000))
SECRET_KEY = os.getenv("SECRET_KEY", "your_secret_key_here") # Fallback for local dev
SECRET_KEY = os.getenv("SECRET_KEY", "your_secret_key_here") # Fallback for local dev

# MongoDB Connection
client = MongoClient(MONGO_URI)
db = client.get_database("edusphere")

users_col = db.users
enrollments_col = db.enrollments
payments_col = db.paymentdetails
courses_col = db.coursedetails

# Razorpay Config
razorpay_client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))

# -------------------------------------------
# JWT Decorator
# -------------------------------------------
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        try:
            # Token usually comes as "Bearer <token>"
            if token.startswith("Bearer "):
                token = token.split(" ")[1]
            data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            current_user = users_col.find_one({"email": data['email']})
            if not current_user:
                return jsonify({'message': 'User not found!'}), 401
        except Exception as e:
            return jsonify({'message': 'Token is invalid!', 'error': str(e)}), 401
        return f(current_user, *args, **kwargs)
    return decorated

# -------------------------------------------
# Frontend Routes (Serving HTML)
# -------------------------------------------
@app.route("/")
def health_check_root():
    return "EduSphere Backend is Online", 200

@app.route("/api/health")
def health_check_api():
    return jsonify({"status": "running", "message": "EduSphere Backend (Flask) is Operating ✔"}), 200

@app.route("/home")
def home():
    return send_from_directory(app.static_folder, 'index.html')

@app.route("/api/register", methods=["POST"])
def api_register():
    try:
        data = request.json
        if users_col.find_one({"email": data["email"]}):
            return jsonify({"error": "Email already exists"}), 400
        
        users_col.insert_one(data)
        return jsonify({"message": "User Registered Successfully!"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
@app.route("/about")
def about():
    return send_from_directory(app.static_folder, 'About.html')

@app.route("/courses_page")
def courses_page():
    return send_from_directory(app.static_folder, 'Course.html')

@app.route("/contact")
def contact():
    return send_from_directory(app.static_folder, 'Contact.html')

@app.route("/payment_page")
def payment_page():
    return send_from_directory(app.static_folder, 'payment.html')

@app.route("/dashboard_page")
def dashboard_page():
    return send_from_directory(app.static_folder, 'dashboard.html')

@app.route("/login_page")
def login_page():
    return send_from_directory(app.static_folder, 'login.html')

@app.route("/register_page")
def register_page():
    return send_from_directory(app.static_folder, 'register.html')

@app.route("/api/login", methods=["POST"])
def api_login():
    data = request.json
    user = users_col.find_one({"email": data["email"], "password": data["password"]})
    
    if not user:
        return jsonify({"error": "Invalid Credentials"}), 401
    
    # Generate JWT Token
    token = jwt.encode({
        'email': user['email'],
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
    }, SECRET_KEY, algorithm="HS256")
    
    return jsonify({
        "message": "Login Success", 
        "token": token,
        "name": user.get("name"), 
        "email": user.get("email")
    }), 200

@app.route("/api/enroll", methods=["POST"])
@token_required
def api_enroll(current_user):
    try:
        data = request.json
        user_email = current_user["email"]
        course_id = data["courseId"]
        
        # Check if already enrolled
        if enrollments_col.find_one({"userEmail": user_email, "courseId": course_id}):
            return jsonify({"error": "Already enrolled in this course"}), 400
        
        data["userEmail"] = user_email # Ensure correct email from token
        data["enrolledAt"] = datetime.datetime.utcnow()
        enrollments_col.insert_one(data)
        return jsonify({"message": "Enrolled Successfully!"}), 200
    except Exception as e:
        return jsonify({"error": "Enrollment failed"}), 500

@app.route("/api/user-enrollments", methods=["GET"])
@token_required
def api_get_user_enrollments(current_user):
    try:
        email = current_user["email"]
        enrollments = list(enrollments_col.find({"userEmail": email}, {"_id": 0}))
        return jsonify(enrollments), 200
    except Exception as e:
        return jsonify({"error": "Failed to fetch enrollments"}), 500

@app.route("/api/save-payment", methods=["POST"])
@token_required
def api_save_payment(current_user):
    try:
        data = request.json
        data["userEmail"] = current_user["email"] # Ensure correct email from token
        data["createdAt"] = datetime.datetime.utcnow()
        if "status" not in data:
            data["status"] = "captured"
            
        payments_col.insert_one(data)
        return jsonify({"message": "Payment Recorded Successfully!"}), 200
    except Exception as e:
        return jsonify({"error": "Failed to record payment"}), 500

@app.route("/api/courses", methods=["GET"])
def api_get_courses():
    try:
        courses = list(courses_col.find({}, {"_id": 0}))
        return jsonify(courses), 200
    except Exception as e:
        return jsonify({"error": "Failed to fetch courses"}), 500

@app.route("/api/create-order", methods=["POST"])
@token_required
def api_create_order(current_user):
    try:
        amount = int(request.json["amount"]) * 100
        
        order_data = {
            "amount": amount,
            "currency": "INR",
            "receipt": f"edusphere_{int(datetime.datetime.now().timestamp())}"
        }
        
        order = razorpay_client.order.create(data=order_data)
        return jsonify(order), 200
    except Exception as e:
        print(f"Razorpay Error: {e}")
        return jsonify({"error": "Order creation failed"}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=PORT, debug=True)
