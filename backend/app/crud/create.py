from app import app, db
from app.models import User, Group, Post, Comment, token_required
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
from datetime import datetime, timedelta

from flask import request

@app.route('/register', methods = ['POST'])
def register():
    username = request.json['username']
    email = request.json['email']
    password = request.json['password']
    avatar_url = request.json['avatar_url']

    user_exist = User.query.filter_by(username=username).first()

    if user_exist:
        return {
            'success': False,
            'msg': 'This username already exists'
        }

    user = User(username=username, email=email, avatar_url=avatar_url, password_hash=generate_password_hash(password))

    db.session.add(user)
    db.session.commit()

    return {
        'success': True,
    }

@app.route('/login', methods = ['POST'])
def login():
    username = request.json['username']
    password = request.json['password']

    user_exist = User.query.filter_by(username=username).first()

    if not user_exist:
        return {
            'success': False,
            'msg': 'This username does not exists'
        }

    user = User.query.get(user_exist.id)

    if check_password_hash(user.password_hash, password):
        token = jwt.encode({'id':user.id, 'exp':datetime.utcnow()+timedelta(hours=1)}, app.config['SECRET_KEY'], algorithm="HS256")
        return {
            'success': True,
            'token':token.decode("utf-8")
        }
    else:
        return {
            'success': False,
            'msg': 'Incorrect password'
        }

@app.route('/group/create', methods = ['POST'])
@token_required
def group_create(current_user):
    name = request.json['name']
    
    group_exist = User.query.filter_by(name=name).first()
    
    if group_exist:
        return {
            'success': False,
            'msg': 'This name already exists'
        }

    group= Group(name=name)
    group.users.append(current_user)
    group.admins.append(current_user)

    db.session.add(group)
    db.session.commit()

    return {
        'success': True,
    }

# @app.route('/group/join', methods = ['POST'])
# @token_required
# def group_join(current_user):
#     name = request.json['name']

#     group = Group(name=name)


#     return

@app.route('/post', methods = ['POST'])
@token_required
def post(current_user):
    text = request.json['text']
    video_url = request.json['video_url']
    longitude = request.json['longitude']
    latitude = request.json['latitude']
    category = request.json['category']
    group_name = request.json['group_name']

    post = Post(text=text, video_url=video_url, longitude=longitude, latitude=latitude, category=category)
    group = Group.query.filter_by(name=group_name).first()

    current_user.posts.append(post)
    group.posts.append(post)

    db.session.add(post)
    db.session.commit()

    return {
        'text': text,
        'video_url': video_url,
        'longitude': longitude,
        'latitude': latitude,
        'category': category,
        'user_name': current_user.username,
        'group_name': group_name
    }