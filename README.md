# SpendWise 💸  
A Smart Expense & Income Tracking Web Application

---

## 📌 Project Overview

**SpendWise** is a web-based personal finance management application that allows users to track their **income and expenses**, analyze spending behavior, and manage financial data securely.  
The application is built using **React** for the frontend and **Firebase** for authentication and database services.

This project is designed for **educational purposes**, portfolio presentation, and real-world usage learning.

---

## 🚀 Features

### 🔐 User Authentication
- Secure login & signup using Firebase Authentication
- Email and password-based authentication
- Automatic user session handling

### 💰 Expense & Income Management
- Add income and expense transactions
- Categorize transactions using tags
- Store user-specific data securely in Firestore
- Real-time database updates

### 📊 Analytics Dashboard
- Line chart showing income and expense trends
- Pie chart showing category-wise spending
- Visual insights for better financial decisions

### 📋 Transactions Table
- View all transactions in tabular format
- Search transactions by name
- Filter by transaction type (Income / Expense)
- Sort data
- Export transaction history as CSV

### 🎨 User Interface
- Responsive and clean UI
- Built using Ant Design
- Toast notifications for actions and errors
- Reusable and modular components

---

## 🛠 Technology Stack

### Frontend
- React.js
- React Router DOM
- Ant Design (antd)
- @ant-design/charts
- Moment.js

### Backend / Services
- Firebase Authentication
- Firebase Firestore

### Utilities
- PapaParse (CSV export)
- React Toastify (notifications)

---

## 📁 Project Structure

spendwise/
├── public/
│   ├── index.html
│   ├── manifest.json
├── src/
│   ├── assets/
│   ├── components/
│   ├── pages/
│   ├── firebase.js
│   ├── App.js
│   ├── index.js
│   ├── App.css
├── package.json
├── package-lock.json
└── README.md

---

## ⚙️ Installation & Setup

### Step 1: Install Dependencies
npm install

### Step 2: Run Project
npm start

---

## 🔑 Firebase Setup

Create a Firebase project and enable:
- Authentication (Email/Password)
- Firestore Database

Update firebase.js with your credentials.

---

## 🔮 Future Improvements
- Monthly reports
- Budget alerts
- Dark mode
- Mobile optimization

---

## 📄 License

Educational use only.

---

## 👤 Author

SpendWise  
Frontend Project using React & Firebase
