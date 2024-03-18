from flask import Blueprint, render_template, request, redirect, url_for

confirmation_bp = Blueprint('confirmation', __name__, template_folder='templates')

@confirmation_bp.route('/confirmation', methods=['GET'])
def confirmation():
    return render_template('confirmation/confirmation.html')