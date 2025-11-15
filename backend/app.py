from flask import Flask, request, jsonify
from flask_jwt_extended import JWTManager, create_access_token, jwt_required
from flask_cors import CORS
from models import db, Product
from config import DATABASE_URL, JWT_SECRET_KEY, GOOGLE_CLIENT_ID
from google.oauth2 import id_token
from google.auth.transport import requests as grequests
import requests

app = Flask(__name__)
app.config.update(
    SQLALCHEMY_DATABASE_URI=DATABASE_URL,
    JWT_SECRET_KEY=JWT_SECRET_KEY
)

db.init_app(app)
jwt = JWTManager(app)
CORS(app)

with app.app_context():
    db.create_all()

# ---------------- LOGIN ----------------
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    if data.get('username') == 'admin' and data.get('password') == 'password':
        return jsonify({"access_token": create_access_token(identity="admin")})
    return jsonify({"msg": "Invalid credentials"}), 401

@app.route('/google-login', methods=['POST'])
def google_login():
    try:
        idinfo = id_token.verify_oauth2_token(
            request.json.get('token'),
            grequests.Request(),
            GOOGLE_CLIENT_ID
        )
        return jsonify({"access_token": create_access_token(identity=idinfo['email'])})
    except:
        return jsonify({"msg": "Invalid token"}), 401

# ---------------- FETCH CARTS ----------------
@app.route('/fetch-carts', methods=['POST'])
@jwt_required()
def fetch_carts():
    try:
        Product.query.delete()
        data = requests.get("https://dummyjson.com/carts").json()

        items = []
        for cart in data.get('carts', []):
            for p in cart.get('products', []):
                price = float(p.get("price", 0))
                d = float(p.get("discountPercentage", 0))
                items.append(Product(
                    product_id=p.get("id"),
                    title=p.get("title"),
                    price=price,
                    discount_percentage=d,
                    discounted_price=round(price * (1 - d/100), 2),
                    quantity=int(p.get("quantity", 0))
                ))

        db.session.bulk_save_objects(items)
        db.session.commit()
        return jsonify({"msg": "Products imported successfully!"})

    except Exception as e:
        return jsonify({"msg": "Failed", "error": str(e)}), 500

# ---------------- ANALYTICS ----------------
@app.route('/analytics', methods=['GET'])
@jwt_required()
def analytics():
    products = Product.query.all()
    if not products: return jsonify({})

    return jsonify({
        "total_before_discount": round(sum(p.price * p.quantity for p in products), 2),
        "total_after_discount": round(sum(p.discounted_price * p.quantity for p in products), 6),
        "avg_discount_percentage": round(sum(p.discount_percentage for p in products)/len(products), 2),
        "most_expensive_product": max(products, key=lambda x: x.price).title,
        "cheapest_product": min(products, key=lambda x: x.price).title,
        "highest_discount_product": max(products, key=lambda x: x.discount_percentage).title,
        "total_quantity": sum(p.quantity for p in products),
        "unique_products": len({p.title for p in products})
    })

# ---------------- PRODUCTS CRUD ----------------
@app.route('/products', methods=['GET', 'POST'])
@jwt_required()
def products_route():
    if request.method == 'POST':
        db.session.add(Product(**request.json))
        db.session.commit()
        return jsonify({"msg": "Created"}), 201

    return jsonify([{
        "id": p.id,
        "product_id": p.product_id,
        "title": p.title,
        "price": p.price,
        "discount_percentage": p.discount_percentage,
        "discounted_price": p.discounted_price,
        "quantity": p.quantity
    } for p in Product.query.all()])

@app.route('/products/<int:id>', methods=['GET', 'PUT', 'DELETE'])
@jwt_required()
def product_ops(id):
    p = Product.query.get_or_404(id)

    if request.method == 'GET':
        return jsonify({
            "id": p.id,
            "product_id": p.product_id,
            "title": p.title,
            "price": p.price,
            "discount_percentage": p.discount_percentage,
            "discounted_price": p.discounted_price,
            "quantity": p.quantity
        })

    if request.method == 'PUT':
        for k, v in request.json.items(): setattr(p, k, v)
        db.session.commit()
        return jsonify({"msg": "Updated"})

    db.session.delete(p)
    db.session.commit()
    return jsonify({"msg": "Deleted"})

# ---------------- RUN ----------------
if __name__ == '__main__':
    app.run(debug=True)

