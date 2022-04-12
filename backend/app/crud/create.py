from app import app, db
from app.models import User

from flask import request

@app.route('/register', methods = ['POST'])
def register():
    username = request.json['username']
    password = request.json['password']

    user = User(username, password)
    db.session.add(user)
    db.session.commit()

    return {
        "username": username,
        "password": password
    }