# Personal Media Collection Tracker

A full-stack web application built with Next.js, NestJS, Prisma, and Supabase for tracking your personal media collection including movies, TV shows, books, games, and podcasts.

## 🚀 Features

- **User Authentication**: Secure signup/signin with JWT tokens
- **Media Management**: Add, edit, delete, and organize your media items
- **Status Tracking**: Track progress with statuses (Want to Watch, Watching, Completed, Dropped, On Hold)
- **AI Recommendations**: Get personalized recommendations using Hugging Face AI (free alternative to OpenAI)
- **Statistics Dashboard**: View collection insights and progress analytics
- **Search & Filter**: Find media by title, type, and status
- **Rating System**: Rate your media items from 1-10
- **Notes**: Add personal notes for each media item

## 🏗️ Project Structure

This project uses **Turborepo** for monorepo management with the following structure:

```
personal_media_collection_tracker/
├── apps/
│   ├── backend/          # NestJS API Server
│   └── frontend/         # Next.js Web Application
├── packages/
│   ├── eslint-config/    # Shared ESLint configuration
│   ├── typescript-config/ # Shared TypeScript configuration
│   └── ui/              # Shared UI components
├── package.json         # Root package.json with workspaces
├── turbo.json          # Turborepo configuration
└── pnpm-workspace.yaml # PNPM workspace configuration
```

## 🛠️ Tech Stack

### Backend (NestJS)
- **Framework**: NestJS with TypeScript
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **Authentication**: JWT with Passport
- **Password Hashing**: bcryptjs
- **Validation**: class-validator & class-transformer
- **AI Integration**: Hugging Face Inference API (free)

### Frontend (Next.js)
- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **Icons**: Heroicons
- **State Management**: Zustand with persistence
- **HTTP Client**: Axios
- **UI Components**: Headless UI & Radix UI

### Database Schema
```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String?
  avatar    String?
  accounts   Account[]
  mediaItems MediaItem[]
}

model Account {
  id        String   @id @default(uuid())
  userId    String
  type      String   # "credentials", "google", etc.
  provider  String   # "credentials", "google", etc.
  password  String?  # Only for credentials type
  user User @relation(fields: [userId], references: [id])
}

model MediaItem {
  id          String     @id @default(uuid())
  title       String
  type        MediaType  # MOVIE, TV_SHOW, BOOK, GAME, PODCAST
  status      MediaStatus @default(WANT_TO_WATCH)
  rating      Int?       @db.SmallInt
  notes       String?
  coverUrl    String?
  userId      String
  user        User       @relation(fields: [userId], references: [id])
}
```

## 📁 Backend Structure

```
apps/backend/src/
├── auth/
│   ├── auth.controller.ts    # Authentication endpoints
│   ├── auth.service.ts       # Auth business logic
│   ├── auth.module.ts        # Auth module configuration
│   ├── jwt.strategy.ts       # JWT validation strategy
│   └── jwt-auth.guard.ts     # JWT guard for protected routes
├── media/
│   ├── media.controller.ts   # Media CRUD endpoints
│   ├── media.service.ts      # Media business logic
│   ├── media.module.ts       # Media module configuration
│   └── dto/media.dto.ts      # Data transfer objects
├── ai/
│   ├── ai.controller.ts      # AI recommendation endpoints
│   ├── ai.service.ts         # AI integration logic
│   └── ai.module.ts          # AI module configuration
├── prisma/
│   ├── prisma.service.ts     # Prisma client service
│   └── prisma.module.ts      # Global Prisma module
├── app.module.ts             # Root application module
└── main.ts                   # Application bootstrap
```

### Backend API Endpoints

#### Authentication
- `POST /auth/signup` - User registration
- `POST /auth/signin` - User login
- `GET /auth/profile` - Get current user profile

#### Media Management
- `GET /media` - Get all user's media items (with filters)
- `POST /media` - Create new media item
- `GET /media/:id` - Get specific media item
- `PATCH /media/:id` - Update media item
- `DELETE /media/:id` - Delete media item
- `GET /media/search?q=query` - Search media items
- `GET /media/stats` - Get user's collection statistics

#### AI Features
- `GET /ai/recommendations` - Get personalized recommendations
- `GET /ai/recommendations?type=MOVIE` - Get type-specific recommendations
- `GET /ai/insights` - Get collection insights and analytics

## 🎨 Frontend Structure

