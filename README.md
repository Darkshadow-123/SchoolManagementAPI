# School Management API

Node.js Express.js API for managing school data with proximity-based sorting.

## Prerequisites

- Node.js (v14+)
- MySQL (v5.7+)

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure database credentials in `.env`:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=school_management
   PORT=3000
   ```

3. Set up the database:
   ```bash
   npm run setup-db
   ```

4. Start the server:
   ```bash
   npm start
   ```

## API Endpoints

### Add School
- **Endpoint**: `POST /addSchool`
- **Request Body**:
  ```json
  {
    "name": "School Name",
    "address": "School Address",
    "latitude": 40.7128,
    "longitude": -74.0060
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "School added successfully",
    "data": {
      "id": 1,
      "name": "School Name",
      "address": "School Address",
      "latitude": 40.7128,
      "longitude": -74.0060
    }
  }
  ```

### List Schools
- **Endpoint**: `GET /listSchools?latitude=40.7128&longitude=-74.0060`
- **Query Parameters**: `latitude`, `longitude` (required)
- **Response**:
  ```json
  {
    "success": true,
    "message": "Schools retrieved successfully",
    "data": [
      {
        "id": 1,
        "name": "School Name",
        "address": "School Address",
        "latitude": 40.7128,
        "longitude": -74.0060,
        "distance": 0
      }
    ]
  }
  ```

## Testing with Postman

Import `postman_collection.json` into Postman to test the APIs.
