#  Farm Procurement System

A role-based digital agricultural platform that connects **Farmers, Quality Inspectors, Procurement Officers, and Admins** to streamline produce submission, quality inspection, and procurement.

---

##  Tech Stack

### Frontend
- React.js (Vite)
- React Router
- Context API (State Management)
- Axios / Fetch API
- CSS / Responsive UI

### Backend
- Spring Boot
- REST APIs
- Spring Data JPA
- JWT / Session-based Auth (optional)

### Database
- MySQL

---

##  User Roles

###  Farmer
- Submit produce
- View produce history
- Track approval / rejection status

###  Quality Inspector
- View pending produce
- Inspect and grade produce
- Approve / Reject submissions

###  Procurement Officer
- View approved produce
- Create purchase orders
- Track procurement history

###  Admin
- Manage users
- View inventory
- Monitor system activity

---

##  Key Features

✔ Role-based dashboards  
✔ Dynamic forms  
✔ REST API integration  
✔ MySQL integration  
✔ State management using React Context  
✔ Status workflow visualization  
✔ Responsive UI design  
✔ Real-time user login tracking  

---

##  Authentication & Authorization

- Role-based login
- Backend validation using Spring Boot
- Login status tracking using MySQL (`is_logged_in` flag)

---
