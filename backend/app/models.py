from flask import request, jsonify
from datetime import datetime
from functools import wraps
import jwt

from app import db, ma, app

###################
# Secondary tables
###################

group_user = db.Table('group_user',
    db.Column('group_id', db.Integer, db.ForeignKey('group.id')),
    db.Column('user_id', db.Integer, db.ForeignKey('user.id'))    
)

group_admin = db.Table('group_admin',
    db.Column('group_id', db.Integer, db.ForeignKey('group.id')),
    db.Column('user_id', db.Integer, db.ForeignKey('user.id'))    
)


###################
#   Main tables
###################

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(32))
    email = db.Column(db.String(32))
    password_hash = db.Column(db.String(128))
    avatar_url = db.Column(db.String(512))

    posts = db.relationship('Post', backref='user')
    comments = db.relationship('Comment', backref='user')
#   groups
#   groups_admin

    def __init__(self, username, email, avatar_url, password_hash):
        self.username = username
        self.email = email
        self.avatar_url = avatar_url
        self.password_hash = password_hash

class Group(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(32))

    posts = db.relationship('Post', backref='group')
    users = db.relationship('User', secondary=group_user, backref='groups')
    admins = db.relationship('User', secondary=group_admin, backref='groups_admin')

    def __init__(self, name):
        self.name = name

class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.Text)
    video_url = db.Column(db.String(512))
    date = db.Column(db.DateTime, default=datetime.utcnow)
    longitude = db.Column(db.DECIMAL(6,5))
    latitude = db.Column(db.DECIMAL(6,5))
    category = db.Column(db.String(32)) 
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    group_id = db.Column(db.Integer, db.ForeignKey('group.id'))

    comments = db.relationship('Comment', backref='post')
#   user
#   group

    def __init__(self, text, video_url, longitude, latitude, category):
        self.text = text
        self.video_url = video_url
        self.longitude = longitude
        self.latitude = latitude
        self.category = category    


class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.Text)
    date = db.Column(db.DateTime, default=datetime.utcnow)
    post_id = db.Column(db.Integer, db.ForeignKey('post.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))

#   post
#   user 

    def __init__(self, text):
        self.text = text


###################
#   Schemas
###################

class UserSchema(ma.Schema):
    class Meta:
        fields = ('id', 'username', 'email', 'avatar_url')
user_schema = UserSchema()
users_schema = UserSchema(many=True)

class GroupSchema(ma.Schema):
    class Meta:
        fields = ('id', 'name')
group_schema = GroupSchema()
groups_schema = GroupSchema(many=True)

class PostSchema(ma.Schema):
    class Meta:
        fields = ('id', 'text','video_url', 'date', 'longitude', 'latitude', 'category', 'user.username', 'group.name')
post_schema = PostSchema()
posts_schema = PostSchema(many=True)

class CommentSchema(ma.Schema):
    class Meta:
        fields = ('id', 'text', 'date', 'user.username')
comment_schema = CommentSchema()
comments_schema = CommentSchema(many=True)


###################
#  Authentication
###################

def token_required(f):
   @wraps(f)
   def decorator(*args, **kwargs):
       token = None
       if 'access-token' in request.headers:
           token = request.headers['access-token']
 
       if not token:
           return jsonify({'message': 'a valid token is missing'})
       try:
           data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
           current_user = User.query.filter_by(id=data['id']).first()
       except:
           return jsonify({'message': 'token is invalid'})
 
       return f(current_user, *args, **kwargs)
   return decorator


db.create_all()
db.session.commit()