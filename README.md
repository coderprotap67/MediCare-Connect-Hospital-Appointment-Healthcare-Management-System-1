# 🏥 MediCare Connect – Hospital Appointment & Healthcare Management System
**MediCare Connect** is a modern, full-stack healthcare management platform designed to connect patients, doctors, and hospital administrators through a seamless digital ecosystem. It simplifies medical appointment bookings, secures health record management, integrates Stripe payment gateways, and offers real-time analytics.

---

## 🔗 Project Links & Credentials

- **🌐 Live Web Application:** [https://healthcare-management-taupe.vercel.app](https://healthcare-management-taupe.vercel.app)
- **💻 Client Repository:** [GitHub Client Repo](https://github.com/coderprotap67/MediCare-Connect-Hospital-Appointment-Healthcare-Management-System-1.git)
- **🖥️ Server Repository:** [GitHub Server Repo](https://github.com/coderprotap67/MediCare-Connect-Hospital-Appointment-Healthcare-Management-System-2.git)

### 🔐 Admin Demo Credentials
- **Admin Email:** `admin@medicare.com`
- **Admin Password:** `Admin@12345`

---

## 📌 Table of Contents
- [Key Features](#-key-features)
- [Role-Based Dashboards](#-role-based-dashboards)
- [Challenges Implemented](#-challenges-implemented)
- [Optional Features Implemented](#-optional-features-implemented)
- [Tech Stack](#-tech-stack)
- [Database Schema (MongoDB Collections)](#-database-schema-mongodb-collections)
- [Environment Variables Setup](#-environment-variables-setup)
- [Local Installation & Setup](#-local-installation--setup)

---

## ✨ Key Features

- **🔒 Secure Authentication:** JWT-based user authentication supporting Email/Password with strong password validation & Google OAuth login.
- **💳 Stripe Payment Gateway:** Secure consultation fee payments via Stripe before appointment confirmation.
- **📱 Responsive Hybrid Layout:** Mobile-friendly view switcher (Card View for mobile/tablet & Table View for desktop screens).
- **🎨 Dark/Light Mode:** Seamless theme switching powered by `next-themes`.
- **✨ Framer Motion Animations:** Smooth animations applied across core landing page sections.
- **📊 Recharts Analytics:** Data visualization charts for tracking appointments, doctors, and revenue in the Admin Dashboard.
- **🔔 Toast & Alert System:** Instant user feedbacks for status updates, errors, and booking confirmations.

---

## 👥 Role-Based Dashboards

### 👨‍🌾 1. Patient Dashboard
- **Overview:** Displays upcoming appointments, transaction summaries, and payment history.
- **My Appointments (CRUD):** View booked appointments, reschedule dates/slots, or cancel pending requests.
- **Payment History:** Detailed list of completed transactions with Stripe transaction IDs.
- **My Reviews (CRUD):** Add, update, or delete doctor reviews and ratings.

### 🩺 2. Doctor Dashboard
- **Overview:** Daily appointment schedule overview, total patients served, and overall rating summaries.
- **Schedule Management (CRUD):** Add, update, or remove available consultation days and time slots.
- **Appointment Requests:** Accept or reject appointment requests. Marking an appointment as "Completed" automatically navigates to Prescription Management.
- **Prescription Management (CRUD):** Create and update digital prescriptions with diagnosis details, prescribed medications, and medical notes.
- **Profile Management:** Update doctor qualifications, experience, consultation fees, and hospital affiliations.

### 👑 3. Admin Dashboard
- **Overview & Analytics:** Recharts analytics displaying doctor performance, revenue trends, and user growth.
- **Manage Users:** Monitor registered users, suspend non-compliant accounts, or delete users.
- **Manage Doctors:** Review and verify newly registered doctor profiles, approve status, or revoke verification.
- **Manage Appointments & Payments:** Full oversight of platform appointments, payment records, and system health.

---


---

## 🌟 Optional Features Implemented

- **Option 1:** Dark/Light Theme Toggle with state persistence across browser reloads.
- **Option 4:** Layout Format Switcher (Responsive Table View to Card Grid Format).

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS, DaisyUI
- **Animations:** Framer Motion
- **Charts:** Recharts
- **Icons:** Lucide React

### Backend
- **Runtime:** Node.js, Express.js
- **Database:** MongoDB Atlas (Native MongoDB Node Driver / Mongoose)
- **Authentication:** JSON Web Tokens (JWT), Firebase Auth
- **Payments:** Stripe API

---

## 🗄️ Database Schema (MongoDB Collections)

The application utilizes **6 structured MongoDB collections**:

1. **`users`**: Stores patient, doctor, and admin base account details.
2. **`doctors`**: Stores specialization, experience, consultation fees, schedules, and verification status.
3. **`appointments`**: Manages patient-doctor booking requests, date/time, status, and symptoms.
4. **`reviews`**: Holds patient feedback, ratings, and doctor reviews.
5. **`payments`**: Tracks Stripe payment transaction logs (`transactionId`, `amount`, `paymentDate`).
6. **`prescriptions`**: Records doctor diagnosis, dosage, medication plans, and medical notes.
