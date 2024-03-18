from flask import Blueprint, render_template, request, redirect, url_for

loading_bp = Blueprint('loading', __name__, template_folder='templates')


@loading_bp.route('/loading', methods=['POST'])
def loading():
    data = request.form
    print(f"received form data : {data}")
    return render_template('loading/loading.html', data=data)
