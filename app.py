from flask import Flask, render_template, request, jsonify, redirect, url_for, flash
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
from flask_mail import Mail, Message
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///marshakdesigns.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'your-secret-key-here'

# Mail configuration
app.config['MAIL_SERVER']   = 'smtp.gmail.com'
app.config['MAIL_PORT']     = 587
app.config['MAIL_USE_TLS']  = True
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')

db   = SQLAlchemy(app)
mail = Mail(app)
login_manager = LoginManager(app)
login_manager.login_view = 'login'

# ── MODELS ──

class Admin(UserMixin, db.Model):
    id       = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)

class Contact(db.Model):
    id             = db.Column(db.Integer, primary_key=True)
    name           = db.Column(db.String(100), nullable=False)
    email          = db.Column(db.String(120), nullable=False)
    business       = db.Column(db.String(120))
    service        = db.Column(db.String(120))
    message        = db.Column(db.Text)
    date_submitted = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<Contact {self.name} - {self.email}>'

@login_manager.user_loader
def load_user(user_id):
    return Admin.query.get(int(user_id))

# ── ROUTES ──

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/contact', methods=['POST'])
def contact():
    data = request.get_json()
    new_contact = Contact(
        name=data.get('name'),
        email=data.get('email'),
        business=data.get('business'),
        service=data.get('service'),
        message=data.get('message')
    )
    db.session.add(new_contact)
    db.session.commit()

    # Send SMS notification via email-to-SMS gateway
    try:
        msg = Message(
            subject='New Contact',
            sender=os.getenv('MAIL_USERNAME'),
            recipients=['9198089656@vtext.com']
        )
        msg.body = f"marshakdesigns.com: New inquiry from {data.get('name')} - {data.get('email')}. Login at marshakdesigns.com/admin/contacts to view."
        mail.send(msg)
    except Exception as e:
        print(f'SMS notification failed: {e}')

    return jsonify({'success': True, 'message': 'Message received!'})

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
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

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        if not Admin.query.first():
            admin = Admin(
                username='marsha',
                password=generate_password_hash('changeme123')
            )
            db.session.add(admin)
            db.session.commit()
            print('Default admin created — username: marsha, password: changeme123')
    app.run(debug=True)