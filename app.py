from flask import Flask, jsonify, request

app = Flask(__name__)

products = [
    {"id": 1, "name": "Coffee", "price": 2.5},
    {"id": 2, "name": "Tea", "price": 1.5}
]

@app.route("/")
def home():
    return "Welcome to CAFREE demo!"

@app.route("/products", methods=["GET"])
def get_products():
    return jsonify(products)

@app.route("/products/<int:prod_id>", methods=["GET"])
def get_product(prod_id):
    for p in products:
        if p["id"] == prod_id:
            return jsonify(p)
    return jsonify({"error": "Not found"}), 404

@app.route("/products", methods=["POST"])
def add_product():
    data = request.json
    if not data or "name" not in data or "price" not in data:
        return jsonify({"error": "Bad request"}), 400
    new_id = max([p["id"] for p in products]) + 1 if products else 1
    new_prod = {"id": new_id, "name": data["name"], "price": data["price"]}
    products.append(new_prod)
    return jsonify(new_prod), 201

if __name__ == "__main__":
    app.run(debug=True)
