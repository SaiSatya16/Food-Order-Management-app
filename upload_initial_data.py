from app import app
from sec import datastore
from model import db, Role , Category, Product, Association
from flask_security import hash_password
from werkzeug.security import generate_password_hash


with app.app_context():
    db.create_all()
    datastore.find_or_create_role(name="Admin", description="user is Admin")
    datastore.find_or_create_role(name="Kitchen", description="user is Kitchen")
    datastore.find_or_create_role(name="Customer", description="user is Customer")
    db.session.commit()
    if not datastore.find_user(email="admin@gmail.com"):
        datastore.create_user(
            username="admin",
            email="admin@gmail.com",
            password= generate_password_hash("admin"),
            roles=["Admin"])
    if not datastore.find_user(email="kitchen@gmail.com"):
        datastore.create_user(
            username="kitchen",
            email="kitchen@gmail.com",
            password=generate_password_hash("kitchen"),
            roles=["Kitchen"], active=False)
    if not datastore.find_user(email="table1@gmail.com"):
        datastore.create_user(
            username="table1",
            email="table1@gmail.com",
            password="table1",
            roles=["Customer"])
    if not datastore.find_user(email="table2@gmail.com"):
        datastore.create_user(
            username="table2",
            email="table2@gmail.com",
            password="table2",
            roles=["Customer"])
    if not datastore.find_user(email="table3@gmail.com"):
        datastore.create_user(
            username="table3",
            email="table3@gmail.com",
            password="table3",
            roles=["Customer"])
    if not datastore.find_user(email="table4@gmail.com"):
        datastore.create_user(
            username="table4",
            email="table4@gmail.com",
            password="table4",
            roles=["Customer"])
    


    db.session.commit()

    # add some categories
    #Ctegories = ["Veg soups", "Veg Starters", "Baby Corn Starters", "Paneer Starters", "Mushroom Starters ", "Veg Chopsuey", "Veg Rice", "Veg Noodles(Soft)", "Egg Starters", "Egg Rice", "Egg Noodles","Non-Veg Soups", "Chicken Starters", "Starters Sea Food","Chopsuey", "Rice (Non-Veg)", "Noodles (Non-Veg)", "Roti", "Extras", "Soft Drinks"]
    
    Categories = [{"name":"Veg soups", "Vegetarian":True},
                  {"name":"Veg Starters", "Vegetarian":True},
    {"name":"Baby Corn Starters", "Vegetarian":True},
    {"name":"Paneer Starters", "Vegetarian":True},
    {"name":"Mushroom Starters ", "Vegetarian":True},
    {"name":"Veg Chopsuey", "Vegetarian":True},
    {"name":"Veg Rice", "Vegetarian":True},
    {"name":"Veg Noodles(Soft)", "Vegetarian":True},
    {"name":"Egg Starters", "Vegetarian":False},
    {"name":"Egg Rice", "Vegetarian":False},
    {"name":"Egg Noodles", "Vegetarian":False},
    {"name":"Non-Veg Soups", "Vegetarian":False},
    {"name":"Chicken Starters", "Vegetarian":False},
    {"name":"Starters Sea Food", "Vegetarian":False},
    {"name":"Chopsuey", "Vegetarian":False},
    {"name":"Rice (Non-Veg)", "Vegetarian":False},
    {"name":"Noodles (Non-Veg)", "Vegetarian":False},
    {"name":"Roti", "Vegetarian":True},
    {"name":"Extras", "Vegetarian":True},
    {"name":"Soft Drinks", "Vegetarian":True}]
    
    for category in Categories:
        db.session.add(Category(name=category["name"], active=True, Vegetarian=category["Vegetarian"]))
    db.session.commit()
    # add some products to each category
    products = [
    {
        "name": "Veg Sweet Corn Soup",
        "rate": 80,
        "category_id": 1
    },
    {
        "name": "Veg Lemon Coriander Soup",
        "rate": 80,
        "category_id": 1
    },
    {
        "name": "Veg Hot and Sour Soup",
        "rate": 80,
        "category_id": 1
    },
    {
        "name": "Veg Manchow Soup",
        "rate": 90,
        "category_id": 1
    },
    {
        "name": "Veg Noodle Pepper Soup",
        "rate": 90,
        "category_id": 1
    },
    {
        "name": "Veg Tomato Soup",
        "rate": 90,
        "category_id": 1
    },
    {
        "name": "Veg Manchuria (Dry)",
        "rate": 90,
        "category_id": 2
    },
    {
        "name": "Veg Manchuria (Wet)",
        "rate": 90,
        "category_id": 2
    },
    {
        "name": "Veg 65(Dry)",
        "rate": 95,
        "category_id": 2
    },
    {
        "name": "Veg 65(Wet)",
        "rate": 95,
        "category_id": 2
    },
    {
        "name": "Veg Schezwan Manchuria",
        "rate": 110,
        "category_id": 2
    },
    {
        "name": "Veg Chilli Manchuria",
        "rate": 110,
        "category_id": 2
    },
    {
        "name": "BabyCorn Manchuria(Dry)",
        "rate": 120,
        "category_id": 3
    },
    {
        "name": "BabyCorn Manchuria(Wet)",
        "rate": 120,
        "category_id": 3
    },
    {
        "name": "Chilli Baby Corn(Dry)",
        "rate": 130,
        "category_id": 3
    },
    {
        "name": "Chilli Baby Corn(Wet)",
        "rate": 130,
        "category_id": 3
    },
    {
        "name": "Crispy Baby Corn",
        "rate": 130,
        "category_id": 3
    },
    {
        "name": "Paneer Manchuria(Dry)",
        "rate": 145,
        "category_id": 4
    },
    {
        "name": "Paneer Manchuria(Wet)",
        "rate": 145,
        "category_id": 4
    },
    {
        "name": "Paneer 65(Dry)",
        "rate": 150,
        "category_id": 4
    },
    {
        "name": "Paneer 65(Wet)",
        "rate": 150,
        "category_id": 4
    },
    {
        "name": "Schezwan Paneer",
        "rate": 160,
        "category_id": 4
    },
    {
        "name": "Chilli Garlic Paneer",
        "rate": 160,
        "category_id": 4
    },
    {
        "name": "Mushroom Manchuria(Dry)",
        "rate": 130,
        "category_id": 5
    },
    {
        "name": "Mushroom Manchuria(Wet)",
        "rate": 130,
        "category_id": 5
    },
    {
        "name": "Mushroom 65(Dry)",
        "rate": 135,
        "category_id": 5
    },
    {
        "name": "Mushroom 65(Wet)",
        "rate": 135,
        "category_id": 5
    },
    {
        "name": "Schezwan Mushroom",
        "rate": 140,
        "category_id": 5
    },
    {
        "name": "Chilli Mushroom",
        "rate": 145,
        "category_id": 5
    },
    {
        "name": "Veg Chinese Chopsuey",
        "rate": 150,
        "category_id": 6
    },
    {
        "name": "Veg American Chopsuey",
        "rate": 150,
        "category_id": 6
    },
    {
        "name": "Veg Fried Rice",
        "rate": 90,
        "category_id": 7
    },
    {
        "name": "Veg Soft Rice",
        "rate": 90,
        "category_id": 7
    },
    {
        "name": "Kaju Rice",
        "rate": 110,
        "category_id": 7
    },
    {
        "name": "Veg Schezwan Rice",
        "rate": 100,
        "category_id": 7
    },
    {
        "name": "Veg Manchurian Rice",
        "rate": 120,
        "category_id": 7
    },
    {
        "name": "Veg Manchurian Schezwan Rice",
        "rate": 130,
        "category_id": 7
    },
    {
        "name": "Veg Singapoori Rice",
        "rate": 110,
        "category_id": 7
    },
    {
        "name": "Veg Ginger Rice",
        "rate": 110,
        "category_id": 7
    },
    {
        "name": "Veg Chilli Garlic Rice",
        "rate": 120,
        "category_id": 7
    },
    {
        "name": "Butter Jeera Rice",
        "rate": 110,
        "category_id": 7
    },
    {
        "name": "Corn Fried Rice",
        "rate": 110,
        "category_id": 7
    },
    {
        "name": "Butter Corn Fried Rice",
        "rate": 120,
        "category_id": 7
    },
    {
        "name": "Paneer Fried Rice",
        "rate": 120,
        "category_id": 7
    },
    {
        "name": "Paneer Schezwan Rice",
        "rate": 135,
        "category_id": 7
    },
    {
        "name": "Paneer Manchurian Rice",
        "rate": 135,
        "category_id": 7
    },
    {
        "name": "Paneer Manchurian Schezwan Rice",
        "rate": 145,
        "category_id": 7
    },
    {
        "name": "Mushroom Fried Rice",
        "rate": 130,
        "category_id": 7
    },
    {
        "name": "Mushroom Shezwan Fried Rice",
        "rate": 140,
        "category_id": 7
    },
    {
        "name": "Veg Mixed Rice",
        "rate": 150,
        "category_id": 7
    },
    {
        "name": "Veg Mixed Shezwan Rice",
        "rate": 160,
        "category_id": 7
    },
    {
        "name": "Veg Noodles",
        "rate": 90,
        "category_id": 8
    },
    {
        "name": "Veg Soft Noodles",
        "rate": 90,
        "category_id": 8
    },
    {
        "name": "Kaju Noodles",
        "rate": 110,
        "category_id": 8
    },
    {
        "name": "Veg Schezwan Noodles",
        "rate": 100,
        "category_id": 8
    },
    {
        "name": "Veg Manchurian Noodles",
        "rate": 120,
        "category_id": 8
    },
    {
        "name": "Veg Manchurian Schezwan Noodles",
        "rate": 130,
        "category_id": 8
    },
    {
        "name": "Veg Singapoori Noodles",
        "rate": 110,
        "category_id": 8
    },
    {
        "name": "Veg Chilli Garlic Noodles",
        "rate": 120,
        "category_id": 8
    },
    {
        "name": "Paneer Noodles",
        "rate": 120,
        "category_id": 8
    },
    {
        "name": "Paneer Schezwan Noodles",
        "rate": 135,
        "category_id": 8
    },
    {
        "name": "Paneer Manchurian Noodles",
        "rate": 135,
        "category_id": 8
    },
    {
        "name": "Paneer Manchurian Schezwan Noodles",
        "rate": 140,
        "category_id": 8
    },
    {
        "name": "Mushroom Noodles",
        "rate": 130,
        "category_id": 8
    },
    {
        "name": "Mushroom Shezwan Fried Noodles",
        "rate": 140,
        "category_id": 8
    },
    {
        "name": "Veg Mixed Noodles",
        "rate": 150,
        "category_id": 8
    },
    {
        "name": "Egg Manchuria",
        "rate": 110,
        "category_id": 9
    },
    {
        "name": "Egg 65",
        "rate": 120,
        "category_id": 9
    },
    {
        "name": "Egg Chilli",
        "rate": 130,
        "category_id": 9
    },
    {
        "name": "Schezwan Egg",
        "rate": 130,
        "category_id": 9
    },
    {
        "name": "Egg Burji",
        "rate": 100,
        "category_id": 9
    },
    {
        "name": "Boiled Egg Fry",
        "rate": 100,
        "category_id": 9
    },
    {
        "name": "Egg Fried Rice",
        "rate": 90,
        "category_id": 10
    },
    {
        "name": "Egg Soft Rice",
        "rate": 90,
        "category_id": 10
    },
    {
        "name": "Double Egg Fried Rice",
        "rate": 100,
        "category_id": 10
    },
    {
        "name": "Egg Schezwan Rice",
        "rate": 110,
        "category_id": 10
    },
    {
        "name": "Double Egg Schezwan Rice",
        "rate": 120,
        "category_id": 10
    },
    {
        "name": "Egg Chilli Garlic Rice",
        "rate": 120,
        "category_id": 10
    },
    {
        "name": "Egg Singapoori Rice",
        "rate": 110,
        "category_id": 10
    },
    {
        "name": "Egg Manchurian Rice",
        "rate": 130,
        "category_id": 10
    },
    {
        "name": "Egg Noodles",
        "rate": 90,
        "category_id": 11
    },
    {
        "name": "Egg Soft Noodles",
        "rate": 90,
        "category_id": 11
    },
    {
        "name": "Double Egg Noodles",
        "rate": 100,
        "category_id": 11
    },
    {
        "name": "Egg Schezwan Noodles",
        "rate": 110,
        "category_id": 11
    },
    {
        "name": "Double Egg Schezwan Noodles",
        "rate": 120,
        "category_id": 11
    },
    {
        "name": "Egg Chilli Garlic Noodles",
        "rate": 120,
        "category_id": 11
    },
    {
        "name": "Egg Singapoori Noodles",
        "rate": 110,
        "category_id": 11
    },
    {
        "name": "Egg Manchurian Noodles",
        "rate": 130,
        "category_id": 11
    },
    {
        "name": "Chicken Sweet Corn Soup",
        "rate": 90,
        "category_id": 12
    },
    {
        "name": "Chicken Lemon Coriander Soup",
        "rate": 90,
        "category_id": 12
    },
    {
        "name": "Chicken Hot and Sour Soup",
        "rate": 90,
        "category_id": 12
    },
    {
        "name": "Chicken Monchow Soup",
        "rate": 100,
        "category_id": 12
    },
    {
        "name": "Chicken Noodle Pepper Soup",
        "rate": 100,
        "category_id": 12
    },
    {
        "name": "Chicken Manchuria (Dry) (15Pcs)",
        "rate": 130,
        "category_id": 13
    },
    {
        "name": "Chicken Manchuria (Wet) (15Pcs)",
        "rate": 130,
        "category_id": 13
    },
    {
        "name": "Chicken 65 (Dry) (15Pcs)",
        "rate": 140,
        "category_id": 13
    },
    {
        "name": "Chicken 65 (Wet) (15Pcs)",
        "rate": 140,
        "category_id": 13
    },
    {
        "name": "Ginger Chicken (Dry) (15Pcs)",
        "rate": 140,
        "category_id": 13
    },
    {
        "name": "Ginger Chicken (Wet) (15Pcs)",
        "rate": 140,
        "category_id": 13
    },
    {
        "name": "Chilli Chicken (Dry) (15Pcs)",
        "rate": 140,
        "category_id": 13
    },
    {
        "name": "Chilli Chicken (Wet) (15Pcs)",
        "rate": 140,
        "category_id": 13
    },
    {
        "name": "Hot Garlic Chicken (15Pcs)",
        "rate": 150,
        "category_id": 13
    },
    {
        "name": "Schezwan Chicken (Dry) (15Pcs)",
        "rate": 150,
        "category_id": 13
    },
    {
        "name": "Schezwan Chicken (Wet) (15Pcs)",
        "rate": 150,
        "category_id": 13
    },
    {
        "name": "Hong Kong Chicken (15Pcs)",
        "rate": 160,
        "category_id": 13
    },
    {
        "name": "Lemon Chicken (15Pcs)",
        "rate": 160,
        "category_id": 13
    },
    {
        "name": "Chicken Lollipop (5Pcs)",
        "rate": 150,
        "category_id": 13
    },
    {
        "name": "Chicken Wings (5Pcs)",
        "rate": 120,
        "category_id": 13
    },
    {
        "name": "Prawns Manchuria",
        "rate": 180,
        "category_id": 14
    },
    {
        "name": "Prawns 65",
        "rate": 190,
        "category_id": 14
    },
    {
        "name": "Prawns Chilli",
        "rate": 200,
        "category_id": 14
    },
    {
        "name": "Shezwan Prawns",
        "rate": 200,
        "category_id": 14
    },
    {
        "name": "Hot Garlic Prawns",
        "rate": 200,
        "category_id": 14
    },
    {
        "name": "Chicken Chinese Chopsuey",
        "rate": 160,
        "category_id": 15
    },
    {
        "name": "Chicken American Chopsuey",
        "rate": 160,
        "category_id": 15
    },
    {
        "name": "Chicken Fried Rice",
        "rate": 100,
        "category_id": 16
    },
    {
        "name": "Chicken Soft Fried Rice",
        "rate": 100,
        "category_id": 16
    },
    {
        "name": "Double Egg Chicken Fried Rice",
        "rate": 110,
        "category_id": 16
    },
    {
        "name": "Chicken Fried Rice (without coating)",
        "rate": 130,
        "category_id": 16
    },
    {
        "name": "Double Egg Chicken Fried Rice (without coating)",
        "rate": 140,
        "category_id": 16
    },
    {
        "name": "Singapoori Chicken Rice",
        "rate": 120,
        "category_id": 16
    },
    {
        "name": "Chilli Garlic Chicken Rice",
        "rate": 120,
        "category_id": 16
    },
    {
        "name": "Chicken Schezwan Rice",
        "rate": 120,
        "category_id": 16
    },
    {
        "name": "Ginger Chicken Rice",
        "rate": 120,
        "category_id": 16
    },
    {
        "name": "Double Egg Chicken Schezwan Rice",
        "rate": 130,
        "category_id": 16
    },
    {
        "name": "Double Chicken Fried Rice",
        "rate": 140,
        "category_id": 16
    },
    {
        "name": "Chicken Manchurian Rice",
        "rate": 140,
        "category_id": 16
    },
    {
        "name": "Double Egg Chicken Manchurian Rice",
        "rate": 150,
        "category_id": 16
    },
    {
        "name": "Chicken Manchurian Schezwan Rice",
        "rate": 150,
        "category_id": 16
    },
    {
        "name": "Double Egg Double Chicken Fried Rice",
        "rate": 150,
        "category_id": 16
    },
    {
        "name": "Double Egg Chicken Manchurian Schezwan Rice",
        "rate": 160,
        "category_id": 16
    },
    {
        "name": "Triple Chicken Rice",
        "rate": 150,
        "category_id": 16
    },
    {
        "name": "Prawns Fried Rice",
        "rate": 150,
        "category_id": 16
    },
    {
        "name": "Prawns Schezwan Fried Rice",
        "rate": 160,
        "category_id": 16
    },
    {
        "name": "Non Veg Mixed Fried Rice",
        "rate": 160,
        "category_id": 16
    },
    {
        "name": "Chicken Noodles",
        "rate": 100,
        "category_id": 17
    },
    {
        "name": "Chicken Soft Noodles",
        "rate": 100,
        "category_id": 17
    },
    {
        "name": "Chicken Hakka Noddles",
        "rate": 110,
        "category_id": 17
    },
    {
        "name": "Double Egg Chicken Noodles",
        "rate": 110,
        "category_id": 17
    },
    {
        "name": "Chicken Noodles (without coating)",
        "rate": 130,
        "category_id": 17
    },
    {
        "name": "Double Egg Chicken Noodles (without coating)",
        "rate": 145,
        "category_id": 17
    },
    {
        "name": "Singapoori Chicken Noodles",
        "rate": 120,
        "category_id": 17
    },
    {
        "name": "Chilli Garlic Chicken Noodles",
        "rate": 120,
        "category_id": 17
    },
    {
        "name": "Chicken Schezwan Noodles",
        "rate": 120,
        "category_id": 17
    },
    {
        "name": "Ginger Chicken Noodles",
        "rate": 120,
        "category_id": 17
    },
    {
        "name": "Double Egg Chicken Schezwan Noodles",
        "rate": 130,
        "category_id": 17
    },
    {
        "name": "Double Chicken Noodles",
        "rate": 140,
        "category_id": 17
    },
    {
        "name": "Chicken Manchurian Noodles",
        "rate": 140,
        "category_id": 17
    },
    {
        "name": "Double Egg Chicken Manchurian Noodles",
        "rate": 150,
        "category_id": 17
    },
    {
        "name": "Chicken Manchurian Schezwan Noodles",
        "rate": 150,
        "category_id": 17
    },
    {
        "name": "Double Egg Double Chicken Noodles",
        "rate": 150,
        "category_id": 17
    },
    {
        "name": "Double Egg Chicken Manchurian Schezwan Noodles",
        "rate": 160,
        "category_id": 17
    },
    {
        "name": "Triple Chicken Noodles",
        "rate": 150,
        "category_id": 17
    },
    {
        "name": "Prawns Fried Noodles",
        "rate": 150,
        "category_id": 17
    },
    {
        "name": "Prawns Schezwan Fried Noodles",
        "rate": 160,
        "category_id": 17
    },
    {
        "name": "Non Veg Mixed Fried Noodles",
        "rate": 160,
        "category_id": 17
    },
    {
        "name": "Rumali Roti",
        "rate": 20,
        "category_id": 18
    },
    {
        "name": "Extra Egg",
        "rate": 10,
        "category_id": 19
    },
    {
        "name": "Onion Salad",
        "rate": 10,
        "category_id": 19
    },
    {
        "name": "Mayonnaise",
        "rate": 20,
        "category_id": 19
    },
    {
        "name": "Hot Garlic Sauce",
        "rate": 20,
        "category_id": 19
    },
    {
        "name": "Fried Noodles",
        "rate": 30,
        "category_id": 19
    },
    {
        "name": "Thumps Up",
        "rate": 20,
        "category_id": 20
    },
    {
        "name": "Sprite",
        "rate": 20,
        "category_id": 20
    },
    {
        "name": "Mountain Dew",
        "rate": 20,
        "category_id": 20
    },
    {
        "name": "Pepsi",
        "rate": 20,
        "category_id": 20
    },
    {
        "name": "Water Bottle",
        "rate": 30,
        "category_id": 20
    },
    {
        "name": "VINTAGE Goli Soda",
        "rate": 40,
        "category_id": 20
    }
]
        

        
    
    
    
    
    
    
    
    
    
    
    
    for product in products:
        cid = product["category_id"]
        category = Category.query.filter_by(id=cid).first()
        Vegetarian = category.Vegetarian
        db.session.add(Product(name=product["name"], rate=product["rate"], category_id=product["category_id"], active=True, Vegetarian=Vegetarian))
    db.session.commit()

    for product in products:
        p = Product.query.filter_by(name=product["name"]).first()

        if p:  # Check if the product exists
            pid = p.id
            cid = p.category_id


            # Check if the association already exists
            existing_association = Association.query.filter_by(
                category_id=cid, product_id=pid
            ).first()

            if not existing_association:  # If association doesn't exist, create it
                asso = Association(category_id=cid, product_id=pid)
                db.session.add(asso)

    db.session.commit()
