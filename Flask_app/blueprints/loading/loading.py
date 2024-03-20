from flask import Blueprint, render_template

loading_bp = Blueprint('loading', __name__, template_folder='templates')

@loading_bp.route('/loading', methods=['GET'])
def loading():
    return render_template('loading/loading.html')
