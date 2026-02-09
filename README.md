# OptiCall UI

This is the frontend and backend application for OptiCall Admin Dashboard.

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (for backend)

## Setup

1.  Install dependencies:

    ```bash
    npm install
    ```

2.  Configure Environment Variables:
    - Create a `.env` file in the root directory (optional for now as defaults are set).
    - `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_NAME`, `DB_PORT` for database connection.

## Development

### Frontend

To run the React frontend:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

### Backend

To run the Express backend:

```bash
node server/index.js
```

The server will run on port 3000.

## Project Structure

- `src/`: React frontend source code.
  - `pages/`: Application pages (Login, Dashboard, Report).
  - `components/`: Reusable UI components.
  - `services/`: API integration.
- `server/`: Express backend source code.
  - `index.js`: Server entry point.
  - `db.js`: Database connection.

## Features

- **Admin Login**: Secure login with 12-character password validation.
- **Dashboard**: Navigation to Batch and Call status reports.
- **Report View**: Date range selector and data table for status reports.
- **Mobile Friendly**: Optimized for mobile devices.
