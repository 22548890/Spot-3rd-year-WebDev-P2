from app import app, db
from app.models import User, Group, Membership, Post, Comment, token_required
from app.models import user_schema, users_schema, post_schema, group_schema, groups_schema, posts_schema, comment_schema, comments_schema

from flask import jsonify
from flask_cors import cross_origin
from sqlalchemy import desc, or_
from haversine import haversine, Unit
import geocoder

@app.route('/profile/my', methods=['GET'])
@cross_origin()
@token_required
def myprofile(current_user):
    result =  user_schema.dump(current_user)
    return jsonify(result)

@app.route('/groups/not-my', methods=['GET'])
@cross_origin()
@token_required
def getallgroups(current_user): 
    groups = Group.query.all()
    groups_rest = [group for group in groups if not current_user in group.users]
    results = groups_schema.dump(groups_rest)
    return jsonify(results)

@app.route('/groups/my', methods=['GET'])
@cross_origin()
@token_required
def getmygroups(current_user):
    results = groups_schema.dump(current_user.groups)
    return jsonify(results)

# @app.route('/feed/main', methods=['GET'])
# @cross_origin()
# @token_required
# def getmainfeed(current_user):
#     group_ids = [group.id for group in current_user.groups]
#     friend_ids = [friend.id for friend in current_user.friends]

#     posts = Post.query.filter(or_(Post.group_id.in_(group_ids), Post.user_id.in_(friend_ids))).order_by(desc('date'))

#     results = posts_schema.dump(posts)
#     return jsonify(results)



#
# Note: when group and user unrestricted, send me '%'
#
@app.route('/feed/group=<group_name>&user=<username>&orderby=<orderby>&order=<order>', methods=['GET'])
@cross_origin()
@token_required
def feed(current_user, group_name, username, orderby, order):
    group_ids = [group.id for group in current_user.groups]
    user_ids = [user.id for user in current_user.friends]
    
    group_name += '%'
    username += '%'

    groups = Group.query.filter(Group.id.in_(group_ids), Group.name.like(group_name))

    flatList = [ item for elem in [group.users for group in groups] for item in elem]
    user_ids += [user.id for user in flatList]
    users = User.query.filter(User.id.in_(user_ids), User.username.like(username))

    group_ids = [group.id for group in groups]
    user_ids = [friend.id for friend in users]

    if order == 'asc':
        posts = Post.query.filter(Post.group_id.in_(group_ids), Post.user_id.in_(user_ids)).order_by('date')
    else:
        posts = Post.query.filter(Post.group_id.in_(group_ids), Post.user_id.in_(user_ids)).order_by(desc('date'))
    
    if orderby == 'location':
        posts = [post for post in posts]
        posts.sort(key=distance_to_post)

    results = posts_schema.dump(posts)
    return jsonify(results)


@app.route('/feed/group=<group_id>', methods=['GET'])
@cross_origin()
@token_required
def getgroupfeed(current_user, group_id):
    # group = Group.query.get(group_id)
    # if not group:
    #     return {
    #         'success': False,
    #         'msg': 'Group does not exist'
    #     }

    # if not current_user in group.users:
    #     return {
    #         'success': False,
    #         'msg': 'Not a member of group'
    #     }
    posts = Post.query.filter_by(group_id=group_id).order_by(desc('date'))

    results = posts_schema.dump(posts)
    return jsonify(results)

@app.route('/get/post=<post_id>', methods=['GET']) # should I just use multiple schema?
@cross_origin()
@token_required
def getpost(current_user, post_id):
    post = Post.query.get(post_id)

    result = post_schema.dump(post)
    return jsonify(result)


@app.route('/comments/post=<post_id>', methods=['GET'])
@cross_origin()
@token_required
def getcomments(current_user, post_id):
    comments = Comment.query.filter_by(post_id=post_id).order_by(desc('date'))

    results = comments_schema.dump(comments)
    return jsonify(results)

# @app.route('/friends/requests/to', methods=['GET'])
# @cross_origin()
# @token_required
# def friendsrequeststo(current_user):
#     requests_to = current_user.friendships_request_to
#     users = [friendship.friend_request_to for friendship in requests_to if friendship.accepted == False]

#     results = users_schema.dump(users)
#     return jsonify(results)

# @app.route('/friends/requests/from', methods=['GET'])
# @cross_origin()
# @token_required
# def friendsrequestsfrom(current_user):
#     requests_from = current_user.friendships_request_from
#     users = [friendship.friend_request_from for friendship in requests_from if friendship.accepted == False]

#     results = users_schema.dump(users)
#     return jsonify(results)

@app.route('/friends', methods=['GET'])
@cross_origin()
@token_required
def friends(current_user):
    results = users_schema.dump(current_user.friends)
    return jsonify(results)
    # requests_from = current_user.friendships_request_from
    # users = [friendship.friend_request_from for friendship in requests_from if friendship.accepted]
    # requests_to = current_user.friendships_request_to
    # more_users = [friendship.friend_request_to for friendship in requests_to if friendship.accepted]
    # if len(more_users) > 0:
    #     users.append(more_users)
    # results = users_schema.dump(users)
    # return jsonify(results)

@app.route('/non-friends', methods=['GET'])
@cross_origin()
@token_required
def non_friends(current_user):
    excl_ids = [friend.id for friend in current_user.friends]
    excl_ids.append(current_user.id)
    users = User.query.filter(User.id.not_in(excl_ids))
    results = users_schema.dump(users)
    return jsonify(results)

# @app.route('/users/all', methods=['GET'])  # excluding friends and requested and requests from
# @cross_origin()
# @token_required
# def all_users(current_user): 
#     requests_from = current_user.friendships_request_from
#     users = [friendship.friend_request_from for friendship in requests_from if friendship.accepted]
#     requests_to = current_user.friendships_request_to
#     more_users = [friendship.friend_request_to for friendship in requests_to if friendship.accepted]
#     if len(more_users) > 0:
#         users.append(more_users)
#     results = users_schema.dump(users)
#     return jsonify(results)

@app.route('/timeout', methods=['GET'])
@cross_origin()
@token_required
def timeout(current_user):
    return {
        "timeout":False
    }

def distance_to_post(post):
    g = geocoder.ip('me')
    lat = float(post.latitude)
    lng = float(post.longitude)

    loc1 = (g.lat, g.lng)
    loc2 = (lat, lng)

    return haversine(loc1, loc2)

