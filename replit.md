# Cortyx - AI-Driven ERP System

## Overview
Cortyx is a metadata-driven Enterprise Resource Planning (ERP) system with dynamic UI generation. The entire application structure is defined by schemas, allowing the UI to automatically adapt to different data types and business entities without hardcoding specific views.

## Project Architecture

### Metadata-Driven Design
- **Dynamic Navigation**: Sidebar navigation is generated from `/api/modules` endpoint
- **Dynamic Forms**: Forms are automatically generated based on field schemas from `/api/doctypes/:name`
- **Dynamic Tables**: List views are created dynamically based on `in_list_view` field property
- **Link Field Intelligence**: Special modal selector for linking documents across DocTypes

### Technology Stack
- **Frontend**: React, Wouter (routing), TanStack Query, Shadcn UI components, Tailwind CSS
- **Backend**: Express.js with in-memory storage
- **Styling**: Stone color palette with purple accent, Inter font for UI, Space Grotesk for display

## Project Structure

### Frontend Components
- `components/theme-provider.tsx` - Dark/light mode management
- `components/theme-toggle.tsx` - Theme switcher button
- `components/app-sidebar.tsx` - Dynamic collapsible sidebar with module navigation
- `components/data-table.tsx` - Reusable table with pagination, search, and actions
- `components/dynamic-form.tsx` - Automatically generates forms from schema
- `components/dynamic-form-field.tsx` - Renders different input types based on fieldtype
- `components/link-field-modal.tsx` - Modal selector for linking documents

### Pages
- `pages/landing.tsx` - Public landing page with hero section and features
- `pages/login.tsx` - Authentication page (demo mode)
- `pages/app-layout.tsx` - Protected application layout with sidebar
- `pages/document-list.tsx` - Dynamic list view for any DocType
- `pages/document-detail.tsx` - Read-only document view
- `pages/document-form.tsx` - Create/edit forms for any DocType

### Backend
- `server/storage.ts` - In-memory storage with realistic ERP sample data
- `server/routes.ts` - RESTful API endpoints for modules, schemas, and documents

## API Endpoints

### Modules & Schemas
- `GET /api/modules` - Returns all modules and their DocTypes
- `GET /api/doctypes/:name` - Returns field schema for a DocType

### Document CRUD
- `GET /api/docs/:doctype` - List documents with pagination
- `GET /api/docs/:doctype/:id` - Get single document
- `POST /api/docs/:doctype` - Create new document
- `PUT /api/docs/:doctype/:id` - Update existing document
- `DELETE /api/docs/:doctype/:id` - Delete document

### Authentication
- `POST /api/login` - Demo login (accepts any email with 6+ char password)

## Field Types
The system supports multiple field types that render differently:
- **Data**: Text input
- **Int/Float/Currency**: Number input with appropriate formatting
- **Text Editor**: Textarea for long-form content
- **Select**: Dropdown with predefined options
- **Link**: Special field that opens modal to select from linked DocType
- **Check**: Checkbox for boolean values

## Sample Data
The system includes realistic sample data for:
- **CRM**: Opportunities, Customers, Leads
- **Accounts**: Accounts, Journal Entries, Purchase/Sales Invoices
- **Assets**: Assets, Asset Categories, Locations
- **Stock**: Items, Warehouses, Stock Entries, Delivery Notes

## Design Guidelines
- Minimalist professional aesthetic with futuristic AI theme
- Stone color palette (grays) with purple/violet accent color
- Consistent spacing and typography throughout
- Responsive design for all screen sizes
- Dark/light mode support

## User Journey
1. Land on homepage → Click "Explore Demo" or "Login"
2. Login with any email and 6+ character password
3. Navigate using sidebar (modules expand to show DocTypes)
4. Click DocType to view list of documents
5. Create new document or edit existing one
6. Link fields open modal to select from related DocTypes
7. Save changes and view document detail page

## Recent Changes
- 2025-01-20: Initial implementation of complete metadata-driven ERP system
- Implemented all core features: dynamic navigation, forms, tables, and link field modals
- Added comprehensive sample data across CRM, Accounts, Assets, and Stock modules
- Configured stone color palette with purple accent throughout the UI
