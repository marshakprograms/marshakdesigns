from flask import Flask, render_template, request, jsonify, redirect, url_for, flash, send_from_directory
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required
from flask_mail import Mail, Message
from werkzeug.security import check_password_hash
from datetime import datetime
import os
import re
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///marshakdesigns.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')

# Fail fast if SECRET_KEY is missing
if not app.config['SECRET_KEY']:
    raise ValueError("SECRET_KEY is missing. Add it to your .env file.")

# Mail configuration
app.config['MAIL_SERVER']   = 'smtp.gmail.com'
app.config['MAIL_PORT']     = 587
app.config['MAIL_USE_TLS']  = True
app.config['MAIL_TIMEOUT'] = 10
app.config['MAIL_SUPPRESS_SEND'] = False
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_USERNAME')

db = SQLAlchemy(app)
mail = Mail(app)

login_manager = LoginManager(app)
login_manager.login_view = 'login'

limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=[]
)

# ── MODELS ──

class Admin(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)


class Contact(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    phone = db.Column(db.String(20))
    business = db.Column(db.String(120))
    service = db.Column(db.String(120))
    message = db.Column(db.Text)
    date_submitted = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<Contact {self.name} - {self.email}>'


@login_manager.user_loader
def load_user(user_id):
    return db.session.get(Admin, int(user_id))


# ── ROUTES ──

@app.route('/')
def index():
    return render_template('index.html')


@app.route('/about')
def about():
    return render_template('about.html')


@app.route('/robots.txt')
def robots():
    return send_from_directory('static', 'robots.txt')


@app.route('/contact', methods=['POST'])
@limiter.limit("3 per minute")
def contact():
    data = request.get_json()

    if not data or not data.get('name') or not data.get('email'):
        return jsonify({
            'success': False,
            'message': 'Name and email are required.'
        }), 400

    name = data.get('name', '').strip()
    email = data.get('email', '').strip()
    phone = data.get('phone', '').strip()
    business = data.get('business', '').strip()
    service = data.get('service', '').strip()
    message = data.get('message', '').strip()

    email_pattern = r'^[^\s@]+@[^\s@]+\.[^\s@]+$'

    if not re.match(email_pattern, email):
        return jsonify({
            'success': False,
            'message': 'Please enter a valid email address.'
        }), 400

    new_contact = Contact(
        name=name,
        email=email,
        phone=phone,
        business=business,
        service=service,
        message=message
    )

    db.session.add(new_contact)
    db.session.commit()

    sms_recipient = os.getenv('SMS_RECIPIENT')
    
    try:
        msg = Message(
            subject='New Contact - MarshaK Designs',
            recipients=['marshakdesigns@gmail.com']
        )

        msg.body = (
            f"New website inquiry received.\n\n"
            f"Name: {name}\n"
            f"Email: {email}\n"
            f"Phone: {phone}\n"
            f"Business: {business}\n"
            f"Service: {service}\n\n"
            f"Message:\n{message}\n\n"
            f"View all leads:\n"
            f"https://web-production-97833.up.railway.app/admin/contacts"
        )

        mail.send(msg)

    except Exception as e:
        print(f'Notification failed: {e}')
        

    return jsonify({
        'success': True,
        'message': 'Message received!'
    })


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username', '').strip()
        password = request.form.get('password', '')

        admin = Admin.query.filter_by(username=username).first()

        if admin and check_password_hash(admin.password, password):
            login_user(admin)
            return redirect(url_for('admin_contacts'))

        flash('Invalid username or password')

    return render_template('login.html')


@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('login'))


@app.route('/admin/contacts')
@login_required
def admin_contacts():
    contacts = Contact.query.order_by(Contact.date_submitted.desc()).all()
    return render_template('admin.html', contacts=contacts)


@app.errorhandler(429)
def ratelimit_handler(e):
    return jsonify({
        'success': False,
        'message': 'Too many submissions. Please wait a minute and try again.'
    }), 429


@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404


if __name__ == '__main__':
    with app.app_context():
        db.create_all()

        if not Admin.query.first():
            print('No admin found. Create one using create_admin.py')

    debug_mode = os.getenv('FLASK_DEBUG', 'False') == 'True'
    app.run(debug=debug_mode)