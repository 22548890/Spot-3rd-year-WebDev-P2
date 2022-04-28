from app import app, db
from app.models import User, Group, Post, Comment, token_required
from app.models import user_schema, users_schema, post_schema, group_schema, groups_schema, posts_schema, comment_schema, comments_schema

from werkzeug.security import generate_password_hash, check_password_hash
from flask import jsonify, request
from flask_cors import cross_origin
from sqlalchemy import desc

@app.route('/profile/delete', methods=['DELETE'])
@cross_origin()
@token_required
def delete_profile(current_user):
    db.session.delete(current_user)
    db.session.commit()
    return {
        'success':True
    }