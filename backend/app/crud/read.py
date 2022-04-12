from email.policy import default
from app import app
from app import models

@app.route('/hello', methods=['GET'])
def hello():
    return models.MESSAGES['default']