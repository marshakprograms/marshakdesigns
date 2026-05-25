# MarshaK Designs

**Business Operations & Digital Platform Solutions**  
Modern websites, workflow systems, operational dashboards, and custom digital platforms built to help small businesses streamline operations, improve client experience, and scale with confidence.

> Stop running your business on workarounds. Let's build something real.

---

## About

MarshaK Designs builds custom digital platforms that help small businesses and startups streamline operations, manage clients, and grow with confidence — built custom, start to finish, and owned by you forever.

**Starting at $800 · $50/month maintenance**

---

## Business Focus

MarshaK Designs specializes in helping small businesses move beyond disconnected tools, manual processes, and outdated web experiences by creating centralized digital systems tailored to their operations.

The platform combines modern frontend design with business workflow automation to create solutions that are both visually polished and operationally effective.

---

## 🔧 Key Technical Highlights

- Full-stack Flask web application architecture
- Responsive mobile-first frontend design
- Dynamic JavaScript-driven UI interactions
- Contact management and admin dashboard system
- SMS notification integration
- Authentication-protected admin workflows
- SEO optimization and Open Graph support
- Deployment-ready Railway configuration
- Custom branded design system and animations

---

## 🛠 Tech Stack

- Python / Flask
- SQLAlchemy / SQLite
- Flask-Login / Flask-Mail
- HTML / CSS / JavaScript
- Google Fonts (Syne, DM Sans)

---

## ✨ Features

- Dynamic landing page with animated globe and EKG chart
- Mobile responsive design with hamburger navigation
- Contact form with validation and database tracking
- SMS notifications via email-to-SMS gateway
- Admin dashboard protected by login authentication
- About page with story, philosophy, and branding
- Pricing section with animated service cards
- "Why Choose Me" business comparison table
- Lightbox project viewer
- SEO meta tags and Open Graph support
- robots.txt with admin page protection

---

## 📁 Project Structure

```text
marshakdesigns/
├── app.py                  # Flask backend
├── create_admin.py         # Admin account management
├── requirements.txt        # Python dependencies
├── Procfile                # Railway deployment configuration
├── README.md
├── .gitignore
├── templates/
│   ├── index.html          # Main landing page
│   ├── about.html          # About page
│   ├── admin.html          # Admin dashboard
│   └── login.html          # Admin login
└── static/
    ├── css/style.css       # Styling and animations
    ├── js/main.js          # JavaScript interactions
    └── images/             # Project screenshots and branding
```

---

## 🚀 Local Development Setup

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

---

### 2. Create Environment Variables

Create a `.env` file in the project root:

```env
MAIL_USERNAME=your_gmail_address@gmail.com
MAIL_PASSWORD=your_16_character_app_password
SECRET_KEY=your_long_random_secret_key
SMS_RECIPIENT=your_phone_number@vtext.com
FLASK_DEBUG=False
```

> Note: `.env` files are excluded from GitHub using `.gitignore`.

---

### 3. Create Admin Account

```bash
python create_admin.py
```

---

### 4. Run the Application

```bash
python app.py
```

Visit:

```text
http://127.0.0.1:5000
```

---

## 🔐 Admin Access

- `/admin/contacts` → View contact submissions
- `/login` → Admin login page

Use `create_admin.py` to create or update admin credentials.

---

## 🚀 Deployment

The application is structured for cloud deployment using Railway with environment-based configuration management for secure production hosting.

---

## 📬 Contact

- hello@marshakdesigns.com
- https://marshakdesigns.com

---

## 👩🏽‍💻 Author

**Marsha K. Shearin**  
Founder of MarshaKDesigns  
Business Operations & Platform Developer  
Durham, NC

GitHub: [@MarshaKDesigns-Dev](https://github.com/MarshaKDesigns-Dev)

---

## 📄 License

© MarshaK Designs. All rights reserved.