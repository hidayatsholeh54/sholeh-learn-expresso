# Belajar Express.js Backend

Backend project built with Express.js, Sequelize, PostgreSQL, and JWT authentication.

## Summary

This application provides an authentication and user management backend with:

- User registration and login
- JWT authentication middleware
- Protected routes and role-based authorization
- Sequelize ORM for the `User` model
- Automatic table creation using `sequelize.sync()`
- Admin endpoints to create, update, and delete users

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database available and running
- `npm` installed

## Installation

1. Clone this repository.
2. Install dependencies:

```bash
npm install
```

## `.env` Configuration

Create a `.env` file in the project root with the following values:

```env
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASS=your_database_password
JWT_SECRET=your_jwt_secret
```

- `DB_NAME`: PostgreSQL database name
- `DB_USER`: PostgreSQL username
- `DB_PASS`: PostgreSQL password
- `JWT_SECRET`: secret key used to sign JWT tokens

## Running the Application

Run the server in development mode:

```bash
npm run dev
```

The application will run at `http://localhost:3000`.

## Database and Sequelize

This project uses `sequelize.sync()` to automatically create database tables on startup.

The main code is in `index.js`:

```js
sequelize.sync().then(() => {
  console.log("Database Connected");
  app.listen(3000, () => console.log("Server running on port 3000"));
});
```

The `User` model is defined in `models/user.js` with the following fields:

- `email` (string, unique, not null)
- `password` (string, not null)
- `role` (string, default `user`)

> Note: this project does not use `sequelize-cli` and does not include migration files.

## API Structure

### Auth Routes

- `POST /auth/register`
  - Register a new user
  - Body: `{ "email": "...", "password": "..." }`
- `POST /auth/login`
  - Login and receive a JWT token
  - Body: `{ "email": "...", "password": "..." }`
- `PUT /auth/change-password`
  - Change the user password; requires `Authorization: Bearer <token>` header
  - Body: `{ "oldPassword": "...", "newPassword": "..." }`
- `GET /auth/admin`
  - Admin-only route
  - Requires admin token
- `GET /auth/profile`
  - Returns an authenticated user's profile access message
- `GET /auth/me`
  - Returns authenticated user details
- `GET /auth/users`
  - Admin-only route to list all users

### User Routes

- `POST /users/create-admin`
  - Create a user with admin role (admin only)
  - Body: `{ "email": "...", "password": "..." }`
- `PUT /users/users/:id`
  - Update a user by ID (admin only)
  - Body: `{ "email": "...", "role": "..." }`
- `DELETE /users/users/:id`
  - Delete a user by ID (admin only)

## Middleware

- `verifyToken` in `middlewares/authMiddleware.js`
  - Checks the `Authorization` header
  - Verifies the JWT token using `process.env.JWT_SECRET`
  - Loads the `req.user` object
- `checkRole("admin")`
  - Checks that the authenticated user has the admin role

## Important Notes

- Passwords are hashed using `bcrypt` before saving.
- JWT tokens expire after `1d`.
- If a table does not exist, Sequelize will create it automatically on startup.

## Development Command

```bash
npm run dev
```

## License

This project is provided for learning purposes with Express.js and Sequelize.
