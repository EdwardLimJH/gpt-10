from flask import Blueprint, render_template

confirmation_bp = Blueprint('confirmation', __name__, template_folder='templates')

@confirmation_bp.route('/confirmation', methods=['GET'])
def confirmation():
    return render_template('confirmation/confirmation.html') # or just return blank to Reactjs