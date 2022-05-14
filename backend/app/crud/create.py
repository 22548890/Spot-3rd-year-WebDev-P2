from app import app, db
from app.models import User, Group, Membership, Post, Comment, Hashtag, token_required

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
    
    group = Group.query.filter_by(name=name).first()
    
    if group:
        return {
            'success': False,
            'msg': 'This name already exists'
        }
    group = Group(name=name)
    db.session.add(group)
    db.session.commit()

    membership = Membership(group_id=group.id, user_id=current_user.id, admin=True)

    # current_user.memberships.append(membership)
    # group.memberships.append(membership)

    db.session.add(membership)
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
        membership = Membership(group_id=group.id, user_id=current_user.id, admin=True)
    else:
        if current_user in group.users:
            return {
                'success': False,
                'msg': 'Already in group',
                'name': current_user.id
            }
        membership = Membership(group_id=group.id, user_id=current_user.id, admin=False)

    # current_user.memberships.append(membership)
    # group.memberships.append(membership)

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
    group_name = request.json['group_name']
    hashtags = request.json['hashtags']

    group = Group.query.filter_by(name=group_name).first()

    if not group:
        return {
            'success': False,
            'msg': 'Group does not exist'
        }
    
    if len(hashtags) < 3 or not isinstance(hashtags, list):
        return {
            'success': False,
            'msg': 'You need at least 3 hashtags'
        }

    hashtags_text = ""
    for hashtag in hashtags:
        hashtags_text += '#' + hashtag 

    post = Post(text=text, video_url=video_url, longitude=longitude, latitude=latitude, hashtags_text=hashtags_text)

    current_user.posts.append(post)
    group.posts.append(post)

    db.session.add(post)
    db.session.commit()

    for hashtag in hashtags:
        tag = Hashtag.query.filter_by(tag=hashtag).first()
        if not tag:
            tag = Hashtag(hashtag)
        post.hashtags.append(tag)
        db.session.add(tag)
        db.session.commit()

    return {
        'success': True,
        'user_name': current_user.username,
        'group_name': group_name,
        'hashtags': hashtags_text
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

@app.route('/friend/add', methods = ['POST'])
@cross_origin()
@token_required
def friend_add(current_user):
    user_id = request.json['user_id']
    user = User.query.get(user_id)
    current_user.friends.append(user)

    db.session.commit()
    return {
        'success': True
    }

# @app.route('/friend/request', methods = ['POST'])
# @cross_origin()
# @token_required
# def friend_add(current_user):
#     username = request.json['username']

#     friend = User.query.filter_by(username=username).first()

#     if not friend:
#         return {
#             'success': False,
#             'msg': 'User does not exist'
#         }

#     fship = Friendship.query.get((current_user.id, friend.id))
#     if fship:
#         if fship.accepted:
#             return {
#                 'success': False,
#                 'msg': 'Already friends'
#             }
#         else:
#             return {
#                 'success': False,
#                 'msg': 'Request already sent'
#             }

#     fship = Friendship.query.get((friend.id, current_user.id))
#     if fship:
#         if fship.accepted:
#             return {
#                 'success': False,
#                 'msg': 'Already friends'
#             }
#         else:
#             return {
#                 'success': False,
#                 'msg': 'Request already received'
#             }

#     friendship = Friendship(friend_request_from_id=current_user.id, friend_request_to_id=friend.id)

#     db.session.add(friendship)
#     db.session.commit()
    
#     return {
#         'success': True
#     }