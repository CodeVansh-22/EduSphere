from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from pymongo import MongoClient
from dotenv import load_dotenv
import jwt
import razorpay
import datetime
import os
import uuid
from functools import wraps

# Load environment variables
load_dotenv()

app = Flask(__name__, static_url_path='', static_folder='../Frontend')

# Upload folder
UPLOAD_FOLDER = os.path.join(app.static_folder, 'images', 'courses')
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Robust CORS strategy
CORS(app, resources={r"/api/*": {
    "origins": "*",
    "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    "allow_headers": ["Content-Type", "Authorization"]
}}, supports_credentials=True)

# Environment variables
MONGO_URI = os.getenv("MONGO_URI")
RAZORPAY_KEY_ID = os.getenv("RAZORPAY_KEY_ID")
RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET")
PORT = int(os.getenv("PORT", 5000))
SECRET_KEY = os.getenv("SECRET_KEY", "secret")

# MongoDB
client = MongoClient(MONGO_URI)
db = client.get_database("edusphere")

users_col = db.users
enrollments_col = db.enrollments
payments_col = db.paymentdetails
courses_col = db.coursedetails

# Razorpay
razorpay_client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))

# ---------------------------------------
# JWT TOKEN DECORATOR
# ---------------------------------------

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):

        token = request.headers.get("Authorization")

        if not token:
            return jsonify({"message": "Token missing"}), 401

        try:

            if token.startswith("Bearer "):
                token = token.split(" ")[1]

            data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])

            current_user = users_col.find_one({"email": data["email"]})

            if not current_user:
                return jsonify({"message": "User not found"}), 401

        except Exception as e:
            return jsonify({"message": "Token invalid", "error": str(e)}), 401

        return f(current_user, *args, **kwargs)

    return decorated


def admin_required(f):
    @wraps(f)
    def decorated(current_user, *args, **kwargs):

        if current_user.get("role") != "admin":
            return jsonify({"message": "Admin only"}), 403

        return f(current_user, *args, **kwargs)

    return decorated


# ---------------------------------------
# HEALTH CHECK
# ---------------------------------------

@app.route("/")
def health():
    return "EduSphere Backend Running"


@app.route("/api/health")
def api_health():
    return jsonify({"status": "running"})


# ---------------------------------------
# REGISTER
# ---------------------------------------

@app.route("/api/register", methods=["POST"])
def register():

    try:

        data = request.json

        if users_col.find_one({"email": data["email"]}):
            return jsonify({"error": "Email already exists"}), 400

        if "role" not in data:
            data["role"] = "student"

        users_col.insert_one(data)

        return jsonify({"message": "User registered"}), 200

    except Exception as e:

        return jsonify({"error": str(e)}), 400


# ---------------------------------------
# LOGIN
# ---------------------------------------

@app.route("/api/login", methods=["POST"])
def login():

    data = request.json

    user = users_col.find_one({
        "email": data["email"],
        "password": data["password"]
    })

    if not user:
        return jsonify({"error": "Invalid credentials"}), 401

    token = jwt.encode({
        "email": user["email"],
        "role": user.get("role", "student"),
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24)
    }, SECRET_KEY, algorithm="HS256")

    return jsonify({
        "token": token,
        "name": user.get("name", "User"),
        "email": user.get("email"),
        "role": user.get("role", "student")
    })


# ---------------------------------------
# GET COURSES
# ---------------------------------------

@app.route("/api/courses", methods=["GET"])
def get_courses():

    try:

        courses = list(courses_col.find({}, {"_id": 0}))

        return jsonify(courses)

    except:
        return jsonify({"error": "Failed to load courses"}), 500


# ---------------------------------------
# ADMIN UPLOAD COURSE
# ---------------------------------------

