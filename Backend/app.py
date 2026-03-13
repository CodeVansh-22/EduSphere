from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import razorpay
import datetime
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": [
    "https://codevansh-22.github.io",
    "http://localhost:5500",
    "http://127.0.0.1:5500",
    "http://localhost:5000"
]}})

# MongoDB Connection
MONGO_URI = "mongodb+srv://vanshchauhan_db_user:vansh2206@cluster0.amelidd.mongodb.net/edusphere"
client = MongoClient(MONGO_URI)
db = client.get_database("edusphere")

users_col = db.users
enrollments_col = db.enrollments
payments_col = db.payments
courses_col = db.courses

# Razorpay Config
RAZORPAY_KEY_ID = "rzp_test_RnqzlJgS6MFe2M"
RAZORPAY_KEY_SECRET = "12nYyjrzt1QQ4nYtXUUPE8UY"
razorpay_client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))

@app.route("/")
def health_check():
    return "EduSphere Backend (Flask) is Running ✔", 200

# -------------------------------------------
# Register Route
# -------------------------------------------
@app.route("/api/register", methods=["POST"])
def register():
    try:
        data = request.json
        if users_col.find_one({"email": data["email"]}):
            return jsonify({"error": "Email already exists"}), 400
        
        users_col.insert_one(data)
        return jsonify({"message": "User Registered Successfully!"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# -------------------------------------------
# Login Route
# -------------------------------------------
@app.route("/api/login", methods=["POST"])
def login():
    data = request.json
    user = users_col.find_one({"email": data["email"], "password": data["password"]})
    
    if not user:
        return jsonify({"error": "Invalid Credentials"}), 401
    
    return jsonify({
        "message": "Login Success", 
        "name": user.get("name"), 
        "email": user.get("email")
    }), 200

# -------------------------------------------
# Enrollment Routes
# -------------------------------------------
@app.route("/api/enroll", methods=["POST"])
def enroll():
    try:
        data = request.json
        user_email = data["userEmail"]
        course_id = data["courseId"]
        
        # Check if already enrolled
        if enrollments_col.find_one({"userEmail": user_email, "courseId": course_id}):
            return jsonify({"error": "Already enrolled in this course"}), 400
        
        data["enrolledAt"] = datetime.datetime.utcnow()
        enrollments_col.insert_one(data)
        return jsonify({"message": "Enrolled Successfully!"}), 200
    except Exception as e:
        return jsonify({"error": "Enrollment failed"}), 500

@app.route("/api/user-enrollments", methods=["GET"])
def get_user_enrollments():
    try:
        email = request.args.get("email")
        enrollments = list(enrollments_col.find({"userEmail": email}, {"_id": 0}))
        return jsonify(enrollments), 200
    except Exception as e:
        return jsonify({"error": "Failed to fetch enrollments"}), 500

# -------------------------------------------
# Payment Routes
# -------------------------------------------
@app.route("/api/save-payment", methods=["POST"])
def save_payment():
    try:
        data = request.json
        data["createdAt"] = datetime.datetime.utcnow()
        if "status" not in data:
            data["status"] = "captured"
            
        payments_col.insert_one(data)
        return jsonify({"message": "Payment Recorded Successfully!"}), 200
    except Exception as e:
        return jsonify({"error": "Failed to record payment"}), 500

# -------------------------------------------
# Course Routes
# -------------------------------------------
@app.route("/api/courses", methods=["GET"])
def get_courses():
    try:
        courses = list(courses_col.find({}, {"_id": 0}))
        return jsonify(courses), 200
    except Exception as e:
        return jsonify({"error": "Failed to fetch courses"}), 500

# -------------------------------------------
# Razorpay Order API
# -------------------------------------------
@app.route("/api/create-order", methods=["POST"])
def create_order():
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
    app.run(port=5000, debug=True)
