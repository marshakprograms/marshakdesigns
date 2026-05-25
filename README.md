# MarshaK Designs

**Business Operations & Digital Platform Solutions**  
Custom web applications, dashboards, and workflow platforms built for small businesses and startups.

> Stop running your business on workarounds. Let's build something real.

---

## About
MarshaK Designs builds custom digital platforms that help small businesses and startups streamline operations, manage clients, and grow with confidence — built custom, start to finish, and owned by you forever.

**Starting at $800 · $50/month maintenance**

---

## Tech Stack
- Python / Flask
- SQLAlchemy / SQLite
- Flask-Login / Flask-Mail
- HTML / CSS / JavaScript
- Google Fonts (Syne, DM Sans)

---

## Features
- Dynamic landing page with animated globe and EKG chart
- Mobile responsive with hamburger navigation
- Contact form with validation and database tracking
- SMS notifications via email-to-SMS gateway
- Admin dashboard protected by login authentication
- About page with full story and philosophy
- Pricing section with shuffle card animation
- Why Choose Me comparison table
- Lightbox project viewer
- SEO meta tags and Open Graph support
- robots.txt with admin page protection

---

## Project Structure
marshakdesigns/
├── app.py                  ← Flask backend
├── create_admin.py         ← Admin account management
├── requirements.txt        ← Python dependencies
├── Procfile                ← Railway deployment config
├── README.md
├── .gitignore
├── templates/
│   ├── index.html          ← Main landing page
│   ├── about.html          ← About page
│   ├── admin.html          ← Admin dashboard
│   └── login.html          ← Admin login
└── static/
├── css/style.css       ← All styling
├── js/main.js          ← All JavaScript
└── images/             ← Project screenshots

---

## Setup

### 1. Install dependencies
```bash
pip install -r requirements.txt
```

### 2. Create your `.env` file
Create a file called `.env` in the root folder with these values:
MAIL_USERNAME=your_gmail_address@gmail.com
MAIL_PASSWORD=your_16_character_app_password
SECRET_KEY=any_long_random_string_you_create
SMS_RECIPIENT=your_phone_number@vtext.com
FLASK_DEBUG=False

> Note: `.env` is never committed to GitHub. It stays on your machine only.

### 3. Create your admin account
```bash
python create_admin.py
```

### 4. Run the app
```bash
python app.py
```

Then visit `http://127.0.0.1:5000`

---

## Admin Access
Go to `/admin/contacts` to view form submissions.  
Go to `/login` to sign in.  
Run `create_admin.py` to create or update your admin credentials.

---

## Contact
hello@marshakdesigns.com  
[marshakdesigns.com](https://marshakdesigns.com)