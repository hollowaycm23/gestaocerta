# GestorCondo 360 - Condominium Management System

## Overview
GestorCondo 360 is a comprehensive condominium management system built with React and TypeScript. This application provides a complete solution for managing residential buildings, including units, residents, finances, maintenance, suppliers, documents, and infractions.

## Current State
- **Status**: Fully configured and running in Replit environment
- **Technology Stack**: React 19, TypeScript, Vite, Tailwind CSS
- **AI Integration**: Uses Gemini API for AI-powered features
- **Language**: Portuguese (pt-BR)

## Recent Changes (November 27, 2025)
1. Imported project from GitHub
2. Configured Vite to run on port 5000 for Replit compatibility
3. Added HMR configuration for proper hot module replacement in Replit
4. Set up GEMINI_API_KEY as a secret
5. Created workflow for development server
6. Configured deployment for production use

## Project Architecture

### Frontend Structure
- **Entry Point**: `index.tsx` - Main React application with all components
- **Styling**: Tailwind CSS (loaded via CDN)
- **Icons**: Lucide React icon library
- **Build Tool**: Vite with React plugin

### Key Features
1. **Dashboard**: Overview of key metrics (finances, occupancy, maintenance, delinquency)
2. **Units Management**: Track all residential units and their status
3. **Residents**: Manage resident information and occupancy
4. **Financial**: Income and expense tracking with categories
5. **Maintenance**: Preventive and corrective maintenance scheduling
6. **Suppliers**: Contractor and service provider management
7. **Documents**: Legal documents and certificates with expiry tracking
8. **Infractions**: Rule violation tracking and fines management
9. **Settings**: System configuration and user management

### Data Model
The application uses mock data for demonstration purposes. All data is stored in memory and defined in `index.tsx`:
- Units: Building units with owner/tenant information
- Residents: Personal information and contact details
- Finances: Income and expense transactions
- Maintenance: Service orders and schedules
- Suppliers: Service providers and contracts
- Documents: Legal and administrative documents
- Infractions: Rule violations and fines

## Environment Variables

### Development
- `GEMINI_API_KEY`: API key for Google Gemini AI (stored as Replit Secret)

⚠️ **Security Note**: The Vite configuration exposes the GEMINI_API_KEY to the client bundle via the `define` option. This follows the original GitHub repository's design as a client-side only application. In a production environment, it's recommended to add a backend API proxy to keep the API key secure on the server side.

## Running the Application

### Development
The application runs automatically via the configured workflow:
- Command: `npm run dev`
- Port: 5000 (required for Replit webview)
- Hot reload: Enabled with proper HMR configuration

### Production Build
```bash
npm run build    # Builds the production bundle
npm run preview  # Previews the production build
```

### Deployment
The application is configured for Replit Autoscale deployment:
- Build command: `npm run build`
- Run command: `npm run preview`
- Deployment type: Autoscale (stateless web application)

## Configuration Files

### vite.config.ts
- Port: 5000 (Replit requirement)
- Host: 0.0.0.0 (allows external connections)
- HMR: Configured for Replit proxy environment
- Environment variables: GEMINI_API_KEY exposed to client

### package.json
- React 19.2.0
- Vite 6.2.0
- TypeScript 5.8.2
- Lucide React icons

### tsconfig.json
- Target: ES2022
- Module: ESNext
- JSX: react-jsx
- Path alias: `@/*` maps to root directory

## User Preferences
No specific user preferences recorded yet.

## Notes
- The application uses import maps to load React from CDN in development
- Mock data is used throughout for demonstration
- All text and UI is in Portuguese (Brazilian)
- The system supports multi-tenant management (multiple condominiums)
