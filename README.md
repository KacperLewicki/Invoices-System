# Invoice System

Invoice System is an web application designed for invoice management. It has been developed using modern technologies such as **Next.js**, **React.js**, and **TypeScript** to ensure high performance, intuitive usage, and scalability for future enhancements. The project is currently in the pre-production phase and is being actively developed following best practices.

## Problems can occur with the database, because there are very high limitations when it comes to contact

## Work on the structure of the project is still in progress - the project is in pre-production - demo stage

## Features

### Current Features
- **Registration and Login**: Secure user authentication and registration process.
- **Dashboard**: Full application navigation available via a top menu after logging in.
- **Invoice Creation**: Intuitive interface for creating new invoices.
- **Status Management**: Manipulate invoice statuses (e.g., pending, paid, canceled).
- **Invoice Editing**: Update and modify existing invoices.
- **Credit Notes**: Generate credit notes for invoices.
- **PDF Export**: Download invoices as PDF at every stage of management.

### Planned Features
- **Admin Panel**: Advanced management tools for system administrators.
- **Notifications**: Integration of a notification system to inform users about important events.
- **Design Improvements**: Enhanced user interface for a better experience.

## Project Structure

### Main Directories
- **src/**
  - **app/**: Core components of the application.
  - **components/**: Reusable user interface components.
  - **globalCSS/**: Global styles for the application.
  - **hooks/**: React hooks.
  - **middleware/**: Middleware logic.
  - **pages/**: Routing and API endpoints (backend).
  - **service/**: Service layer and business logic.
  - **types/**: TypeScript types for the entire application.

### Configuration Files
- **.env**: Stores sensitive configuration data.
- **tailwind.config.ts**: TailwindCSS configuration for styling.
- **tsconfig.json**: TypeScript configuration.

## Technologies and Libraries

The project leverages the following technologies and libraries:

### Backend and Data Management
- **Next.js**: Framework for building web applications with server-side rendering (SSR).
- **Axios**: Handles HTTP requests.
- **MySQL2**: MySQL database client.
- **Joi**: Validates user data.
- **dotenv**: Manages environment variables.

### Security
- **bcrypt**: Password hashing.
- **jsonwebtoken (JWT)**: User authentication via tokens.

### Frontend
- **React.js**: Builds the user interface.
- **TailwindCSS**: Application styling.
- **React Router**: Manages navigation between pages.

### PDF and Document Generation
- **pdf-lib** / **pdfmake**: Creates and manipulates PDF files.

### Development Tools
- **TypeScript**: Static typing for safer code.
- **ESLint**: Code linting for consistency.
- **Babel**: Compiles modern JavaScript.

### Reasons for Choosing These Technologies
1. **Next.js**: Scalability, fast rendering, and SSR support.
2. **TailwindCSS**: Quick prototyping and flexible styling.
3. **pdf-lib**: Efficient PDF document handling.
4. **MySQL2**: Reliable database for business applications.
5. **React.js**: Flexible framework with a large community.

## Development Stage
The project is in the **pre-production** phase, meaning:
- Not all features are implemented yet.
- The application is undergoing continuous testing and optimization.
- The design and structure are being revamped to adopt best programming practices.

## Running the Project

To run the project locally:
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open your browser and navigate to [http://localhost:3000](http://localhost:3000).

## Contribution and Development
We welcome contributions! Please submit suggestions, feature requests, or bug reports via the issue tracker in the project repository.

---

Thank you for your interest in the Invoice System! Together, we can make it an even better tool for invoice management.

