from flask import Flask, render_template ,request,redirect, url_for, jsonify
from model import *
import os
from api import *
from flask_cors import CORS
from config import DevelopmentConfig
from flask_security import Security, SQLAlchemyUserDatastore, UserMixin, RoleMixin, login_required
from flask_security import auth_required, roles_required, current_user
from werkzeug.security import check_password_hash, generate_password_hash
from flask_restful import marshal, fields
from sec import datastore
from PIL import Image
from sqlalchemy.orm.exc import NoResultFound
from worker import celery_init_app
from tasks import create_resource_csv, daily_reminder, monthly_report
from flask import send_file
from celery.result import AsyncResult
import flask_excel as excel
from celery.schedules import crontab
from mailservice import send_message
from flask_mail import Message
import random
import string
from flask_socketio import SocketIO, emit


#==============================configuration===============================


app = Flask(__name__)
socketio = SocketIO(app)
app.config.from_object(DevelopmentConfig)
#app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///database.sqlite3"

api.init_app(app)
db.init_app(app)
excel.init_excel(app)
CORS(app, resources={r"/socket.io/*": {"origins": "*"}})

app.security = Security(app, datastore)

app.app_context().push()

celery_app = celery_init_app(app)

def get_user_roles():
    if current_user.is_authenticated:
        return [role.name for role in current_user.roles]  # Assuming roles have a 'name' attribute
    else:
        return []  # Return an empty list if the user is not authenticated or roles are not available


@app.post('/Buy/<int:user_id>')
@auth_required("token")
@roles_required("Customer")
def add_to_bought(user_id):
    try:
        data = request.get_json()
        date = data.get('date')
        customername = data.get('customer_name')
        customeremail = data.get('customer_email')
        customerphone = data.get('customer_phone_number')
        totalprice = data.get('total_amount')
        cart = data.get('cart')
        active = False
        checkout = False


        if not date:
            return jsonify({"message": "date not provided"}), 400
        if not customername:
            return jsonify({"message": "customername not provided"}), 400
        if not customeremail:
            return jsonify({"message": "customeremail not provided"}), 400
        if not customerphone:
            return jsonify({"message": "customerphone not provided"}), 400
        if not totalprice:
            return jsonify({"message": "totalprice not provided"}), 400
        if not cart:
            return jsonify({"message": "cart not provided"}), 400




        bought = Bought(user_id = user_id, date = date, customer_name = customername, customer_email = customeremail, customer_phone = customerphone, totalprice = totalprice, active = active, checkout = checkout)
        db.session.add(bought)
        db.session.commit()

        B = Bought.query.filter_by(user_id = user_id).order_by(Bought.id.desc()).first()
        bought_id = B.id

        for product in cart:
            product_id = product.get('product_id')
            product_name = product.get('product_name')
            product_rate = product.get('product_rate')
            req_quantity = product.get('req_quantity')
            bought_product = Products_bought(product_id = product_id, product_name = product_name, product_rate = product_rate, req_quantity = req_quantity, bought_id = bought_id)
            db.session.add(bought_product)
        
        db.session.commit()

        for product in cart:
            product_name = product.get('product_name')
            P = Products_bought.query.filter_by(product_name = product_name).order_by(Products_bought.id.desc()).first()
            pid = P.id
            bid = P.bought_id
            bought_product_association = Bought_product_association(bought_id = bid, products_bought_id = pid)
            db.session.add(bought_product_association)
        
        db.session.commit()


        socketio.emit('newBoughtEntry', namespace='/Bought')
        return jsonify({"message": "Successfully Placed Order"}), 200
        
    except NoResultFound:
        db.session.rollback()
        return jsonify({"message": "No items found in the cart for the user"}), 404   




@app.get('/')
def index():
    return render_template('index.html')

@app.get('/admin')
@auth_required("token")
@roles_required("Admin")
def Admin():
    return "Hello Admin"

@app.get('/activate/manager/<int:id>')
@auth_required("token")
@roles_required("Admin")
def activate_customer(id):
    User.query.filter_by(id = id).update({'active':True})
    db.session.commit()
    return jsonify({"message":"Table activated"})

@app.get('/deactivate/manager/<int:id>')
@auth_required("token")
@roles_required("Admin")
def deactivate_customer(id):
    User.query.filter_by(id = id).update({'active':False})
    db.session.commit()
    return jsonify({"message":"Table deactivated"})


