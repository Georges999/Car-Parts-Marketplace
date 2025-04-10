# 🛠️ Car Parts Marketplace

A comprehensive e-commerce platform designed to help automotive enthusiasts and vehicle owners find, compare, and purchase the right parts for their vehicles. The application features intelligent compatibility matching, expert reviews, and a seamless shopping experience.

---

## 🚀 Features

- **Vehicle Profile Management**: Save and manage multiple vehicles for quick compatibility checks  
- **Smart Search**: Find parts by name, category, or by describing symptoms  
- **Compatibility Verification**: Automatic verification if parts will fit your registered vehicles  
- **Detailed Part Information**: Comprehensive specifications, mechanic tips, and installation guides  
- **Customer Reviews**: Verified purchase reviews with helpfulness ratings  
- **Shopping Cart & Checkout**: Complete e-commerce functionality  
- **Order History & Tracking**: Monitor past and current orders  
- **Responsive Design**: Optimized experience across desktop and mobile devices  

---

## 💻 Technologies

- **Frontend**: React, React Router, Context API  
- **Backend**: Node.js, Express  
- **Database**: MongoDB with Mongoose  
- **Authentication**: JWT (JSON Web Tokens)  
- **Styling**: Custom CSS with responsive design  
- **API**: RESTful architecture  

---

## 🏗️ Project Structure

```
/frontend
│
├── /src
│   ├── /components     # Reusable UI components
│   ├── /pages          # Page-level components
│   ├── /contexts       # Context providers (Auth, Cart)
│   └── /styles         # Global CSS styles

/backend
│
├── /controllers        # Request handlers
├── /models             # Mongoose data models
├── /routes             # API endpoints
├── /middleware         # Custom middleware functions
└── /config             # Configuration files
```

---

## 📚 API Documentation

The API follows RESTful conventions:

- **Authentication**:  
  `POST /api/users/login`  
  `POST /api/users/register`  

- **Vehicles**:  
  `GET /api/vehicles`  
  `POST /api/vehicles`  

- **Parts**:  
  `GET /api/parts`  
  `GET /api/parts/:id`  

- **Reviews**:  
  `GET /api/reviews`  
  `POST /api/reviews`  

- **Orders**:  
  `GET /api/orders`  
  `POST /api/orders`  

---

## 📝 Usage

1. Clone the repository and install dependencies  
2. Start both the backend and frontend servers  
3. Open your browser and visit: `http://localhost:5173`

### How to Use:
- Register a new account or login with existing credentials  
- Add your vehicle profiles for compatibility matching  
- Browse or search for parts  
- View detailed part information, reviews, and compatibility details  
- Add items to your cart and complete checkout  
