# GB Medical – Appointment Booking System

🩺 A modern, user-friendly web application that allows patients to book medical appointments online, rate doctors, and receive email confirmations.

📄 Detailed documentation: `docs/Szabó_Gergely_portfólió_kész.pdf`

---

## ⚙️ Technologies Used

- **Frontend**: Angular  
- **Backend**: Java (JAX-RS), WildFly  
- **Database**: MySQL  
- **Containerization**: Docker + Docker Compose  

---

## 🚀 Quick Start (Docker)

Start the entire application with one command in the root directory:

For build: `docker compose up --build`

For stop: `docker compose down`

This launches:

- MySQL (with initialized database gb_medical_idopontfoglalo)

- Backend (Java/WildFly on port 8080)

- Frontend (Angular served on port 80)

👉 Open in browser: http://localhost

✅ CORS is configured automatically inside the backend container.

---

## 🔑 Key Features
Book appointments (only for logged-in users)

Email confirmation upon booking

View and cancel your appointments

Rate doctors with stars and text feedback

Search/filter doctors

Registration with email activation

Password reset via email

Scroll-to-top button

---

## 👨‍💻 Author

Created by Gergely Szabó

GitHub: SzGeri25
