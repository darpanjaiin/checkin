3. Rules for Cursor (AI code generator) (Instructions for Code Generation)

Consistent Code Style

Use a linter (ESLint for JavaScript/TypeScript) to maintain consistency.
Adhere to a standard naming convention (camelCase for variables/functions).
Generate Secure Code

Always sanitize inputs for forms and handle file uploads securely.
Use environment variables (never hardcode credentials).
Modular Architecture

Separate business logic from controllers.
Keep routes, controllers, and services in separate folders/files.
Error Handling

Provide meaningful error messages in both client and server code.
Implement try-catch blocks for asynchronous calls.
Documentation

Add comments where needed (especially for complex logic).
Generate or maintain API docs (Swagger or similar tool if possible).
Responsive & Accessible Front-End

Use semantic HTML elements.
Include alt attributes for images.
Ensure ARIA labels where relevant (especially for custom components).
Testing

Write basic unit tests or integration tests.
For UI, use a tool like Jest + React Testing Library (if using React).
Deployment Scripts

Provide instructions/scripts for building and deployment.
For instance, npm run build for the frontend, npm start for the backend.
Follow Best Practices

Use recommended design patterns for chosen framework.
Keep dependencies up to date.
