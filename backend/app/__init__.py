from flask import Flask
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:1234@localhost/test'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
# SECRET_KEY = "flask-app-secret-key-change-it"
# JWT_SECRET_KEY = "jwt-app-secret-key-change-it"
# JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)

db = SQLAlchemy(app)

from .crud import create, read, update, delete