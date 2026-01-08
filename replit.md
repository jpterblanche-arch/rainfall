# Rainfall Tracking App

## Overview

A simple utility application for recording and monitoring daily rainfall measurements. Users can enter rainfall data by date, save records to a database, and view monthly totals. The app prioritizes efficiency and data clarity over visual complexity, following a clean Material Design pattern.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **Forms**: React Hook Form with Zod validation
- **Styling**: Tailwind CSS with CSS variables for theming
- **Component Library**: shadcn/ui (Radix primitives with custom styling)
- **Build Tool**: Vite with hot module replacement

**Design Pattern**: Single-page application with card-based layout. Three main sections: entry form (top), monthly totals grid, and records table. Uses a data-first approach with monospace fonts for numerical values.

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript (ESM modules)
- **API Style**: RESTful JSON endpoints
- **Validation**: Zod schemas shared between client and server

**API Endpoints**:
- `GET /api/rainfall` - Fetch all rainfall records
- `GET /api/rainfall/monthly` - Get monthly aggregated totals
- `POST /api/rainfall` - Create new rainfall record

### Data Storage
- **ORM**: Drizzle ORM
- **Database**: PostgreSQL (configured via DATABASE_URL environment variable)
- **Current State**: Uses in-memory storage (MemStorage class) as fallback
- **Schema Location**: `shared/schema.ts`

**Data Model**:
- `rainfall_records` table with id (varchar), date (date), amount (integer in mm)
- Monthly totals computed on-the-fly from records

### Build System
- **Development**: Vite dev server with HMR proxied through Express
- **Production**: Vite builds static assets to `dist/public`, esbuild bundles server to `dist/index.cjs`
- **Database Migrations**: Drizzle Kit with `db:push` command

## External Dependencies

### Database
- **PostgreSQL**: Required for production. Set `DATABASE_URL` environment variable.
- **Drizzle Kit**: Schema management and migrations

### UI Component Libraries
- **Radix UI**: Accessible component primitives (dialog, popover, select, etc.)
- **shadcn/ui**: Pre-styled components using Radix + Tailwind
- **Lucide React**: Icon library

### Date Handling
- **date-fns**: Date formatting and manipulation

### Development Tools
- **Replit Plugins**: Runtime error overlay, cartographer, dev banner (development only)