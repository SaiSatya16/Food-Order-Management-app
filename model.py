from flask_sqlalchemy import SQLAlchemy
from flask_security import UserMixin, RoleMixin

db = SQLAlchemy()


class RolesUsers(db.Model):
    __tablename__ = 'roles_users'
    id = db.Column(db.Integer(), primary_key=True)
    user_id = db.Column('user_id', db.Integer(), db.ForeignKey('user.id'))
    role_id = db.Column('role_id', db.Integer(), db.ForeignKey('role.id'))

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=False)
    email = db.Column(db.String, unique=True)
    password = db.Column(db.String(255))
    active = db.Column(db.Boolean())
    fs_uniquifier = db.Column(db.String(255), unique=True, nullable=False)
    roles = db.relationship('Role', secondary='roles_users',
                         backref=db.backref('users', lazy='dynamic'))

class Role(db.Model, RoleMixin):
    id = db.Column(db.Integer,primary_key = True,autoincrement = True)
    name = db.Column(db.String,nullable = False,unique = True)
    description = db.Column(db.String,nullable = False)



class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True,autoincrement = True)
    name = db.Column(db.String(100), nullable=False)
    active = db.Column(db.Boolean())
    image = db.Column(db.String(100))
    product_relation = db.relationship("Product",backref="category_relation", secondary="association") 
    Vegetarian = db.Column(db.Boolean())

class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True,autoincrement = True)
    name = db.Column(db.String(100), nullable=False)
    rate = db.Column(db.Integer, nullable=False)
    image = db.Column(db.String(100))
    active = db.Column(db.Boolean())
    category_id=db.Column(db.Integer, db.ForeignKey("category.id"), nullable=False)
    Vegetarian = db.Column(db.Boolean())

class Cart(db.Model):
    id = db.Column(db.Integer, primary_key=True,autoincrement = True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    product_id=db.Column(db.Integer, db.ForeignKey("product.id"), nullable=False)
    product_name=db.Column(db.String(100), nullable=False)
    req_quantity = db.Column(db.Integer,nullable = False)
    product_rate=db.Column(db.Integer, nullable=False)

class Bought(db.Model):
    id = db.Column(db.Integer, primary_key=True,autoincrement = True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    customer_name = db.Column(db.String(100), nullable=False)
    customer_email = db.Column(db.String(100), nullable=False)
    customer_phone = db.Column(db.String(100), nullable=False)
    totalprice = db.Column(db.Integer, nullable=False)
    date = db.Column(db.String(100), nullable=False)
    active = db.Column(db.Boolean())
    checkout = db.Column(db.Boolean())
    product_relation = db.relationship("Products_bought",backref="bought_relation", secondary="bought_product_association")

class Products_bought(db.Model):
    id = db.Column(db.Integer, primary_key=True,autoincrement = True)
    product_id=db.Column(db.Integer, db.ForeignKey("product.id"), nullable=False)
    product_name=db.Column(db.String(100), nullable=False)
    req_quantity = db.Column(db.Integer,nullable = False)
    product_rate=db.Column(db.Integer, nullable=False)
    bought_id = db.Column(db.Integer, db.ForeignKey("bought.id"), nullable=False)

class Bought_product_association(db.Model):
    bought_id = db.Column(db.Integer, db.ForeignKey("bought.id"),primary_key = True, nullable=False)
    products_bought_id = db.Column(db.Integer, db.ForeignKey("products_bought.id"),primary_key = True, nullable=False)
    




class Association(db.Model):
    category_id = db.Column(db.Integer, db.ForeignKey("category.id"),primary_key = True, nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey("product.id"),primary_key = True, nullable=False)
