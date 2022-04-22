from flask import Flask
from flask_marshmallow import Marshmallow
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

app.config['SECRET_KEY'] = 'b3f57e06d27c79f0aaaf21a2a42079be'
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:@localhost/Spot'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
ma = Marshmallow(app)

from .crud import create, read, update, delete