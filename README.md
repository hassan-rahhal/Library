# 📚 Bookify - Online Book Shop

A modern, feature-rich digital library and online bookstore built for book lovers. Explore, rate, review, and organize your favorite reads all in one place.

---

## 🌟 Project Overview

**Bookify** is a comprehensive web application designed by university students to create an engaging digital library experience. Built entirely with HTML, CSS, and JavaScript, it combines clean design, smooth animations, and robust functionality to deliver a premium user experience.

---

## ✨ Key Features

### 🔐 **Authentication & User Management**
- **Multi-Role System**: Customer, Admin, and Super Admin roles
- **Secure Registration & Login**: Email-based authentication
- **Role-Based Access Control**: Different dashboards and permissions per role
- **Session Management**: Persistent login with logout functionality

### 📖 **Book Management**
- **Dynamic Book Catalog**: Display books with covers, titles, authors, and prices
- **Book Details Page**: Comprehensive information with ratings and reviews
- **Search Functionality**: Real-time search by title or author
- **Admin Book CRUD**: Create, read, update, and delete books
- **Image Upload**: Custom book cover uploads with live preview

### ⭐ **Rating & Review System**
- **5-Star Rating System**: Interactive star selection
- **Customer Reviews**: Write and submit detailed book reviews
- **Average Rating Display**: Shows aggregate ratings and review count
- **Review Management**: Users can update their reviews; admins can delete any review
- **Date Tracking**: Timestamps for all reviews

### ❤️ **Favorites System**
- **Personal Collections**: Save favorite books to your account
- **Quick Access**: Dedicated favorites page
- **Visual Indicators**: Clear favorited/unfavorited states
- **Statistics Dashboard**: Track number of favorites
- **Cross-Page Sync**: Favorites update across all pages in real-time

### 👨‍💼 **Admin Dashboard**
- **Book Management**: Add, edit, and delete books
- **Customer Management**: View and manage customer accounts
- **Message Center**: View and respond to contact form submissions
- **Real-Time Updates**: Instant table updates after actions
- **Responsive Tables**: Mobile-friendly data display

### 🔧 **Super Admin Features**
- **Admin Creation**: Create new admin accounts
- **Admin Management**: View and delete admin users
- **CSV Export**: Export book list to CSV format
- **Print Functionality**: Print-friendly book list generation
- **Secure Access**: Restricted to super admin credentials

### 🎨 **UI/UX Features**
- **Dark Mode**: Full dark theme support with toggle
- **Smooth Animations**: CSS animations for enhanced user experience
- **Responsive Design**: Mobile, tablet, and desktop optimized

### 📱 **Responsive Navigation**
- **Mobile Menu**: Hamburger menu for small screens
- **Fixed Header**: Always-accessible navigation bar
- **Dynamic User Display**: Shows logged-in user information
- **Context-Aware Buttons**: Login/logout states update automatically

### 💬 **Communication**
- **Contact Form**: Multi-field contact form with phone number
- **Message Storage**: All messages saved for admin review
- **Admin Notifications**: Messages viewable in admin dashboard

### 🎯 **Additional Features**
- **localStorage Integration**: Client-side data persistence
- **Cross-Page Data Sync**: Real-time updates across browser tabs
- **Image Preview**: Live preview for uploaded book covers
- **Form Validation**: Client-side validation for all forms
- **Error Handling**: User-friendly error messages and confirmations

---

## 👥 User Roles & Credentials

### Super Admin
- **Email**: superadmin@gmail.com
- **Password**: superadmin
- **Access**: Create/delete admins, export data, full system control

### Admin
- Created by Super Admin
- **Access**: Manage books, customers, and messages

### Customer
- Register through the registration page
- **Access**: Browse books, rate/review, manage favorites

---

## 📖 Usage Guide

### For Customers:
1. **Register** an account or **login** with existing credentials
2. **Browse** the book catalog on the Products page
3. **Search** for books by title or author
4. **Click** on any book to view details
5. **Rate & Review** books you've read
6. **Add to Favorites** to build your personal collection
7. **Toggle Dark Mode** for comfortable reading

### For Admins:
1. **Login** with admin credentials
2. **Add Books**: Fill form with title, author, price, cover image, and description
3. **Edit Books**: Click edit button, modify details, and update
4. **Delete Books**: Remove books from catalog
5. **Manage Customers**: View and delete customer accounts
6. **Review Messages**: Check contact form submissions

### For Super Admin:
1. **Login** with super admin credentials
2. **Create Admins**: Add new admin users with credentials
3. **Manage Admins**: View all admins and delete if necessary
4. **Export Data**: Download book catalog as CSV
5. **Print Reports**: Generate printable book lists

---

## 🎨 Features in Detail

### Dark Mode
- System-wide dark theme
- Persistent across sessions (localStorage)
- One-click toggle in header
- Optimized contrast for readability

### Favorites System
- User-specific favorite lists
- Add/remove with one click
- Timestamp tracking for when items were favorited
- Visual feedback on all pages
- Dedicated favorites page with statistics

### Rating System
- 5-star interactive rating
- Written reviews with character count
- Edit existing reviews
- Delete capability (own reviews or admin)
- Average rating calculation
- Review sorting by date

### Search
- Real-time filtering
- Searches titles and authors
- Maintains favorite states
- Instant results without page reload

---

## 📱 Browser Compatibility

✅ **Fully Tested On:**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## 🐛 Known Issues & Limitations

- localStorage has 5-10MB size limit
- Data is not shared between different browsers
- No real-time sync between devices
- Images stored as base64 (can be large)


© 2025 Bookify. All rights reserved.
