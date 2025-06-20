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
- **Styling**: Tailwind CSS with modern colorful design system
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

## Recent Changes

- June 20, 2025: Enhanced training session photo upload to support multiple photos at once
  - Users can now select multiple photos simultaneously using file input
  - Each photo can have individual captions with a scrollable interface
  - Batch upload with progress indication shows count of photos being uploaded
  - All photos are uploaded concurrently for better performance
  - Enhanced UI with photo file details (name, size) for better user experience
- June 19, 2025: Enhanced Gallery with training session integration and cross-linking functionality
  - Training session photos now automatically appear in main gallery with session references
  - Added trainingSessionId field to gallery photos for linking back to sessions
  - Gallery photos show "View Training Session" links when uploaded from training sessions
  - Photo uploads from training sessions invalidate both training and gallery caches for real-time updates
  - Enhanced photo modal view with training session context and navigation links
  - Improved user experience with seamless navigation between training calendar and gallery
- June 19, 2025: Implemented complete Gallery feature with photo upload, delete, and gallery view functionality
  - Added galleryPhotos database table with player association, filename, caption, and upload timestamp
  - Created comprehensive Gallery page with responsive grid layout and modal photo viewing
  - Implemented photo upload with file validation, caption support, and progress indicators
  - Added photo deletion functionality with confirmation prompts and optimistic updates
  - Enhanced navigation with Gallery menu item and camera icon
  - Built photo modal with full-screen viewing, caption display, and delete options
  - Used Multer for secure file handling and storage in uploads directory
  - Added IST timezone formatting for upload timestamps
  - Integrated with existing database storage pattern and API routes
- June 19, 2025: Implemented interactive training calendar with comprehensive event management
  - Created full calendar view using react-big-calendar with month/week/day view options
  - Added color-coded events based on training status (pending=blue, completed=green, cancelled=yellow, missed=red)
  - Implemented training type differentiation with left border colors for each training category
  - Built detailed event popup modal with full session information and action buttons
  - Added calendar navigation controls and legend for status colors
  - Integrated calendar event click handlers to show/edit training session details
  - Fixed training session sorting to display in ascending chronological order
  - Custom calendar styling with responsive design and professional appearance
- June 19, 2025: Restored database storage functionality and cleared all sample data
  - Fixed database connection issues and switched back to DatabaseStorage from MemStorage
  - Cleared all sample data from database: games, training sessions, tournaments, coach feedback
  - Made all frontend components completely dynamic from database with no hardcoded values
  - Updated statistics components to show "No data yet" messages when appropriate
  - Application now uses persistent PostgreSQL storage with authentic data only
  - All API endpoints working correctly with database backend returning empty arrays when no data exists
- June 19, 2025: Integrated active club data into Dashboard Team & Profile sections
  - Updated HeroBanner to display dynamic club information instead of static data
  - Modified SquadDetails component to show real coach and squad member counts from active club
  - Enhanced PlayerProfile component to use active club data
  - Added API endpoint for fetching active club data
  - Dashboard now reflects current active club name, season, squad level, and coaching staff
  - Updated hero banner to show Darshil's position from squad member data (Winger)
  - Added hardcoded location text for training center
  - Removed duplicate containers and cleaned up Squad Details layout
- June 19, 2025: Implemented single active club constraint logic
  - Added business logic to ensure only one club can be active at any time
  - Updated database storage methods to automatically deactivate other clubs when setting one as active
  - Enhanced club form interface with clear messaging about single active club policy
  - Added visual indicators (star emoji) for active clubs in the interface
  - Created new API endpoint for fetching the current active club
- June 19, 2025: Implemented collapsible club interface with enhanced squad management
  - Added collapsible club cards (collapsed by default) with expand/collapse functionality
  - Enhanced squad member cards with full-width layout and better visual design
  - Fixed image cropping visibility with prominent "Crop Image" button
  - Integrated tabbed interface for coaches and squad members within club cards
  - Added comprehensive squad member management with profile pictures and jersey numbers
  - Fixed database schema for squad members with proper field mappings
- June 19, 2025: Migrated to persistent PostgreSQL database storage
  - Set up database connection using Neon PostgreSQL
  - Implemented DatabaseStorage class replacing in-memory storage
  - All club data, logos, and transactional data now persisted in database
  - Fixed Edit Club functionality with proper data validation
  - Enhanced dropdown positioning in modal dialogs
  - Resolved form submission validation errors for club updates
- June 19, 2025: Updated player information with correct details
  - Updated Darshil's age to 8 (born 2016) 
  - Changed season to 2025-26
  - Added jersey information: #18 "Darsh"
  - Enhanced hero banner with complete player profile information
- June 19, 2025: Complete redesign with clean, modern, colorful interface
  - Implemented fresh color palette with vibrant gradients and modern design
  - Created ColorfulCard component with gradient backgrounds and trend indicators
  - Built new CleanHeader with improved navigation and modern styling
  - Designed HeroBanner component with clean layout and performance highlights
  - Added comprehensive icon usage throughout the interface
  - Implemented fully responsive design with proper mobile optimization
  - Enhanced typography with Poppins font for headings and Inter for body text
  - Created modern CSS utilities for consistent styling across components

## User Preferences

```
Preferred communication style: Simple, everyday language.
```