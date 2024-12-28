4. System Architecture / Technical Design Document
Below is a high-level system architecture for the self-check-in application.

                          ┌────────────────────────┐
                          │        Frontend        │
                          │ (React / Vue / Angular)│
                          │  - Check-in Form       │
                          │  - Host Dashboard      │
                          └─────────┬──────────────┘
                                    │
                      HTTPS (REST)  │
                                    ▼
                          ┌────────────────────────┐
                          │       Backend API      │
                          │   (Node.js + Express)  │
                          │- Auth (JWT)            │
                          │- CRUD for Guests       │
                          │- File Upload Handling  │
                          └─────────┬──────────────┘
                                    │
                        DB Queries  │
                                    ▼
                          ┌────────────────────────┐
                          │     Database (SQL/     │
                          │   NoSQL e.g. MySQL/     │
                          │   PostgreSQL/MongoDB)   │
                          └─────────┬──────────────┘
                                    │
                          File Upload│
                                    ▼
                          ┌────────────────────────┐
                          │  File Storage (S3 or   │
                          │        local)          │
                          └────────────────────────┘
4.1 Front-End Layer
Components:
CheckInForm: Gathers guest details.
Dashboard: Displays submissions in a table with filters and export.
4.2 Back-End Layer
Server: Node.js + Express.
Routes:
POST /api/checkin - receives form data & file upload.
GET /api/guests - retrieves all guest data.
GET /api/guests/export - returns CSV file.
Middleware:
Authentication: JWT token validation for host routes.
File Upload: Use multer or a similar library.
4.3 Database Layer
Schema:
Guests Table/Collection: _id, firstName, lastName, contactNumber, identityProofURL, checkInDate, checkOutDate, specialRequests, createdAt, updatedAt.
Additional table/collection for Hosts if needed.
4.4 File Storage
Option 1: AWS S3 (recommended for production).
Option 2: Local file system (sufficient for small-scale usage but less scalable).
4.5 Security
Use HTTPS in production.
JWT tokens for session management.
Database credentials in environment variables.
Validate/sanitize inputs to mitigate SQL Injection or XSS.
