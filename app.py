from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///marshakdesigns.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'your-secret-key-here'

db = SQLAlchemy(app)

# Contact form model — this is what gets saved to the database
class Contact(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    business = db.Column(db.String(120))
    service = db.Column(db.String(120))
    message = db.Column(db.Text)
    date_submitted = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<Contact {self.name} - {self.email}>'

# Routes
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
    return jsonify({'success': True, 'message': 'Message received!'})

# View all submissions (your admin view)
@app.route('/admin/contacts')
def admin_contacts():
    contacts = Contact.query.order_by(Contact.date_submitted.desc()).all()
    return render_template('admin.html', contacts=contacts)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)