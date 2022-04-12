from werkzeug.security import generate_password_hash, check_password_hash

from app import db

MESSAGES = {
    'default': "Hello, world!"
}

class User(db.Model):
    username = db.Column(db.String(25), primary_key=True)
    password = db.Column(db.String(128))

    def __init__(self, username, password):
        self.username = username
        self.password = password
        
db.create_all()
db.session.commit()