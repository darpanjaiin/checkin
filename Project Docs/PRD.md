1. Product Requirements Document (PRD)
1.1 Purpose and Scope
Purpose:
Build a full-stack web application to facilitate self-check-in for guests at Airbnbs/homestays. This application will allow property owners/hosts to gather detailed guest information and maintain a database for future marketing and outreach, as well as provide a smoother check-in process for guests.

Scope:

A simple form interface (Front-End) for guests to fill out their details:
Name, contact number for all guests
An identity proof document upload (for at least one guest)
Check-in and check-out dates
Special requests
A dashboard (Front-End) for hosts to view and export guest data.
A secure backend (Back-End) for storing the data, handling file uploads, authentication, and data retrieval.
1.2 Objectives
Collect complete guest information: Encourage all guests (not just the booking owner) to submit their details, thereby giving the host a more robust database.
Enable hosts to push for reviews: Having each guest’s contact information allows the host to follow up for reviews from all guests, rather than just one.
Database for marketing campaigns: Hosts will have a detailed database to run future promotions, loyalty programs, or targeted marketing.
Easy export: Hosts can export guest data in CSV format for external use (e.g., email marketing tools).
1.3 Problem Statement
Currently, hosts on platforms like Airbnb only have contact information for the primary booking guest. This limits the host’s ability to communicate with, market to, and collect feedback from all the guests who actually stayed. A user-friendly solution is needed to collect all guests’ details seamlessly and securely.

1.4 Key Stakeholders
Primary Stakeholder: Property Owners/Hosts
Secondary Stakeholder: Guests (end-users who submit their details)
Admin/Developer: Maintains and updates the system
1.5 User Stories
As a Guest:

I want to quickly fill in my personal details so I can complete the check-in process without hassle.
I want to upload my identification documents securely.
I want to specify any special requests so the host can be prepared.
As a Host:

I want to have a dashboard displaying all guest information so I can easily review it.
I want to export the data in CSV format so I can use it for marketing.
I want to send a follow-up email or message to each guest to request reviews.
I want to ensure the data is stored securely and is easily retrievable.
1.6 Features and Requirements
Guest Information Form

Fields: Name, Contact Number, Identity Proof Upload, Check-In Date, Check-Out Date, Special Requests, Additional Guests’ details
Client-side and server-side validation
Mobile-friendly
Dashboard for Hosts

Authentication (secure login)
View guest entries in a tabular format (sortable, filterable if needed)
Export to CSV or Excel
Possibly send direct messages or emails to guests (optional future scope)
Backend

Securely store form data in a database
Provide endpoints for data submission and retrieval
Integrate identity proof document upload (file storage)
1.7 Constraints
Must comply with data protection and privacy regulations (GDPR if applicable, local privacy laws).
Minimal friction for the guests to fill out the form (keep it simple).
1.8 Success Metrics
Adoption Rate: Number of hosts using the self-check-in application.
Completion Rate: Percentage of guests who fully complete the form.
Data Accuracy: Reduction in missing or incomplete fields after implementing the system.
User Satisfaction: Measured through feedback from both hosts and guests.
