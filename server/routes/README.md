# API Routes Documentation

This directory contains the modularized API routes for the Cortyx ERP system.

## Route Structure

### Overview
The routes are split into logical modules for better maintainability:

- **index.ts** - Main router that registers all route modules
- **auth.ts** - Authentication endpoints
- **modules.ts** - Module listing endpoints
- **doctypes.ts** - DocType schema endpoints
- **docs.ts** - Document CRUD endpoints

## Endpoints

### Authentication (`auth.ts`)

#### `POST /api/login`
Login endpoint for user authentication.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "email": "user@example.com"
  }
}
```

---

### Modules (`modules.ts`)

#### `GET /api/modules`
List all modules with their associated doctypes.

**Response:**
```json
[
  {
    "moduleName": "CRM",
    "docTypeNames": ["Lead", "Customer", "CRM Note"]
  }
]
```

---

### DocTypes (`doctypes.ts`)

#### `GET /api/doctypes/:doctype`
Get the schema/field definitions for a specific doctype.

**Parameters:**
- `doctype` - The name of the doctype (URL encoded if it contains spaces)

**Example:**
```
GET /api/doctypes/CRM%20Note
```

**Response:**
```json
[
  {
    "fieldname": "title",
    "label": "Title",
    "fieldtype": "Data",
    "reqd": 1,
    "in_list_view": 1
  }
]
```

---

### Documents (`docs.ts`)

#### `GET /api/docs/:doctype`
List documents of a specific doctype with pagination.

**Parameters:**
- `doctype` - The name of the doctype (URL encoded)

**Query Parameters:**
- `page` - Page number (default: 1)
- `pageSize` - Number of items per page (default: 20)

**Example:**
```
GET /api/docs/CRM%20Note?page=1&pageSize=20
```

**Response:**
```json
{
  "data": [
    {
      "name": "DOC-001",
      "title": "Sample Note",
      "...": "other fields"
    }
  ],
  "total": 42,
  "page": 1,
  "pageSize": 20,
  "totalPages": 3
}
```

#### `GET /api/docs/:doctype/:id`
Get a specific document by its ID.

**Parameters:**
- `doctype` - The name of the doctype (URL encoded)
- `id` - The document's name/ID

**Example:**
```
GET /api/docs/CRM%20Note/DOC-001
```

**Response:**
```json
{
  "name": "DOC-001",
  "title": "Sample Note",
  "...": "other fields"
}
```

#### `POST /api/docs/:doctype`
Create a new document.

**Parameters:**
- `doctype` - The name of the doctype (URL encoded)

**Request Body:**
```json
{
  "title": "New Note",
  "description": "This is a new note"
}
```

**Response:**
```json
{
  "name": "auto-generated-uuid",
  "title": "New Note",
  "description": "This is a new note",
  "creation": "2023-10-26T12:00:00Z",
  "modified": "2023-10-26T12:00:00Z"
}
```

#### `PUT /api/docs/:doctype/:id`
Update an existing document.

**Parameters:**
- `doctype` - The name of the doctype (URL encoded)
- `id` - The document's name/ID

**Request Body:**
```json
{
  "title": "Updated Note",
  "description": "Updated description"
}
```

**Response:**
```json
{
  "name": "DOC-001",
  "title": "Updated Note",
  "description": "Updated description",
  "modified": "2023-10-26T13:00:00Z"
}
```

#### `DELETE /api/docs/:doctype/:id`
Delete a document.

**Parameters:**
- `doctype` - The name of the doctype (URL encoded)
- `id` - The document's name/ID

**Response:**
```json
{
  "success": true
}
```

## URL Encoding

**Important:** DocType names that contain spaces or special characters MUST be URL-encoded in the URL path.

Examples:
- `CRM Note` → `CRM%20Note`
- `Sales Order` → `Sales%20Order`

The API automatically decodes these parameters using `decodeURIComponent()`.

## Error Handling

All endpoints return appropriate HTTP status codes:
- `200` - Success
- `201` - Created (for POST requests)
- `400` - Bad Request
- `404` - Not Found
- `500` - Internal Server Error

Error responses have the format:
```json
{
  "error": "Error message description"
}
```

## Logging

All endpoints include detailed logging with prefixes:
- `[DocType Schema]` - Schema-related operations
- `[Docs List]` - Document listing operations
- `[Doc Detail]` - Single document retrieval
- `[Doc Create]` - Document creation
- `[Doc Update]` - Document updates
- `[Doc Delete]` - Document deletion
- `[Storage]` - Database query operations

This helps with debugging and monitoring API usage.

