Car Parts Marketplace
A comprehensive e-commerce platform designed to help automotive enthusiasts and vehicle owners find, compare, and purchase the right parts for their vehicles. The application features intelligent compatibility matching, expert reviews, and a seamless shopping experience.

🚀 Features
Vehicle Profile Management: Save and manage multiple vehicles for quick compatibility checks
Smart Search: Find parts by name, category, or by describing symptoms
Compatibility Verification: Automatic verification if parts will fit your registered vehicles
Detailed Part Information: Comprehensive specifications, mechanic tips, and installation guides
Customer Reviews: Verified purchase reviews with helpfulness ratings
Shopping Cart & Checkout: Complete e-commerce functionality
Order History & Tracking: Monitor past and current orders
Responsive Design: Optimized experience across desktop and mobile devices
💻 Technologies
Frontend: React, React Router, Context API
Backend: Node.js, Express
Database: MongoDB with Mongoose
Authentication: JWT (JSON Web Tokens)
Styling: Custom CSS with responsive design
API: RESTful architecture

 Project Structure
frontend: React application

/src/components: Reusable UI components
/src/pages: Page components
/src/contexts: Context providers (Auth, Cart)
/src/styles: Global CSS styles
backend: Node.js/Express server

/controllers: Request handlers
/models: Mongoose data models
/routes: API endpoints
/middleware: Custom middleware functions
config: Configuration files
📝 Usage
After installation, visit http://localhost:5173 in your browser.

Register a new account or login with existing credentials
Add your vehicle profiles for compatibility matching
Browse or search for parts
View detailed part information, reviews, and compatibility details
Add items to cart and complete checkout
📚 API Documentation
The API endpoints follow RESTful conventions:

Authentication: /api/users/login, /api/users/register
Vehicles: /api/vehicles
Parts: /api/parts, /api/parts/:id
Reviews: /api/reviews
Orders: /api/orders
