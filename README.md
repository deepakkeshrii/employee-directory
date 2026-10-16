git-hub repo: https://github.com/deepakkeshrii/employee-directory

# Employee Directory

A full-stack employee management app built with Next.js, Express, and MongoDB.

**Repository:** https://github.com/deepakkeshrii/employee-directory

## Quick Review

1. Open the app in a browser at [http://localhost:3000](http://localhost:3000). If it is not running, follow the setup steps below or ask the project owner to start it.
2. Add an employee with a name, email, and job role.
3. Search for the employee by name.
4. Use **Update** to change a record and **Delete** to remove it.
5. Pagination appears when the list has more than eight matching employees.

The app reads and saves records through the API, so MongoDB must be connected for these actions to work.

## Run the App

Requirements: Node.js 20.9 or newer and access to a MongoDB database, either local or MongoDB Atlas.

1. In the repository root, create `backend/.env` with your MongoDB connection settings:

   ```env
   MONGODB_URI=mongodb://127.0.0.1:27017/employee_directory
   PORT=5000
   CLIENT_URL=http://localhost:3000
   ```

   Replace `MONGODB_URI` with your own connection URI if using Atlas. Keep credentials private and do not commit `.env`.

2. Open a terminal in the repository root and start the backend:

   ```bash
   cd backend
   npm install
   npm run dev
   ```

3. Open a second terminal in the repository root and start the frontend:

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. Visit [http://localhost:3000](http://localhost:3000).

## Project Areas


The API health check is available at [http://localhost:5000/](http://localhost:5000/). Employee records are available at [http://localhost:5000/api/employees](http://localhost:5000/api/employees).
## Check Stored Data in MongoDB Compass

1. Open MongoDB Compass and connect with the same MongoDB URI configured in `backend/.env`.
2. For the local URI shown above, open the `employee_directory` database.
3. Open the `employees` collection to view saved records.
4. Add or update an employee in the app, then refresh the collection in Compass to confirm the change.

If you use MongoDB Atlas, connect Compass to the same cluster and database specified by `MONGODB_URI`. Do not share or commit the connection URI because it may contain credentials.
open mongoDB compass and check stored data