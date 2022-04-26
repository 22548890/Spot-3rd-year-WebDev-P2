from app import app, db
from app.models import User, Group, Membership, Post, Comment, token_required

from werkzeug.security import generate_password_hash, check_password_hash
import jwt
from datetime import datetime, timedelta
from flask import request
from flask_cors import cross_origin

@app.route('/register', methods = ['POST'])
@cross_origin()
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
        'success': True
    }

@app.route('/login', methods = ['POST'])
@cross_origin()
def login():
    username = request.json['username']
    password = request.json['password']

    user = User.query.filter_by(username=username).first()

    if not user:
        return {
            'success': False,
            'msg': 'This username does not exists'
        }

    if check_password_hash(user.password_hash, password):
        token = jwt.encode({'id':user.id, 'exp':datetime.utcnow()+timedelta(hours=1)}, app.config['SECRET_KEY'], algorithm="HS256")
        return {
            'success': True,
            'token':token.decode('utf8') #!
        }
    else:
        return {
            'success': False,
            'msg': 'Incorrect password'
        }

@app.route('/group/create', methods = ['POST'])
@cross_origin()
@token_required
def group_create(current_user):
    name = request.json['name']
    
    group_exist = Group.query.filter_by(name=name).first()
    
    if group_exist:
        return {
            'success': False,
            'msg': 'This name already exists'
        }

    group= Group(name=name)
    membership = Membership(admin=True)

    current_user.memberships.append(membership)
    group.memberships.append(membership)

    db.session.add(group, membership)
    db.session.commit()

    return {
        'success': True
    }

@app.route('/group/join', methods = ['POST'])
@cross_origin()
@token_required
def group_join(current_user):
    name = request.json['name']

    group = Group.query.filter_by(name=name).first()

    if not group:
        return {
            'success': False,
            'msg': 'Group does not exist'
        }

    if not Membership.query.first():
        membership = Membership(admin=True)
    else:
        if current_user in group.users:
            return {
                'success': False,
                'msg': 'Already in group',
                'name': current_user.id
            }
        membership = Membership(admin=False)

    current_user.memberships.append(membership)
    group.memberships.append(membership)

    db.session.add(membership)
    db.session.commit()
    
    return {
        'success': True
    }

@app.route('/post', methods = ['POST'])
@cross_origin()
@token_required
def post(current_user):
    text = request.json['text']
    video_url = request.json['video_url']
    longitude = request.json['longitude']
    latitude = request.json['latitude']
    category = request.json['category']
    group_name = request.json['group_name']

    group = Group.query.filter_by(name=group_name).first()

    if not group:
        return {
            'success': False,
            'msg': 'Group does not exist'
        }

    post = Post(text=text, video_url=video_url, longitude=longitude, latitude=latitude, category=category)

    current_user.posts.append(post)
    group.posts.append(post)

    db.session.add(post)
    db.session.commit()

    return {
        'success': True,
        'user_name': current_user.username,
        'group_name': group_name
    }

@app.route('/comment', methods = ['POST'])
@cross_origin()
@token_required
def comment(current_user):
    text = request.json['text']
    post_id = request.json['post_id']

    post = Post.query.get(post_id)

    if not post:
        return {
            'success': False,
            'msg': 'Post does not exist'
        }

    comment = Comment(text=text)

    current_user.comments.append(comment)
    post.comments.append(comment)

    db.session.add(comment)
    db.session.commit()

    return {
        'success': True,
        'post_id': post_id,
        'user': current_user.username
    }