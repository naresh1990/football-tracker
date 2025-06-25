# Football Player Tracker - Complete Requirements Document

**Project Name**: Football Player Tracker  
**Version**: 1.0  
**Date**: June 25, 2025  
**Player**: Darshil Podishetty  
**Technology Stack**: React, TypeScript, Express.js, PostgreSQL, TanStack Query, Tailwind CSS

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Database Schema](#database-schema)
3. [API Endpoints](#api-endpoints)
4. [User Interface Components](#user-interface-components)
5. [Core Features](#core-features)
6. [Technical Architecture](#technical-architecture)
7. [Business Rules](#business-rules)
8. [File Structure](#file-structure)
9. [Dependencies](#dependencies)
10. [Deployment Configuration](#deployment-configuration)

---

## Executive Summary

The Football Player Tracker is a comprehensive web application designed to monitor and track all aspects of Darshil's football journey. The system provides detailed performance analytics, club management, coach feedback, and career development tracking through a modern, responsive interface.

### Key Objectives
- Track individual player performance across games, training, and tournaments
- Manage multiple club affiliations and coaching relationships
- Provide comprehensive analytics and statistics
- Support photo gallery management for training and achievements
- Enable coach feedback and performance evaluation
- Maintain historical data for career progression analysis

---

## Database Schema

### 1. Players Table
```sql
CREATE TABLE players (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  position TEXT NOT NULL,
  team_name TEXT NOT NULL,
  jersey_number TEXT,
  is_captain BOOLEAN DEFAULT false,
  division TEXT
);
```

**Fields**:
- `id`: Unique identifier (auto-increment)
- `name`: Player's full name
- `age`: Current age in years
- `position`: Playing position (Goalkeeper, Defender, Midfielder, Forward, Winger)
- `team_name`: Current team name
- `jersey_number`: Jersey number as text (allows for custom formats)
- `is_captain`: Boolean flag for team captain status
- `division`: Division or squad level (e.g., "U10 Elite Squad Training")

### 2. Games Table
```sql
CREATE TABLE games (
  id SERIAL PRIMARY KEY,
  player_id INTEGER NOT NULL,
  game_type TEXT NOT NULL, -- "practice", "friendly", "tournament"
  match_format TEXT NOT NULL, -- "2v2", "4v4", "5v5", "7v7", "9v9", "11v11"
  tournament_id INTEGER, -- Foreign key to tournaments table
  tournament_stage TEXT, -- "league", "knockout", "quarter-final", "semi-final", "final"
  opponent TEXT NOT NULL,
  venue TEXT, -- Game venue/location
  date TIMESTAMP NOT NULL,
  home_away TEXT NOT NULL, -- "home" or "away"
  team_score INTEGER NOT NULL,
  opponent_score INTEGER NOT NULL,
  player_goals INTEGER DEFAULT 0,
  player_assists INTEGER DEFAULT 0,
  position_played TEXT NOT NULL,
  minutes_played INTEGER DEFAULT 0,
  mistakes INTEGER DEFAULT 0,
  rating TEXT, -- Coach rating (e.g., "8/10")
  coach_feedback TEXT, -- Post-match feedback
  points_earned INTEGER DEFAULT 0, -- Points for tournament standings
  notes TEXT
);
```

**Business Rules**:
- `game_type` must be one of: "practice", "friendly", "tournament"
- `match_format` must be one of: "2v2", "4v4", "5v5", "7v7", "9v9", "11v11"
- `home_away` must be either "home" or "away"
- `tournament_id` is required when `game_type` is "tournament"
- `points_earned` typically follows: 3 for win, 1 for draw, 0 for loss

### 3. Tournaments Table
```sql
CREATE TABLE tournaments (
  id SERIAL PRIMARY KEY,
  player_id INTEGER NOT NULL,
  club_id INTEGER, -- Foreign key to clubs table
  name TEXT NOT NULL,
  description TEXT,
  venue TEXT, -- Tournament venue/location
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  status TEXT NOT NULL, -- "upcoming", "active", "completed"
  format TEXT, -- "league", "knockout", "group"
  match_format TEXT, -- "5v5", "7v7", "9v9", "11v11"
  total_teams INTEGER,
  current_position INTEGER, -- Current standing in tournament
  points INTEGER DEFAULT 0, -- Total points accumulated
  points_table_image TEXT, -- Path to points table image
  logo TEXT -- Path to tournament logo
);
```

**Business Rules**:
- `status` must be one of: "upcoming", "active", "completed"
- `format` can be: "league", "knockout", "group"
- `current_position` should be between 1 and `total_teams`
- Points are calculated from linked games

### 4. Training Sessions Table
```sql
CREATE TABLE training_sessions (
  id SERIAL PRIMARY KEY,
  player_id INTEGER NOT NULL,
  type TEXT NOT NULL, -- Training type/category
  date TIMESTAMP NOT NULL,
  duration INTEGER NOT NULL, -- Duration in minutes
  location TEXT,
  coach TEXT,
  notes TEXT,
  completed BOOLEAN DEFAULT false,
  attendance TEXT DEFAULT 'pending', -- "pending", "completed", "missed", "cancelled"
  coach_feedback TEXT,
  gallery TEXT[] -- Array of photo paths
);
```

**Training Types**:
- "Team Practice"
- "Speed & Agility"
- "Ball Control"
- "Fitness Training"
- "Shooting Practice"
- "Tactical Training"

**Business Rules**:
- `attendance` must be one of: "pending", "completed", "missed", "cancelled"
- `completed` automatically set to true when attendance is "completed"
- `gallery` stores array of photo file paths

### 5. Coach Feedback Table
```sql
CREATE TABLE coach_feedback (
  id SERIAL PRIMARY KEY,
  player_id INTEGER NOT NULL,
  game_id INTEGER, -- Optional link to specific game
  coach TEXT NOT NULL,
  date TIMESTAMP NOT NULL,
  comment TEXT NOT NULL,
  strengths TEXT[], -- Array of strength areas
  improvements TEXT[], -- Array of improvement areas
  rating DECIMAL -- Numerical rating
);
```

**Business Rules**:
- `strengths` and `improvements` are arrays of text values
- `rating` is stored as decimal for precision
- `game_id` is optional - feedback can be general or game-specific

### 6. Squad Members Table
```sql
CREATE TABLE squad_members (
  id SERIAL PRIMARY KEY,
  player_id INTEGER NOT NULL,
  club_id INTEGER, -- Foreign key to clubs table
  name TEXT NOT NULL,
  position TEXT NOT NULL, -- "Goalkeeper", "Defender", "Midfielder", "Forward"
  jersey_number INTEGER,
  age INTEGER,
  profile_picture TEXT, -- Path to player photo
  notes TEXT
);
```

**Business Rules**:
- Multiple squad members can have the same jersey number across different clubs
- Jersey numbers should be unique within a club
- Profile pictures stored as file paths

### 7. Clubs Table
```sql
CREATE TABLE clubs (
  id SERIAL PRIMARY KEY,
  player_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- "primary", "adhoc"
  squad_level TEXT, -- Squad level description
  season_start TIMESTAMP,
  season_end TIMESTAMP,
  status TEXT NOT NULL DEFAULT 'active', -- "active", "inactive"
  description TEXT,
  logo TEXT -- Path to club logo
);
```

**Business Rules**:
- `type` must be either "primary" or "adhoc"
- Only one club can have `status` = "active" at a time (single active club constraint)
- Primary clubs typically have season dates, adhoc clubs may not

### 8. Coaches Table
```sql
CREATE TABLE coaches (
  id SERIAL PRIMARY KEY,
  player_id INTEGER NOT NULL,
  club_id INTEGER, -- Foreign key to clubs table
  name TEXT NOT NULL,
  title TEXT NOT NULL, -- "Head Coach", "Assistant Coach", "Adhoc Coach"
  contact TEXT,
  is_active BOOLEAN DEFAULT true,
  profile_picture TEXT -- Path to coach photo
);
```

**Coach Titles**:
- "Head Coach"
- "Assistant Coach"
- "Adhoc Coach"
- "Goalkeeper Coach"

### 9. Coaching Staff Table
```sql
CREATE TABLE coaching_staff (
  id SERIAL PRIMARY KEY,
  player_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL, -- "head_coach", "assistant_coach", "goalkeeper_coach"
  contact TEXT
);
```

**Business Rules**:
- Separate from coaches table for different organizational structure
- Role values: "head_coach", "assistant_coach", "goalkeeper_coach"

### 10. Gallery Photos Table
```sql
CREATE TABLE gallery_photos (
  id SERIAL PRIMARY KEY,
  player_id INTEGER NOT NULL REFERENCES players(id),
  filename TEXT NOT NULL,
  original_name TEXT NOT NULL,
  caption TEXT,
  training_session_id INTEGER REFERENCES training_sessions(id),
  uploaded_at TIMESTAMP DEFAULT NOW()
);
```

**Business Rules**:
- Photos can be linked to training sessions via `training_session_id`
- Original filename preserved for user reference
- Automatic timestamp on upload

---

## API Endpoints

### Player Management
- `GET /api/players` - Retrieve all players
- `GET /api/players/:id` - Get specific player details
- `POST /api/players` - Create new player
- `PUT /api/players/:id` - Update player (supports file upload for profile picture)

### Game Management
- `GET /api/games` - Get all games for player
- `GET /api/games/:id` - Get specific game details
- `POST /api/games` - Create new game record
- `PUT /api/games/:id` - Update game record
- `DELETE /api/games/:id` - Delete game record
- `GET /api/games/recent` - Get recent games (limited)

### Tournament Management
- `GET /api/tournaments` - Get all tournaments
- `GET /api/tournaments/:id` - Get specific tournament details
- `POST /api/tournaments` - Create new tournament
- `PUT /api/tournaments/:id` - Update tournament
- `DELETE /api/tournaments/:id` - Delete tournament

### Training Management
- `GET /api/training` - Get all training sessions
- `GET /api/training/:id` - Get specific training session
- `POST /api/training` - Create new training session
- `PUT /api/training/:id` - Update training session
- `DELETE /api/training/:id` - Delete training session
- `GET /api/training/upcoming` - Get upcoming training sessions
- `POST /api/training/:id/photos` - Upload photos to training session

### Coach & Feedback Management
- `GET /api/coaches` - Get all coaches
- `POST /api/coaches` - Create new coach
- `PUT /api/coaches/:id` - Update coach
- `DELETE /api/coaches/:id` - Delete coach
- `GET /api/feedback` - Get all coach feedback
- `POST /api/feedback` - Create new feedback
- `PUT /api/feedback/:id` - Update feedback
- `DELETE /api/feedback/:id` - Delete feedback

### Club Management
- `GET /api/clubs` - Get all clubs
- `GET /api/clubs/active` - Get currently active club
- `POST /api/clubs` - Create new club
- `PUT /api/clubs/:id` - Update club
- `DELETE /api/clubs/:id` - Delete club

### Squad Management
- `GET /api/squad` - Get squad members
- `POST /api/squad` - Add squad member
- `PUT /api/squad/:id` - Update squad member
- `DELETE /api/squad/:id` - Remove squad member

### Statistics & Analytics
- `GET /api/stats/all-time` - Get all-time statistics
- `GET /api/stats/summary` - Get current season summary (club-specific)
- `GET /api/stats/training` - Get training statistics

### Gallery Management
- `GET /api/gallery` - Get all gallery photos
- `POST /api/gallery` - Upload new photos
- `DELETE /api/gallery/:id` - Delete photo

### File Upload Support
- Profile pictures (players, coaches, squad members)
- Club logos
- Tournament logos
- Points table images
- Gallery photos
- Training session photos

---

## User Interface Components

### Pages
1. **Dashboard** (`/`) - Main overview with statistics and recent activity
2. **Games** (`/games`) - Game management and history
3. **Tournaments** (`/tournaments`) - Tournament tracking and management
4. **Training** (`/training`) - Training session calendar and management
5. **Statistics** (`/statistics`) - Comprehensive performance analytics
6. **Clubs** (`/clubs`) - Club and squad management
7. **Gallery** (`/gallery`) - Photo gallery management

### Key UI Components

#### Forms
- **PlayerProfileForm** - Player information editing with image upload
- **GameForm** - Game recording with comprehensive match details
- **TournamentForm** - Tournament creation and management
- **TrainingSessionForm** - Training session scheduling
- **CoachFeedbackForm** - Coach evaluation input
- **ClubForm** - Club information management

#### Display Components
- **HeroBanner** - Dashboard header with key player info
- **StatsCard** - Performance statistics display
- **GameCard** - Individual game result display
- **TournamentCard** - Tournament status and progress
- **TrainingCalendar** - Interactive calendar for training sessions
- **GalleryGrid** - Photo gallery with modal viewing

#### Navigation
- **CleanHeader** - Main navigation bar
- **MobileNav** - Responsive mobile navigation

---

## Core Features

### 1. Player Profile Management
- Complete player information tracking
- Profile picture upload and management
- Jersey number and position tracking
- Career progression monitoring

### 2. Game Performance Tracking
- Multiple game types (practice, friendly, tournament)
- Various match formats (2v2 to 11v11)
- Comprehensive performance metrics
- Coach ratings and feedback
- Tournament point tracking

### 3. Tournament Management
- Tournament creation and tracking
- Position and points management
- Dynamic statistics calculation from games
- Image upload for tournament materials

### 4. Training Session Management
- Interactive calendar interface
- Multiple training types
- Attendance tracking
- Photo gallery integration
- Coach feedback system

### 5. Coach & Feedback System
- Multiple coach relationships
- Structured feedback with strengths/improvements
- Game-specific and general feedback
- Rating system integration

### 6. Club & Squad Management
- Multiple club affiliations
- Single active club constraint
- Squad member management with photos
- Coaching staff organization

### 7. Statistics & Analytics
- All-time vs current season statistics
- Club-specific performance tracking
- Training attendance and completion rates
- Comprehensive performance dashboards

### 8. Gallery Management
- Photo upload with captions
- Training session integration
- Date-based organization
- Modal viewing interface

---

## Technical Architecture

### Frontend Stack
- **React 18** with TypeScript
- **Vite** for build tooling and development server
- **TanStack Query v5** for server state management
- **Wouter** for client-side routing
- **React Hook Form** with Zod validation
- **Tailwind CSS** with shadcn/ui components
- **Lucide React** for icons

### Backend Stack
- **Express.js** with TypeScript
- **Drizzle ORM** for database operations
- **PostgreSQL** (Neon-hosted) for data persistence
- **Multer** for file upload handling
- **Moment.js** with timezone support

### Key Libraries
- **@radix-ui** - Headless UI primitives
- **class-variance-authority** - Component variant management
- **react-big-calendar** - Training calendar interface
- **recharts** - Statistics visualization
- **framer-motion** - Animations and transitions

### Development Tools
- **tsx** - TypeScript execution for development
- **esbuild** - Backend bundling for production
- **drizzle-kit** - Database migrations and introspection

---

## Business Rules

### Data Integrity
1. **Single Active Club**: Only one club can have status "active" at any time
2. **Tournament Games**: Games with type "tournament" must have valid tournament_id
3. **Jersey Numbers**: Should be unique within a club but can repeat across clubs
4. **Date Validation**: Training sessions and games must have valid future/past dates
5. **File Uploads**: Maximum 5MB per image, validated file types only

### Performance Calculations
1. **Tournament Points**: Calculated from linked games (3 win, 1 draw, 0 loss)
2. **Statistics**: Current season stats filtered by active club and date range
3. **Training Attendance**: Calculated based on IST timezone for accurate date comparison
4. **Goal/Assist Tracking**: Accumulated from all game records

### User Experience
1. **Responsive Design**: Mobile-first approach with desktop enhancements
2. **Real-time Updates**: Query invalidation for immediate UI updates
3. **Optimistic Updates**: UI updates before server confirmation
4. **Error Handling**: Comprehensive error states and user feedback

---

## File Structure

```
├── client/                     # React frontend
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/            # Page components
│   │   ├── lib/              # Utilities and configurations
│   │   └── hooks/            # Custom React hooks
├── server/                    # Express backend
│   ├── index.ts              # Server entry point
│   ├── routes.ts             # API route definitions
│   ├── storage.ts            # Database interface
│   └── db.ts                 # Database connection
├── shared/                    # Shared types and schemas
│   └── schema.ts             # Drizzle schema definitions
├── uploads/                   # File upload directory
└── dist/                     # Production build output
```

---

## Dependencies

### Production Dependencies
- **Database**: @neondatabase/serverless, drizzle-orm, drizzle-zod
- **Backend**: express, multer, moment-timezone
- **Frontend**: react, react-dom, @tanstack/react-query
- **UI**: @radix-ui/*, tailwindcss, lucide-react
- **Forms**: react-hook-form, @hookform/resolvers
- **Validation**: zod, zod-validation-error
- **Routing**: wouter
- **Charts**: recharts
- **Calendar**: react-big-calendar
- **File Handling**: react-image-crop

### Development Dependencies
- **TypeScript**: typescript, @types/*
- **Build Tools**: vite, esbuild, tsx
- **Database Tools**: drizzle-kit
- **Styling**: tailwindcss, autoprefixer, postcss

---

## Deployment Configuration

### Environment Variables
- `DATABASE_URL` - PostgreSQL connection string
- `NODE_ENV` - Environment mode (development/production)
- `PORT` - Server port (default: 5000)

### Build Process
1. Frontend built with Vite to `dist/public`
2. Backend bundled with esbuild to `dist/index.js`
3. Static files served from build output
4. Database schema pushed with `drizzle-kit push`

### Replit Configuration
- **Runtime**: Node.js 20 with PostgreSQL 16
- **Deployment**: Autoscale target
- **Port Mapping**: Internal 5000 → External 80
- **File Uploads**: Persistent storage in uploads directory

---

## Current Status

### Implemented Features ✓
- Complete player profile management
- Game tracking with comprehensive metrics
- Tournament management with dynamic calculations
- Training session calendar with photo integration
- Coach feedback system
- Club and squad management with single active club constraint
- Photo gallery with training session linking
- Statistics dashboard with club-specific filtering
- Responsive UI with modern design

### Database State
- PostgreSQL database with all tables created
- Sample data cleared - application uses authentic data only
- Active club: Sporthood FC (2025-26 season)
- Current player: Darshil (Age 8, Position: Winger, Jersey #9)

### Recent Enhancements
- Enhanced training calendar with color-coded status indicators
- Gallery system with date-based organization
- Tournament position inline editing
- Club-specific statistics filtering
- Training session photo upload with batch processing
- Improved mobile responsiveness and UI polish

---

**Document Version**: 1.0  
**Last Updated**: June 25, 2025  
**Status**: Production Ready  
**Total Features**: 50+ individual features across 8 major categories