from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import bcrypt
import os
from dotenv import load_dotenv
from bson import ObjectId  # Import ObjectId for MongoDB

# Load environment variables
load_dotenv()
MONGODB_URI = os.getenv("MONGO_URI")

# Connect to MongoDB
client = MongoClient(MONGODB_URI)
db = client.finance_tracker
users_collection = db.users
transactions_collection = db.transactions

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})  # Allow only requests from the specified origin

@app.route('/register', methods=['POST'])
def register_user():
    data = request.json
    existing_user = users_collection.find_one({"username": data["username"]})

    if existing_user:
        return jsonify({"message": "Username already exists", "success": False}), 400

    hashed_password = bcrypt.hashpw(data["password"].encode('utf-8'), bcrypt.gensalt())
    user = {
        "username": data["username"],
        "password": hashed_password
    }
    
    try:
        users_collection.insert_one(user)
        return jsonify({"message": "User registered successfully.", "success": True}), 201
    except Exception as e:
        return jsonify({"message": "Registration failed! Please try again.", "success": False, "error": str(e)}), 500

@app.route('/login', methods=['POST'])
def login_user():
    data = request.json
    user = users_collection.find_one({"username": data["username"]})

    if user and bcrypt.checkpw(data["password"].encode('utf-8'), user["password"]):
        return jsonify({"username": user["username"]}), 200
    else:
        return jsonify({"message": "Invalid username or password"}), 401

@app.route('/transactions', methods=['POST'])
def add_transaction():
    data = request.json
    transaction = {
        "amount": data["amount"],
        "category": data["category"],
        "description": data["description"],
        "user": data["user"]
    }

    try:
        transactions_collection.insert_one(transaction)
        return jsonify({"message": "Transaction added successfully."}), 201
    except Exception as e:
        return jsonify({"message": "Failed to add transaction.", "error": str(e)}), 500

@app.route('/transactions', methods=['GET'])
def get_transactions():
    user = request.args.get('user')
    if not user:
        return jsonify({"message": "User parameter is required"}), 400
        
    transactions = transactions_collection.find({"user": user})
    transaction_list = []
    for transaction in transactions:
        transaction_list.append({
            "id": str(transaction["_id"]),  # Convert ObjectId to string
            "amount": transaction["amount"],
            "category": transaction["category"],
            "description": transaction["description"]
        })
    return jsonify(transaction_list), 200

@app.route('/summary', methods=['GET'])
def get_summary():
    user = request.args.get('user')
    if not user:
        return jsonify({"message": "User parameter is required"}), 400

    total_income = 0
    total_expenses = 0
    
    transactions = transactions_collection.find({"user": user})
    
    for tx in transactions:
        if tx['category'] == "income":
            total_income += tx['amount']
        elif tx['category'] == "expense":
            total_expenses += tx['amount']

    balance = total_income - total_expenses

    return jsonify({
        "total_income": total_income,
        "total_expenses": total_expenses,
        "balance": balance
    }), 200

@app.route('/transactions/<transaction_id>', methods=['PUT'])
def edit_transaction(transaction_id):
    data = request.json
    try:
        updated_transaction = {
            "amount": data["amount"],
            "category": data["category"],
            "description": data["description"]
        }
        # Convert transaction_id from string to ObjectId
        result = transactions_collection.update_one(
            {"_id": ObjectId(transaction_id)},  # Use ObjectId here
            {"$set": updated_transaction}
        )

        if result.modified_count > 0:
            return jsonify({"message": "Transaction updated successfully."}), 200
        else:
            return jsonify({"message": "No transaction found with that ID."}), 404

    except Exception as e:
        return jsonify({"message": "Failed to update transaction.", "error": str(e)}), 500

@app.route('/transactions/<transaction_id>', methods=['DELETE'])
def delete_transaction(transaction_id):
    try:
        # Convert transaction_id from string to ObjectId
        result = transactions_collection.delete_one({"_id": ObjectId(transaction_id)})  # Use ObjectId here
        if result.deleted_count > 0:
            return jsonify({"message": "Transaction deleted successfully."}), 200
        else:
            return jsonify({"message": "No transaction found with that ID."}), 404
    except Exception as e:
        return jsonify({"message": "Failed to delete transaction.", "error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000)
