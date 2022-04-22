from app import app, db
from app.models import User, token_required

@app.route('/hello', methods=['GET'])
@token_required
def hello(current_user):
    return current_user.username