@app.get('/activate/category/<int:id>')
@auth_required("token")
@roles_required("Admin")
def activate_category(id):
    Category.query.filter_by(id = id).update({'active':True})
    products = Product.query.filter_by(category_id = id).all()
    for product in products:
        Product.query.filter_by(id = product.id).update({'active':True})
    db.session.commit()
    return jsonify({"message":"Category activated"})

@app.get('/deactivate/category/<int:id>')
@auth_required("token")
@roles_required("Admin")
def deactivate_category(id):
    Category.query.filter_by(id = id).update({'active':False})
    products = Product.query.filter_by(category_id = id).all()
    for product in products:
        Product.query.filter_by(id = product.id).update({'active':False})
    
    db.session.commit()
    return jsonify({"message":"Category deactivated"})

@app.get('/activate/product/<int:id>')
@auth_required("token")
@roles_required("Admin")
def activate_product(id):
    Product.query.filter_by(id = id).update({'active':True})
    db.session.commit()
    return jsonify({"message":"Product activated"})

@app.get('/deactivate/product/<int:id>')
@auth_required("token")
@roles_required("Admin")
def deactivate_product(id):
    Product.query.filter_by(id = id).update({'active':False})
    db.session.commit()
    return jsonify({"message":"Product deactivated"})

@app.get('/activate/bought/<int:id>')

def activate_bought(id):
    Bought.query.filter_by(id = id).update({'active':True})
    db.session.commit()
    return jsonify({"message":"Order Finished"})

@app.get('/checkout/bought/<int:id>')
def checkout_bought(id):
    Bought.query.filter_by(id = id).update({'checkout':True})
    db.session.commit()
    return jsonify({"message":"Order Checked Out"})




def get_new_password():
    new_password = ''.join(random.choices(string.ascii_uppercase + string.digits, k=5))

    return new_password


@app.post('/user-login')
def user_login():
    data = request.get_json()
    email = data.get('email')
    if not email:
        return jsonify({"message": "email not provided"}), 400

    user = datastore.find_user(email=email)

    if not user:
        return jsonify({"message": "User Not Found"}), 404
    
    if not user.active:
        return jsonify({"message": "User Not Activated"}), 400
    
    if user.roles[0].name == "Customer":
        if user.password == data.get("password"):
            user_details = {
                "token": user.get_auth_token(),
                "email": user.email,
                "role": user.roles[0].name,
                "username": user.username,
                "id": user.id
            }
            New_password = get_new_password()
            User.query.filter_by(id = user.id).update({'password':New_password})
            db.session.commit()
            return user_details, 200
        else:
            return jsonify({"message": "Wrong Password"}), 400
        
    else:
        if check_password_hash(user.password, data.get("password")):
            user_details = {
                "token": user.get_auth_token(),
                "email": user.email,
                "role": user.roles[0].name,
                "username": user.username,
                "id": user.id
            }
            return user_details, 200
        else:
            return jsonify({"message": "Wrong Password"}), 400
        

#get user password
@app.get('/user-password/<int:id>')
def get_user_password(id):
    user = User.query.filter_by(id = id).first()
    if not user:
        return jsonify({"message": "User Not Found"}), 404
    role = user.roles[0].name
    if role == "Customer":
        password = user.password
        return jsonify({"password": password}), 200
    else:
        return jsonify({"message": "You are not Customer"}), 400



    
@app.post('/user-registration')
def user_registration():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    username = data.get('username')
    if not email:
        return jsonify({"message": "email not provided"}), 400
    if not password:
        return jsonify({"message": "password not provided"}), 400
    if not username:
        return jsonify({"message": "username not provided"}), 400
    if datastore.find_user(email=email):
        return jsonify({"message": "User Already Exists"}), 400
    else:
        datastore.create_user(
            username=username,
            email=email,
            password=generate_password_hash(password),
            roles=["Customer"])
        db.session.commit()
        return jsonify({"message": "User Created"}), 201
    

#/manager-registration
@app.post('/manager-registration')
def manager_registration():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    username = data.get('username')
    if not email:
        return jsonify({"message": "email not provided"}), 400
    if not password:
        return jsonify({"message": "password not provided"}), 400
    if not username:
        return jsonify({"message": "username not provided"}), 400
    if datastore.find_user(email=email):
        return jsonify({"message": "User Already Exists"}), 400
    else:
        datastore.create_user(
            username=username,
            email=email,
            password=generate_password_hash(password),
            roles=["Manager"],active=False)
        db.session.commit()
        return jsonify({"message": "User Created"}), 201

    

