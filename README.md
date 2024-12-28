# Self Check-In System

A modern web-based self check-in system that allows visitors to register themselves and hosts to manage check-ins.

## Features

- Guest Self Check-in
  - Easy-to-use check-in form
  - ID proof upload
  - Additional guests registration
  - Email notifications

- Host Management
  - Secure authentication
  - Dashboard to view and manage check-ins
  - Email notifications for new check-ins
  - Profile management

## Tech Stack

- Frontend: HTML, CSS, JavaScript
- Backend: Supabase
- Storage: Supabase Storage
- Authentication: Supabase Auth
- Database: PostgreSQL (via Supabase)

## Setup Instructions

1. Clone the repository
2. Update Supabase configuration in `js/supabase.js`
3. Deploy to your preferred hosting service
4. Configure email settings in Supabase dashboard

## Environment Variables

Create a `.env` file with:
- SUPABASE_URL=your_supabase_url
- SUPABASE_ANON_KEY=your_supabase_anon_key

## Production Deployment

1. Update all API endpoints to use production URLs
2. Enable HTTPS
3. Configure CORS in Supabase
4. Set up proper email templates 