# Football Player Tracker

## Overview

This is a comprehensive football player tracking application built for monitoring individual player performance, training sessions, tournament participation, and coach feedback. The application is designed as a personal dashboard for tracking football career progress with detailed analytics and insights.

## System Architecture

### Full-Stack Structure
- **Frontend**: React with TypeScript, using Vite as the build tool
- **Backend**: Express.js server with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **UI Framework**: Tailwind CSS with shadcn/ui components
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for client-side routing
- **Deployment**: Replit with autoscale deployment target

### Monorepo Organization
```
├── client/          # React frontend application
├── server/          # Express.js backend API
├── shared/          # Shared schemas and types
└── migrations/      # Database migration files
```

## Key Components

### Frontend Architecture
- **Component Structure**: Modular UI components using shadcn/ui
- **State Management**: TanStack Query for API data fetching and caching
- **Styling**: Tailwind CSS with custom football-themed color variables
- **Responsive Design**: Mobile-first approach with responsive breakpoints
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **API Design**: RESTful API endpoints with Express.js
- **Database Layer**: Drizzle ORM with PostgreSQL
- **Storage Interface**: Abstracted storage layer for data operations
- **File Uploads**: Multer for handling file uploads (tournament images)
- **Error Handling**: Centralized error handling middleware

### Database Schema
- **Players**: Core player information (name, age, position, team)
- **Games**: Individual game performance tracking
- **Tournaments**: Tournament participation and progress
- **Training Sessions**: Training activities and performance
- **Coach Feedback**: Coach evaluations and ratings
- **Squad Management**: Team roster and coaching staff

## Data Flow

### Client-Server Communication
1. Frontend makes API requests using TanStack Query
2. Express server handles routing and business logic
3. Drizzle ORM manages database operations
4. Response data flows back through the same chain

### Real-time Updates
- Query invalidation triggers automatic re-fetching
- Optimistic updates for better user experience
- Toast notifications for user feedback

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Database connection for Neon PostgreSQL
- **drizzle-orm**: TypeScript ORM for database operations
- **@tanstack/react-query**: Server state management
- **react-hook-form**: Form handling and validation
- **zod**: Schema validation
- **recharts**: Chart components for statistics

### UI Components
- **@radix-ui/***: Headless UI primitives
- **lucide-react**: Icon library
- **class-variance-authority**: Component variant management
- **tailwindcss**: Utility-first CSS framework

### Development Tools
- **vite**: Frontend build tool
- **tsx**: TypeScript execution for development
- **esbuild**: Backend bundling for production

## Deployment Strategy

### Development Environment
- Vite dev server for frontend with HMR
- tsx for running TypeScript server in development
- PostgreSQL database connection via environment variables

### Production Build
1. Frontend built using Vite to `dist/public`
2. Backend bundled using esbuild to `dist/index.js`
3. Static files served from build output
4. Database migrations applied via `drizzle-kit push`

### Replit Configuration
- Node.js 20 runtime with PostgreSQL 16 module
- Autoscale deployment target
- Port 5000 mapped to external port 80
- Environment variables for database connection

## Changelog

```
Changelog:
- June 19, 2025. Added club and coach management system
  - Added club management with primary (Sporthood) and adhoc clubs (Consient Sports, Indian City FC)
  - Implemented coach management with titles (Head Coach, Assistant Coach, Adhoc Coach)
  - Created coach dropdown selections throughout the application
  - Added club association with season tracking for primary clubs
  - Integrated coach-club relationships for better organization
- June 19, 2025. Enhanced game tracking with match types and post-match stats
  - Added game types: Practice, Friendly, Tournament matches
  - Added match formats: 2v2, 4v4, 5v5, 7v7
  - Enhanced post-match statistics: position played, goals, assists, mistakes, coach feedback
  - Linked tournament matches to specific tournaments
  - Updated game forms and displays with new fields
- June 19, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```