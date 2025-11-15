# Full-Stack Developer Assignment with Supabase

## Overview
This full-stack application uses **ReactJS**, **Flask**, **Supabase**, **Google Login**, and **JWT authentication**.  
It fetches external cart data, stores it in Supabase, performs analytics, and provides CRUD operations for products.

## Features

1. **Authentication**
   - Username & Password login
   - Google SSO login
   - JWT token for protected APIs

2. **External API Integration**
   - Fetch data from [Dummy JSON Carts](https://dummyjson.com/carts)
   - Store product/cart data in Supabase database

3. **Analytics API**
   - Total amount before discount
   - Total amount after discount
   - Average discount percentage
   - Most expensive product
   - Cheapest product
   - Product with highest discount
   - Total quantity of products
   - Number of unique products

4. **CRUD Operations**
   - Create, Read, Update, Delete products (JWT-protected)

5. **Frontend**
   - Google Login page
   - Dashboard to load API data and display analytics
   - Product Management page for CRUD operations

## Tech Stack
- Frontend: ReactJS  
- Backend: Flask  
- Database: Supabase  
- Authentication: JWT + Google OAuth  

## Setup Instructions

1. **Clone the repository**

git clone https://github.com/haru649/Full-Stack.git
cd Full-Stack

2. Backend Setup

cd backend
pip install -r requirements.txt
Create a .env file with the following variables:
DATABASE_URL=your_database_url_here
JWT_SECRET_KEY=your_jwt_secret_here
GOOGLE_CLIENT_ID=your_google_client_id_here

Run the backend:
python app.py

3. Frontend Setup

cd ../frontend
npm install

Create a .env file in the frontend directory with:
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id_here
REACT_APP_API_URL=http://localhost:5000

Start the frontend:
npm start

