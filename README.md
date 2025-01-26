MERN Stack Feedback Portal
A sophisticated and scalable full-stack feedback portal designed to streamline user interaction, feedback collection, and management. This application leverages the power of the MERN stack (MongoDB, Express.js, React.js, and Node.js) to deliver a seamless, secure, and responsive experience for both users and administrators. Whether for internal team feedback, customer reviews, or general user input, this portal provides a robust platform for gathering and managing feedback efficiently.

Technology Stack
Backend
Node.js & Express.js: A lightweight and efficient server-side framework built on Node.js, enabling fast and scalable backend development. Express.js simplifies routing, middleware integration, and API creation, ensuring a smooth and maintainable codebase.

MongoDB with Mongoose: A highly flexible NoSQL database that stores data in a JSON-like format, paired with Mongoose for schema validation and data modeling. This combination ensures data integrity and seamless interaction with the database.

JWT Authentication: Implements JSON Web Tokens (JWT) for secure and stateless user authentication. Tokens are generated upon login and used to authenticate subsequent requests, ensuring a secure and scalable authentication mechanism.

bcryptjs: Utilized for hashing user passwords, providing an additional layer of security by ensuring that sensitive information is never stored in plain text.

dotenv: Manages environment variables securely, allowing for easy configuration of sensitive data such as API keys, database credentials, and JWT secrets without hardcoding them into the application.

Frontend
React.js: A modern and efficient JavaScript library for building dynamic and interactive user interfaces. React’s component-based architecture ensures reusability, maintainability, and a smooth user experience.

React Router DOM: Enables client-side routing, allowing for seamless navigation between different views and components without reloading the page, enhancing the single-page application (SPA) experience.

Tailwind CSS: A utility-first CSS framework that accelerates UI development by providing pre-designed classes for styling. Tailwind ensures a consistent and responsive design across all devices while maintaining customization flexibility.

Key Features
User Authentication
Login and Registration: A secure and intuitive system for user registration and login, ensuring that only authorized users can access the platform.

Password Recovery: Future-ready implementation for password recovery and reset functionality to enhance user convenience and security.

Protected Routes
Role-Based Access Control: Certain routes and features are protected and accessible only to authenticated users, ensuring data privacy and security.

Token Validation: Each request to protected routes is validated using JWT, ensuring that only valid sessions can access sensitive information.

Responsive Design
Cross-Device Compatibility: The application is designed to be fully responsive, providing an optimal user experience on desktops, tablets, and mobile devices.

Intuitive UI/UX: A clean and modern interface designed to enhance user engagement and ease of use.

Environment Variable Configuration
Secure Configuration Management: Sensitive information such as API keys, database credentials, and JWT secrets are stored in environment variables, ensuring security and flexibility across different deployment environments.

Secure Password Storage
Advanced Hashing: Passwords are hashed using bcryptjs, ensuring that even in the event of a data breach, user credentials remain protected.

Token-Based Authentication
Stateless Sessions: JWT-based authentication ensures that user sessions are stateless and scalable, reducing server-side overhead and improving performance.

Session Expiry: Tokens are configured with an expiration time, enhancing security by requiring users to re-authenticate after a certain period.

Scalable and Maintainable Architecture
Modular Codebase: The application is built with a modular and organized structure, making it easy to scale, maintain, and add new features in the future.

API-Driven Development: The backend is designed as a RESTful API, enabling easy integration with other frontend frameworks or third-party services.

Screenshots attached:

Client View -
![image](https://github.com/user-attachments/assets/90930767-30ee-47f6-b885-b5e626245e2a)

![image](https://github.com/user-attachments/assets/6798cf61-2249-4772-b099-eaef962e4482)


Admin View -
![image](https://github.com/user-attachments/assets/bdedca26-64ad-43af-a67f-db7ad65930ab)

![image](https://github.com/user-attachments/assets/85b61bd7-2633-49ea-b3b3-f98d9c36cf5f)

The admin can export feedbacks in pdf, excel and csv formats.

![image](https://github.com/user-attachments/assets/e0981a98-f0ab-4ee9-960f-96ce342d598f)