```
apps/frontend/src/
├── app/
│   ├── auth/
│   │   ├── signin/page.tsx   # Sign in page
│   │   └── signup/page.tsx   # Sign up page
│   ├── media/page.tsx        # Media management page
│   ├── status/page.tsx       # Status tracking & analytics
│   ├── ai/page.tsx           # AI recommendations page
│   ├── layout.tsx            # Root layout with navigation
│   ├── page.tsx              # Dashboard homepage
│   └── globals.css           # Global styles
├── components/
│   ├── Navbar.tsx            # Main navigation component
│   └── AuthProvider.tsx     # Authentication context provider
├── lib/
│   └── api.ts                # API service layer
└── store/
    └── auth.ts               # Zustand auth store
```

### Frontend Pages

1. **Dashboard** (`/`) - Overview with stats, quick actions, and recent additions
2. **Media Collection** (`/media`) - Full CRUD interface for managing media items
3. **Status Tracking** (`/status`) - Analytics and progress visualization
4. **AI Recommendations** (`/ai`) - Personalized suggestions and insights
5. **Authentication** (`/auth/signin`, `/auth/signup`) - User registration and login

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ and PNPM
- Supabase account and database
- Hugging Face account (free)

### Environment Setup

**Backend Environment** (`apps/backend/.env`):
```env
DATABASE_URL=your_supabase_database_url
DIRECT_URL=your_supabase_direct_url
JWT_SECRET=your_jwt_secret_key
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
HUGGINGFACE_API_KEY=your_huggingface_api_key
```

### Installation & Running

1. **Install dependencies:**
```bash
pnpm install
```

2. **Setup database:**
```bash
cd apps/backend
npx prisma db push
npx prisma generate
```

3. **Run development servers:**
```bash
# Backend (port 3001)
cd apps/backend && npm run start:dev

# Frontend (port 3000)
cd apps/frontend && npm run dev
```

## 🎯 Key Features Explained

### 1. User Authentication
- Secure JWT-based authentication
- Password hashing with bcryptjs
- Protected routes and API endpoints
- Persistent login state with Zustand

### 2. Media Management
- Support for 5 media types: Movies, TV Shows, Books, Games, Podcasts
- 5 status levels: Want to Watch, Watching, Completed, Dropped, On Hold
- Rating system (1-10 scale)
- Personal notes for each item
- Advanced search and filtering

### 3. Status Tracking
- Real-time statistics dashboard
- Progress visualization with charts
- Collection breakdown by type and status
- Average rating calculations

### 4. AI Recommendations
- Integration with Hugging Face's free AI models
- Personalized suggestions based on user's rated content
- Type-specific recommendations
- Collection insights and analysis

## 🔒 Security Features

- JWT token authentication
- Password hashing with bcryptjs
- Protected API routes with guards
- Input validation and sanitization
- CORS configuration
- Environment variable protection

## 📝 Development Process (1.5 Hours)

### Hour 1: Backend Setup
1. **Project Structure** (15 min)
   - Set up Turborepo monorepo
   - Created NestJS app with required dependencies
   - Configured Prisma with Supabase PostgreSQL

2. **Database Design** (15 min)
   - Designed User, Account, and MediaItem models
   - Set up relationships and enums
   - Pushed schema to Supabase

3. **Authentication System** (15 min)
   - Implemented JWT authentication
   - Created auth service, controller, and guards
   - Added password hashing and validation

4. **Media Management API** (15 min)
   - Built CRUD operations for media items
   - Added search, filtering, and statistics
   - Implemented user-specific data access

### Hour 1.5: Frontend & AI
1. **Frontend Setup** (20 min)
   - Created Next.js app with Tailwind CSS
   - Set up API service layer with Axios
   - Implemented Zustand store for state management

2. **UI Components** (25 min)
   - Built authentication pages (signin/signup)
   - Created media management interface
   - Developed status tracking dashboard
   - Added AI recommendations page

3. **AI Integration** (5 min)
   - Integrated Hugging Face for free AI recommendations
   - Created recommendation service and endpoints

## 🚀 Deployment Ready

The application is structured for easy deployment:
- **Backend**: Railway, Heroku, or any Node.js hosting
- **Frontend**: Vercel, Netlify, or static hosting
- **Database**: Supabase managed PostgreSQL

## 🔄 Future Enhancements

- Image upload for media covers
- Social features (sharing collections)
- Import from external APIs (TMDB, Goodreads)
- Offline support with PWA
- Push notifications
- Advanced analytics and reports

---

**Built in 1.5 hours as a rapid prototype demonstrating modern full-stack development with TypeScript, NestJS, Next.js, Prisma, and Supabase.**
