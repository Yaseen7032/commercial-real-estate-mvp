# Locentra — Commercial Real Estate Discovery Platform

Locentra is a commercial real estate platform designed to help retailers explore property listings, define business requirements, and connect with tenant representatives.

## Features

- User registration and login
- Retailer and tenant representative dashboards
- Commercial property listings and details
- Property search and filtering
- Retailer requirements management
- Property contact requests
- Property management
- Responsive user interface

## Technology Stack

**Frontend**
- React
- Vite
- JavaScript
- CSS

**Backend**
- Node.js
- Express.js
- REST APIs

**Database**
- MongoDB Atlas

## Live Demo

- **Frontend:** https://commercial-real-estate-mvp.vercel.app/
- **Backend Health API:** https://commercial-real-estate-mvp.onrender.com/api/health
- **Properties API:** https://commercial-real-estate-mvp.onrender.com/api/properties

## Local Development

### Prerequisites

- Node.js and npm
- MongoDB Atlas account or another configured MongoDB instance

### Frontend Setup

```bash
cd client
npm install
npm run dev
```

### Backend Setup

Open a separate terminal:

```bash
cd server
npm install
npm run dev
```

The backend environment variables must be configured in the server's `.env` file according to the existing backend configuration.

**Security:** Never commit `.env` files, database credentials, or secret keys to GitHub.

## Production Build

To build the frontend:

```bash
cd client
npm run build
```

The generated production files are placed in `client/dist`.

## Testing

The following areas have been checked manually:

- Production health and properties API responses
- User authentication workflows
- Property search and filtering
- Requirement submission and persistence
- Contact requests
- Property add/edit workflows
- Responsive layouts

## Deployment

The frontend is deployed on Vercel, and the backend is hosted on Render. MongoDB Atlas is used for database storage.

## Project Goal

Locentra aims to simplify commercial property discovery by bringing property information, retailer requirements, and representative contact into one platform.