from app import app, db
from app.models import User, Group, Membership, Post, Comment, token_required
from app.models import user_schema, users_schema, post_schema, group_schema, groups_schema, posts_schema, comment_schema, comments_schema

from flask import jsonify
from flask_cors import cross_origin
from sqlalchemy import desc

@app.route('/profile/my', methods=['GET'])
@cross_origin()
@token_required
def myprofile(current_user):
    result =  user_schema.dump(current_user)
    return jsonify(result)

@app.route('/groups/all', methods=['GET'])
@cross_origin()
def getallgroups():
    groups = Group.query.all()
    results = groups_schema.dump(groups)
    return jsonify(results)

@app.route('/groups/my', methods=['GET'])
@cross_origin()
@token_required
def getmygroups(current_user):
    results = groups_schema.dump(current_user.groups)
    return jsonify(results)

@app.route('/feed/main', methods=['GET'])
@cross_origin()
@token_required
def getmainfeed(current_user):
    groups = current_user.groups
    group_ids = [group.id for group in groups]

    posts = Post.query.filter(Post.group_id.in_(group_ids)).order_by(desc('date'))

    results = posts_schema.dump(posts)
    return jsonify(results)

@app.route('/feed/group=<group_id>', methods=['GET'])
@cross_origin()
def getgroupfeed(group_id):
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

@app.route('/comments/post=<post_id>', methods=['GET'])
@cross_origin()
def getcomments(post_id):
    comments = Comment.query.filter_by(post_id=post_id).order_by(desc('date'))

    results = comments_schema.dump(comments)
    return jsonify(results)

@app.route('/friends/requests/to', methods=['GET'])
@cross_origin()
@token_required
def friendsrequeststo(current_user):
    requests_to = current_user.friendships_request_to
    users = [friendship.friend_request_to for friendship in requests_to if friendship.accepted == False]

    results = users_schema.dump(users)
    return jsonify(results)

@app.route('/friends/requests/from', methods=['GET'])
@cross_origin()
@token_required
def friendsrequestsfrom(current_user):
    requests_from = current_user.friendships_request_from
    users = [friendship.friend_request_from for friendship in requests_from if friendship.accepted == False]

    results = users_schema.dump(users)
    return jsonify(results)

@app.route('/friends', methods=['GET'])
@cross_origin()
@token_required
def friends(current_user):
    requests_from = current_user.friendships_request_from
    users = [friendship.friend_request_from for friendship in requests_from if friendship.accepted]
    requests_to = current_user.friendships_request_to
    more_users = [friendship.friend_request_to for friendship in requests_to if friendship.accepted]
    if len(more_users) > 0:
        users.append(more_users)
    results = users_schema.dump(users)
    return jsonify(results)