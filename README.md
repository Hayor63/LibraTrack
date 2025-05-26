# Library Management App - Backend

## Overview

The Library Management App Backend is designed to manage core library operations such as book inventory, user management, borrowing and returning books, book reservations, and user reviews. This RESTful API provides librarians and users with a seamless interface for managing library resources, while administrators have enhanced control over users and content. The system also features interactive API documentation powered by Swagger for easy integration and testing.

## Features

- **Book Management**: Add, update, delete, and view books in the library collection.
- **User Management**: Register and manage users, with different roles (e.g., librarian, regular user).
- **Borrowing System**: Users can borrow and return books, with tracking of due dates and overdue fines.
- **Book Reservation**: Users can reserve books, manage reservations, and view their history.
- **Review and Rating**: Users can rate and review borrowed books.
- **Authentication & Authorization**: Secure login and registration using JWT tokens for user authentication.
- **Admin Dashboard**: Librarians can manage users and books through the admin interface.
- **API Documentation**: Interactive API documentation with Swagger UI.

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Zod for request validation
- **Testing**: Jest (for backend testing)

## API Documentation

This project includes interactive API documentation using Swagger.
- 📘 View the Swagger UI at: http://localhost:<port>/api-docs

## Setup

### Prerequisites

- Node.js
- MongoDB (local or Atlas)

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/your-username/library-management-app-backend.git
    ```

2. Install dependencies:
    ```bash
    cd library-management-app-backend
    npm install
    ```

3. Set up environment variables:
   - Create a `.env` file in the root of the project.
   - Add the necessary configuration for your database connection and JWT secrets.

 ```bash
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
  ```



4. Run the application:
    ```bash
    npm run dev
    ```

### API Overview (Key Endpoints)

#### Authentication

- **POST /api/v1/auth/register** - Register a new user
- **POST /api/v1/auth/login** - User login, returns JWT token

#### 📚 Books

- **GET /api/v1/books** - Get all books
- **GET /api/v1/books/:id** - Get book details by ID


#### 📦 Book Borrowing

- **POST /api/v1/borrowing/:id** - Borrow a book
- **POST /api/v1/borrowing/:id/return** - Return a borrowed book

#### 🔖 Book Reservations

- **POST /api/v1/reservations/:bookId** - Reserve a book
- **PATCH /api/v1/reservations/:id/cancel** - Cancel a reservation
  

#### 📝 Reviews

- **POST /api/v1/reviews/:bookId/create** - Create a review for a book (with rating)
- **GET /api/v1/reviews** - Get all reviews


#### 👥 User Management (Admin)

- **GET /api/v1/users** - Get all users
- **DELETE /api/v1/users/:id** - Delete a user

## Contributing

Feel free to fork the repository, create issues, and submit pull requests. Contributions are welcome!

## License

This project is licensed under the MIT License.
