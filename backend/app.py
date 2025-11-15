from flask import Flask, request, jsonify
from flask_jwt_extended import JWTManager, create_access_token, jwt_required
from flask_cors import CORS
from models import db, Product
import requests
from config import DATABASE_URL, JWT_SECRET_KEY, GOOGLE_CLIENT_ID
from google.oauth2 import id_token
from google.auth.transport import requests as grequests

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URL
app.config['JWT_SECRET_KEY'] = JWT_SECRET_KEY

db.init_app(app)
jwt = JWTManager(app)
CORS(app)

with app.app_context():
    db.create_all()

# -------------------------------
# Username & Password Login
# -------------------------------
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    if data['username'] == 'admin' and data['password'] == 'password':
        token = create_access_token(identity=data['username'])
        return jsonify({"access_token": token})
    return jsonify({"msg": "Invalid credentials"}), 401

# -------------------------------
# Google SSO Login
# -------------------------------
@app.route('/google-login', methods=['POST'])
def google_login():
    token = request.json.get('token')
    try:
        idinfo = id_token.verify_oauth2_token(token, grequests.Request(), GOOGLE_CLIENT_ID)
        jwt_token = create_access_token(identity=idinfo['email'])
        return jsonify({"access_token": jwt_token})
    except ValueError:
        return jsonify({"msg": "Invalid token"}), 401

# -------------------------------
# Fetch External API & Save to DB
# -------------------------------
@app.route('/fetch-carts', methods=['POST'])
@jwt_required()
def fetch_carts():
    try:
        # 1️⃣ Clear previous products to prevent duplicates
        Product.query.delete()
        db.session.commit()

        # 2️⃣ Fetch data from external API
        data = requests.get("https://dummyjson.com/carts").json()

        # 3️⃣ Loop through carts and products
        for cart in data.get('carts', []):
            for item in cart.get('products', []):
                try:
                    price = float(item.get('price', 0))
                    discount_pct = float(item.get('discountPercentage', 0))
                    quantity = int(item.get('quantity', 0))

                    # Correct discounted price
                    discounted_price = round(price * (1 - discount_pct / 100), 2)

                    product = Product(
                        product_id=item.get('id'),
                        title=item.get('title', 'Unknown'),
                        price=price,
                        discount_percentage=discount_pct,
                        discounted_price=discounted_price,
                        quantity=quantity
                    )
                    db.session.add(product)
                except Exception as inner_err:
                    print(f"Skipping product due to error: {inner_err}")

        db.session.commit()
        return jsonify({"msg": "Products imported successfully!"})

    except Exception as e:
        print("Error importing products:", e)
        return jsonify({"msg": "Failed to import products", "error": str(e)}), 500



# -------------------------------
# Analytics API
# -------------------------------
@app.route('/analytics', methods=['GET'])
@jwt_required()
def analytics():
    products = Product.query.all()
    if not products:
        return jsonify({})

    total_before = sum(p.price * p.quantity for p in products)
    total_after = sum((p.price * p.quantity) * (1 - p.discount_percentage / 100) for p in products)
    avg_discount = sum(p.discount_percentage for p in products) / len(products)
    most_expensive = max(products, key=lambda p: p.price).title
    cheapest = min(products, key=lambda p: p.price).title
    highest_discount = max(products, key=lambda p: p.discount_percentage).title
    total_qty = sum(p.quantity for p in products)
    unique_products = len(set(p.title for p in products))

    return jsonify({
        "total_before_discount": round(total_before, 2),
        "total_after_discount": round(total_after, 6),
        "avg_discount_percentage": round(avg_discount, 2),
        "most_expensive_product": most_expensive,
        "cheapest_product": cheapest,
        "highest_discount_product": highest_discount,
        "total_quantity": total_qty,
        "unique_products": unique_products
    })

# -------------------------------
# Products CRUD API
# -------------------------------
@app.route('/products', methods=['GET', 'POST'])
@jwt_required()
def products_route():
    if request.method == 'POST':
        data = request.json
        product = Product(**data)
        db.session.add(product)
        db.session.commit()
        return jsonify({"msg": "Product created"}), 201

    products = Product.query.all()
    return jsonify([{
        "id": p.id,
        "product_id": p.product_id,
        "title": p.title,
        "price": p.price,
        "discount_percentage": p.discount_percentage,
        "discounted_price": round(p.price * (1 - p.discount_percentage/100),2),
        "quantity": p.quantity
    } for p in products])

@app.route('/products/<int:id>', methods=['GET', 'PUT', 'DELETE'])
@jwt_required()
def single_product(id):
    product = Product.query.get_or_404(id)

    if request.method == 'GET':
        return jsonify({
            "id": product.id,
            "product_id": product.product_id,
            "title": product.title,
            "price": product.price,
            "discount_percentage": product.discount_percentage,
            "discounted_price": round(product.price * (1 - product.discount_percentage/100),2),
            "quantity": product.quantity
        })

    elif request.method == 'PUT':
        data = request.json
        for key, value in data.items():
            setattr(product, key, value)
        db.session.commit()
        return jsonify({"msg": "Updated successfully"})

    elif request.method == 'DELETE':
        db.session.delete(product)
        db.session.commit()
        return jsonify({"msg": "Deleted successfully"})

# -------------------------------
# Run App
# -------------------------------
if __name__ == '__main__':
    app.run(debug=True)
