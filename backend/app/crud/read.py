from app import app, db
from app.models import User, Group, Post, Comment, token_required
from app.models import user_schema, users_schema, post_schema, posts_schema, comment_schema, comments_schema

from flask import jsonify
from sqlalchemy import desc

@app.route('/get-all-posts', methods=['GET']) # only for testing
def getallposts():
    posts = Post.query.order_by(desc('date'))
    results = posts_schema.dump(posts)
    return jsonify(results)

@app.route('/myprofile', methods=['GET'])
@token_required
def myprofile(current_user):
    result =  user_schema.dump(current_user)
    return jsonify(result)