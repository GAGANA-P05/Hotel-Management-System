# 🏨 Hotel Management System

A full-stack **Hotel Management System** built using **Node.js, Express, MySQL, HTML, CSS, Javascript**.  
This project manages hotel rooms, services, staff, customers, and reservations with **database-level safety using triggers, procedures** and **role-based access (Manager vs Customer)**.

---

## 🚀 Features

### 👤 Customer
- View **all rooms** with details (Vacant / Reserved / Maintenance / Deluxe / Standard)
- View **all services** with price and availability
- Search for a particular room and services
- Book **only vacant rooms**
- Book **only available services**
- Customer details are collected during booking
- Simple payment interface

---

### 🧑‍💼 Manager
- Secure **Manager Login** (email and password stored in `.env`)
- Manage **Rooms**
  - Update room status (Vacant / Reserved / Maintenance)
  - Update room price
  - View reservations per room
- Manage **Services**
  - Add, update, delete services
  - Change service availability
- Manage **Staff**
  - Add, update, delete staff
- View:
  - Which rooms are booked by which customers
  - Which services are availed by which reservations

> ⚠️ Only managers can perform **CRUD operations** on rooms, services, and staff.

---

## 🛠️ Tech Stack

### Frontend
- HTML
- CSS
- Vanilla JavaScript

### Backend
- Node.js
- Express.js
- MySQL
- Socket.IO

### Database
- MySQL
- Foreign Keys
- Constraints
- Triggers
- Procedures
- Functions


---

## 🧠 Database Triggers Used

### ✅ Duplicate Prevention
- Prevent duplicate staff insertion
- Prevent duplicate service insertion
- Prevent duplicate customer insertion

### ✅ Validation Triggers
- Customer phone must be exactly 10 digits
- Customers below 18 years cannot book a room
- Rooms can be booked only if Vacant
- Services can be booked only if Available

---

## ▶️ How to Run the Project

### 1️⃣ Clone the repository
```bash
git clone https://github.com/your-username/hotel-management-system.git
cd hotel-management-system
```

### 2️⃣ Install dependencies
```bash
npm install
```

### 3️⃣ Setup `.env`
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=hotel_management

MANAGER1_EMAIL=manager1@hotel.com
MANAGER1_PASSWORD=manager123
```

### 4️⃣ Setup Database
```bash
# Login to MySQL
mysql -u root -p

# Create database and import schema
source database/schema.sql
source database/triggers.sql
```

### 5️⃣ Start the server
```bash
npm run dev
```

### 6️⃣ Open frontend

Open `index.html` in your browser.

---

## 📌 Future Improvements

- React-based frontend
- Payment gateway integration
- Booking cancellation
- Invoice generation
- Email notifications
- Analytics dashboard

---

## 👨‍💻 Author

**Gagana P**  
Computer Science Student  
GitHub: [https://github.com/GAGANA-P05](https://github.com/GAGANA-P05)

---

## 📄 License

This project is licensed under the MIT License.

---
