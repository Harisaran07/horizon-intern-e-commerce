# HorizonTech E-Commerce Platform

A premium e-commerce platform built during the HorizonTech internship program. This project includes a modern, glassmorphism-inspired UI and a robust backend to handle products, cart, authentication, and orders.

## Features

- **Modern UI/UX**: Premium aesthetic with dark mode, glassmorphism, and gold accents.
- **Authentication**: Secure user login and registration.
- **Product Catalog**: View products, browse categories, and read descriptions.
- **Cart & Checkout**: Manage cart items and simulate the checkout process.
- **Order Management**: Track past orders and their fulfillment status.
- **Responsive Design**: Mobile-friendly layout.

## Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)

## Folder Structure

```
├── public/          # Frontend assets (HTML, CSS, JS)
│   ├── css/         # Stylesheets
│   ├── js/          # Client-side JavaScript
│   └── ...          # HTML pages
├── server/          # Backend code
│   ├── config/      # Database configuration
│   ├── middleware/  # Custom middleware (e.g., auth)
│   ├── models/      # Mongoose schemas
│   ├── routes/      # Express API routes
│   ├── seed.js      # Database seeding script
│   └── server.js    # Express application entry point
├── package.json     # Node.js dependencies
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Harisaran07/horizon-intern-e-commerce.git
   cd horizon-intern-e-commerce
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables (create a `.env` file):
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

4. Seed the database with sample products:
   ```bash
   node server/seed.js
   ```

5. Start the development server:
   ```bash
   npm start
   ```

## License

This project is licensed under the MIT License.
