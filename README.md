# Modern E-commerce Platform

A full-stack e-commerce platform built with Next.js 13+, featuring a modern UI, authentication, admin dashboard, and shopping cart functionality.

## 🚀 Features

- **User Authentication**
  - Email & Password login
  - Password reset functionality
  - Role-based authorization (Admin/User)

- **Product Management**
  - Product listing with search and filtering
  - Product details with images
  - Shopping cart functionality
  - Admin dashboard for product management

- **Modern UI/UX**
  - Responsive design
  - Tailwind CSS styling
  - Interactive components
  - Loading states and animations

## 🛠️ Tech Stack

- **Frontend**
  - Next.js 13+ (App Router)
  - React
  - Tailwind CSS
  - React Icons

- **Backend**
  - Next.js API Routes
  - MongoDB
  - NextAuth.js

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/Anibaa/E-commerce-Platform
```

2. Install dependencies:
```bash
cd ecommerce-platform
npm install
```

3. Create a `.env.local` file in the root directory with the following variables:
```env
MONGODB_URI=your_mongodb_uri
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
SMTP_HOST=your_smtp_host
SMTP_PORT=your_smtp_port
SMTP_USER=your_smtp_user
SMTP_PASSWORD=your_smtp_password
```

4. Run the development server:
```bash
npm run dev
```


## 🚀 Deployment

This application can be deployed on Vercel with zero configuration:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/ecommerce-platform)

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