user_fields = {
    "id": fields.Integer,
    "username": fields.String,
    "email": fields.String,
    "active": fields.Boolean,
}


@app.get('/users')
@auth_required("token")
@roles_required("Admin")
def all_users():
    users = User.query.all()
    if len(users) == 0:
        return jsonify({"message": "No User Found"}), 404
    return marshal(users, user_fields)



ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/api/category/<int:category_id>/upload-image', methods=['POST'])
@auth_required("token")
@roles_required("Admin")

def upload_category_image(category_id):
    if 'image' not in request.files:
        return {'error': 'No image uploaded'}, 400

    image_file = request.files['image']
    if image_file.filename == '':
        return {'error': 'No selected file'}, 400

    if image_file and allowed_file(image_file.filename):
        # Ensure the path exists
        upload_path = f'static/uploads/'
        if not os.path.exists(upload_path):
            os.makedirs(upload_path)

        image = Image.open(image_file)
        # Save the image with the category ID as the name and in the correct format
        image.save(f'{upload_path}/{category_id}_cat_image.{image.format.lower()}')
        image_path = f'/static/uploads/{category_id}_cat_image.{image.format.lower()}'

        # Update the database with the image path
        category = Category.query.filter_by(id=category_id).first()
        if category:
            category.image = image_path
            db.session.commit()
            return {'message': 'Image uploaded successfully'}, 200
        else:
            return {'error': 'Category not found'}, 404
    else:
        return {'error': 'Invalid file format'}, 400


@app.route('/api/product/<int:product_id>/upload-image', methods=['POST'])
@auth_required("token")
@roles_required("Admin")
def upload_product_image(product_id):
    if 'image' not in request.files:
        return {'error': 'No image uploaded'}, 400

    image_file = request.files['image']
    if image_file.filename == '':
        return {'error': 'No selected file'}, 400

    if image_file and allowed_file(image_file.filename):
        # Ensure the path exists
        upload_path = f'static/uploads/'
        if not os.path.exists(upload_path):
            os.makedirs(upload_path)

        image = Image.open(image_file)
        # Save the image with the category ID as the name and in the correct format
        image.save(f'{upload_path}/{product_id}_pro_image.{image.format.lower()}')
        image_path = f'/static/uploads/{product_id}_pro_image.{image.format.lower()}'

        # Update the database with the image path
        product = Product.query.filter_by(id=product_id).first()
        if product:
            product.image = image_path
            db.session.commit()
            return {'message': 'Image uploaded successfully'}, 200
        else:
            return {'error': 'Category not found'}, 404
    else:
        return {'error': 'Invalid file format'}, 400


#/Buy/userid

    
@app.get('/download_csv')
@auth_required("token")
@roles_required("Manager")
def download_csv():
    task = create_resource_csv.delay()
    return jsonify({"task-id": task.id})
    

@app.get('/get-csv/<task_id>')
def get_csv(task_id):
    res = AsyncResult(task_id)
    if res.ready():
        filename = res.result
        return send_file(filename, as_attachment=True)
    else:
        return jsonify({"message": "Task Pending"}), 404
    # task = create_resource_csv.AsyncResult(task_id)
    # if task.state == 'PENDING':
    #     return jsonify({"message": "Task Pending"}), 202
    # elif task.state == 'SUCCESS':
    #     file = task.result
    #     return send_file(file, as_attachment=True)
    # else:
    #     return jsonify({"message": "Task Failed"}), 400

@celery_app.on_after_configure.connect
def send_email(sender, **kwargs):
    sender.add_periodic_task(
        crontab(hour=14, minute=20),
        daily_reminder.s('saisatya161734@gmail.com', 'Daily Test'),
    )

@celery_app.on_after_configure.connect
def send_report(sender, **kwargs):
    sender.add_periodic_task(
        crontab(hour=14, minute=21),
        monthly_report.s('saisatya161734@gmail.com', 'Monthly Report'),)
    







    
@socketio.on('connect', namespace='/Bought')
def test_connect():
    print('Client connected')

@socketio.on('disconnect', namespace='/Bought')
def test_disconnect():
    print('Client disconnected')


    


if __name__ == '__main__':
    socketio.run(app, debug=True)
