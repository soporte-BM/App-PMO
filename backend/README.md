# PMO App Backend

Node.js + Express + TypeScript backend connected to MongoDB Atlas.

## Setup

1.  **Install Dependencies**
    ```bash
    cd backend
    npm install
    ```

2.  **Environment Variables**
    Create a `.env` file in the `backend` directory (copy from `.env.example`):
    ```ini
    PORT=3000
    MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/pmobm?retryWrites=true&w=majority
    ```

3.  **Run Locally**
    ```bash
    npm run dev
    ```

## API Endpoints

### Projects
- `GET /api/projects`
- `POST /api/projects` (Admin)

### Resources
- `GET /api/resources`
- `POST /api/resources` (Admin/PMO)

### Rates
- `GET /api/rates?period=YYYY-MM-01`
- `POST /api/rates` (Admin/PMO)

### Closures
- `GET /api/closures?projectCode=...&period=YYYY-MM-01`
- `POST /api/closures` (Draft)
- `POST /api/closures/:id/validate`
- `POST /api/closures/:id/unvalidate`

## Authentication
Currently simulated via Headers for development:
- `x-user-role`: `ADMIN`, `PMO`, `DIRECTOR`, or `CONSULTA`.
- `x-user-name`: string
