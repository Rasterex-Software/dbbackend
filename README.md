# rx-back-end  

Backend service for authentication, user management, projects, and annotations.  

---

## Quick Start Checklist

Follow these steps to set up the rx-back-end for the first time:

This db-backend requires **Node.js** and **PostgreSQL** to be installed on the server.

1. **Install prerequisites**
   - [Install Node.js](https://nodejs.org/) v18+ (includes npm)  
   - [Install PostgreSQL](https://www.postgresql.org/download/) v17+  

2. **Acquire and prepare project files**
   - Option A: Clone the repository (developer setup)  
     ```bash
     git clone <repo-url>
     cd rx-back-end
     ```  
   - Option B: Copy files to the server (deployment setup)  
     - Create a folder on the server, e.g. `C:\rx-back-end` (Windows) or `/opt/rx-back-end` (Linux).  
     - Copy the following into that folder:  
       - `app/` (source files: `controllers/`, `models/`, `routes/`, etc.)  
       - `server.js`  
       - `seed.js`  
       - `swagger.js`  
       - `package.json`  
       - `package-lock.json`  
       - `Scripts/` (SQL setup scripts)  
       - `.env.example`  
       - `docs/` (documentation)  

3. **Install dependencies**  
   Open a terminal/command prompt, navigate to the folder where the files are located, and run:  
   ```bash
   npm install
   ```

4. **Configure environment variables**
   - Copy `.env.example` to `.env`  
   - Update database credentials, server port, and CORS origin  

   - On **Linux/Mac**:
     ```bash
     cp .env.example .env
     ```
   - On **Windows (PowerShell/Command Prompt)**:
     ```powershell
     copy .env.example .env
     ```

   Example `.env` values:
   ```env
   # Database configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=postgres
   DB_NAME=rxdb

   # Server port
   PORT=8080

   # Allowed origin (CORS)
   # Set this to the frontend domain that will connect to the API.
   # For development, use http://localhost:4200
   ALLOWED_ORIGIN=https://myserver.mydomain.com
   
   ```

5. **Set up the database**
   - Run provided scripts from the `Scripts/` folder:  
     - **Windows:** `./Scripts/setup_db.bat`  
     - **Linux/Mac:** `./Scripts/setup_db.sh`  
   - Or run SQL manually with `psql`:  
     ```bash
     psql -U <username> -d rxdb -f Scripts/create_tables.sql
     psql -U <username> -d rxdb -f Scripts/schema.sql
     psql -U <username> -d rxdb -f Scripts/insert_data.sql
     ```

   - To reset the database:  
     - **Windows:**  
       ```powershell
       ./Scripts/drop_tables.bat
       ```  
     - **Manual:**  
       ```bash
       psql -U <username> -d rxdb -f Scripts/drop_tables.sql
       ```

6. **Start the backend server**
   ```bash
   npm start
   ```
   - Server runs at [http://localhost:8080](http://localhost:8080)  
   - Swagger docs available at [http://localhost:8080/api-docs](http://localhost:8080/api-docs)  

7. **(Optional) Run as a service with PM2**

   [PM2](https://pm2.keymetrics.io/) is a process manager for Node.js. It keeps the backend running in the background, restarts it if it crashes, and can auto-start on boot.  

   - Install PM2 globally:
     ```bash
     npm install -g pm2
     pm2 -v
     ```
   - Start the service:
     ```bash
     pm2 start server.js --name "rx-backend"
     ```
   - Monitor logs and processes:
     ```bash
     pm2 ps
     pm2 logs rx-backend
     ```
   - Stop or restart:
     ```bash
     pm2 stop rx-backend
     pm2 restart rx-backend
     ```
   - Enable auto-start on reboot:
     ```bash
     pm2 startup
     pm2 save
     ```

8. **(Optional) Configure IIS reverse proxy**
   - For production with HTTPS access, configure IIS with ARR + URL Rewrite  
   - Full guide: [IIS Proxy Setup](./docs/iis-proxy-setup.md)

---

## API Endpoints (Overview)

### Authentication  
- `POST /api/login` — login  
- `GET /api/logout` — logout  

### Users  
- `POST /api/user` — create user  
- `GET /api/users` — get all users  
- `GET /api/users/:id` — get user by ID  
- `PUT /api/users/:id` — update user  

### Annotations  
- `POST /api/annotation` — create annotation  
- `GET /api/annotations` — get all annotations  
- `GET /api/annotations/:id` — get annotation by ID  
- `PUT /api/annotations/:id` — update annotation  
- `DELETE /api/annotations/:id` — delete annotation  

### Projects  
- `GET /api/projects/:projId/permissions` — get project permissions  

👉 Full API docs available in **Swagger UI**.  

---

## IIS Reverse Proxy  

For production deployments behind IIS (Windows Server), a secure reverse proxy can be set up using **ARR** and **URL Rewrite**.  

See [IIS Proxy Setup Guide](./docs/iis-proxy-setup.md) for details.  

---

## Troubleshooting  

- **Port already in use** → Change `PORT` in `.env`.  
- **DB connection errors** → Verify PostgreSQL is running, `.env` values are correct.  
- **Swagger not loading** → Ensure the server runs without errors (`npm start`).  
- **CORS issues** → Update `ALLOWED_ORIGIN` in `.env` to match your frontend domain.  

---