@app.route("/api/admin/upload-course", methods=["POST"])
@token_required
@admin_required
def upload_course(current_user):

    try:

        title = request.form.get("title")
        price = request.form.get("price")
        duration = request.form.get("duration")
        description = request.form.get("description")
        course_id = request.form.get("id")
        image_url_input = request.form.get("imageUrl")

        if not all([title, price, duration, description, course_id]):
            return jsonify({"error": "Missing required fields"}), 400

        image_url = image_url_input or "images/Course Card1.jpg"

        # image upload
        if "image" in request.files:

            file = request.files["image"]

            if file.filename != "":

                filename = f"{course_id}_{file.filename}"

                file.save(os.path.join(app.config["UPLOAD_FOLDER"], filename))

                image_url = f"images/courses/{filename}"

        # unique courseId
        course_data = {

            "courseId": str(uuid.uuid4()),

            "id": course_id,
            "title": title,
            "price": price,
            "duration": duration,
            "desc": description,
            "image": image_url,
            "createdAt": datetime.datetime.utcnow()

        }

        courses_col.update_one(
            {"id": course_id},
            {"$set": course_data},
            upsert=True
        )

        return jsonify({"message": "Course uploaded"}), 200

    except Exception as e:
        import traceback
        print("UPLOAD ERROR:", str(e))
        print(traceback.format_exc())
        return jsonify({"error": f"Course saving failed: {str(e)}"}), 500

@app.route("/api/admin/all-users", methods=["GET"])
@token_required
@admin_required
def get_all_users(current_user):
    try:
        users = list(users_col.find({}, {"_id": 0, "password": 0}))
        return jsonify(users), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/admin/all-enrollments", methods=["GET"])
@token_required
@admin_required
def get_all_enrollments(current_user):
    try:
        enrollments = list(enrollments_col.find({}, {"_id": 0}))
        return jsonify(enrollments), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ---------------------------------------
# DELETE COURSE
# ---------------------------------------

@app.route("/api/admin/all-payments", methods=["GET"])
@token_required
@admin_required
def get_all_payments(current_user):
    try:
        payments = list(payments_col.find({}, {"_id": 0}))
        return jsonify(payments), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/admin/delete-course/<course_id>", methods=["DELETE"])
@token_required
@admin_required
def delete_course(current_user, course_id):

    result = courses_col.delete_one({"id": course_id})

    if result.deleted_count > 0:

        return jsonify({"message": "Course deleted"})

    return jsonify({"error": "Course not found"}), 404


@app.route("/api/user-enrollments", methods=["GET"])
@token_required
def get_user_enrollments(current_user):
    try:
        email = current_user["email"]
        # Find enrollments and sort by date descending
        enrollments = list(enrollments_col.find({"userEmail": email}, {"_id": 0}).sort("enrolledAt", -1))
        return jsonify(enrollments), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/save-payment", methods=["POST"])
@token_required
def save_payment(current_user):
    try:
        data = request.json
        data["userEmail"] = current_user["email"]
        data["createdAt"] = datetime.datetime.utcnow()
        if "status" not in data:
            data["status"] = "captured"
            
        payments_col.insert_one(data)
        return jsonify({"message": "Payment recorded"}), 200
    except Exception as e:
        return jsonify({"error": "Failed to record payment"}), 500

@app.route("/api/create-order", methods=["POST"])
@token_required
def create_order(current_user):
    try:
        amount = int(request.json["amount"]) * 100 # Razorpay expects paisa
        
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

# ---------------------------------------
# ENROLL
# ---------------------------------------

@app.route("/api/enroll", methods=["POST"])
@token_required
def enroll(current_user):

    data = request.json

    course_id = data["courseId"]

    if enrollments_col.find_one({
        "userEmail": current_user["email"],
        "courseId": course_id
    }):
        return jsonify({"error": "Already enrolled"}), 400

    data["userEmail"] = current_user["email"]
    data["enrolledAt"] = datetime.datetime.utcnow()
    enrollments_col.insert_one(data)

    return jsonify({"message": "Enrollment success"})


# ---------------------------------------
# RUN SERVER
# ---------------------------------------

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=PORT, debug=True)
