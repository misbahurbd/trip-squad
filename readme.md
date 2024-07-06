# Trip Squad - Assignment - B2 - A9 - MisbahurBD

Trip Squad is a web application designed to help users plan and organize their trips efficiently. Whether you're traveling solo or with friends, Trip Squad provides features to manage your trips, find potential travel buddies.

## Technology Stack:

- **Programming Language:** TypeScript
- **Web Framework:** Express.js
- **Database:** Railway Database PostgreSQL with Prisma ORM
- **Authentication:** JSON Web Tokens (JWT)
- **Validation:** Zod for schema validation
- **Deployment:** Vercel

## Features

- **User Authentication:** Register easily and authenticate securely as either a User or Admin to access the platform.

- **Trip Management:** Seamlessly create, update, and delete trip details, ensuring accurate planning and organization.

- **Travel Buddy Requests:** Send and respond to trip buddy requests, and conveniently track request history for effective communication.

- **Admin Capabilities:** Edit or delete trips, and efficiently manage user roles and permissions for streamlined administration.

- **Search and Filtering:** Effortlessly find trips, users, and request buddies with advanced search options for enhanced user experience.

- **User Profile:** Keep profile information up-to-date to foster connections and facilitate seamless trip planning and coordination.

**Live Link:** https://trip-squad-server.vercel.app/
**User Credentials**
Username: rakibul
Password: Rakibul@2021

## Installation

### 1. Clone the repository:

```bash
git clone https://github.com/misbahurbd/trip-squad-server.git
```

### 2. Open project directory:

```bash
cd trip-squad-server
```

### 3. Install dependencies:

```bash
npm install
```

### 4. Configuration:

Before starting the project, you need to configure the environment by creating an `.env` file in the
project root with the following content:

```env
NODE_ENV="development"
PORT=<PORT_NUMBER>
HASH_ROUND=<BCRYPT_HASH_ROUND>
CLIENT_URL=<LIVE_CLIENT_URL>
DATABASE_URL=<POSTGES_DATABASE_URI>

JWT_ACCESS_SECRET=<ACCESS_SECRET>
JWT_REFRESH_SECRET=<REFRESH_SECRET>


MAILER_EMAIL=<EMAIL_FOR_NODEMAILER>
MAILER_PASS=<NODEMAILER_EMAIL_PASSWORD>

CLOUD_NAME="<CLOUDINARY_CLOUD_NAME>
CLOUD_API_KEY=<CLOUDINARY_API_KEY>
CLOUD_API_SECRET=<CLOUDINARY_API_SECRET>

SEED_ADMIN_NAME=<SEED_ADMIN_NAME>
SEED_ADMIN_USERNAME=<SEED_ADMIN_USERNAME>
SEED_ADMIN_EMAIL=<SEED_ADMIN_EMAIL>
SEED_ADMIN_PASSWORD=<SEED_ADMIN_PASSWORD>
```

### 5. Start Development Server

```bash
npm run dev
```

Server will start on `http://localhost:5000` as `PORT` on .env file

## Auth API Endpoints

### 1. Register User:

- Endpoint: **POST /api/v1/auth/register** `Public Only`
- Request body: Contain user data object in JSON.
- Example URL: `http://localhost:5000/api/v1/auth/register`

### 2. Login User:

- Endpoint: **POST /api/v1/auth/login** `Public Only`
- Request body: Contain user credentials in JSON.
- Example URL: `http://localhost:5000/api/v1/auth/login`

### 3. Verify Account:

- Endpoint: **POST /api/v1/auth/verify/:token**
- Verify Token: Contain verify token in URL.
- Example URL: `http://localhost:5000/api/v1/auth/verify/:token`

### 4. Refresh Token:

- Endpoint: **POST /api/v1/auth/refresh-token**
- Refresh Token: Refresh token will provided with cookie.
- Request Headers: `Authorization: <JWT_TOKEN>`
- Example URL: `http://localhost:5000/api/v1/auth/refresh-token`

### 5. Resend Verification Link:

- Endpoint: **POST /api/v1/auth/resend-verification-link** `Public Only`
- Example URL: `http://localhost:5000/api/v1/auth/resend-verification-link`

### 6. Change Password:

- Endpoint: **POST /api/v1/auth/change-password** `Private`
- Request body: Contain user credentials in JSON.
- Request Headers: `Authorization: <JWT_TOKEN>`
- Example URL: `http://localhost:5000/api/v1/auth/change-password`

### 7. Change Password:

- Endpoint: **POST /api/v1/auth/forget-password** `Public Only`
- Request body: Contain user credentials object in JSON.
- Example URL: `http://localhost:5000/api/v1/auth/forget-password`

### 8. Reset Password:

- Endpoint: **POST /api/v1/auth/reset-password/:token** `Public Only`
- Reset Token: Contain reset token in URL.
- Request body: Contain user credentials object in JSON.
- Example URL: `http://localhost:5000/api/v1/auth/reset-password/:token`

## Profile

### 1. Update Profile:

- Endpoint: **PUT /api/profiles** `Private`
- Request body: Contain profile data object in JSON
- Request Headers: `Authorization: <JWT_TOKEN>`
- Example URL: `http://localhost:5000/api/v1/profiles`

### 2. Update profile Photo:

- Endpoint: **PUT /api/profiles/profile-photo** `Private`
- Request body: Contain profile photo in FormData
- Request Headers: `Authorization: <JWT_TOKEN>`
- Example URL: `http://localhost:5000/api/v1/profile/profile-photo`

## User API Endpoints

### 1. Create User:

- Endpoint: **POST /api/v1/users/create-user** `Admin Only`
- Request body: Contain user data and images in FormData
- Request Headers: `Authorization: <JWT_TOKEN>`
- Example URL: `http://localhost:5000/api/v1/users/create-user`

### 2. Get All User with Pagination and Search:

- Endpoint: **POST /api/v1/users/create-user** `Admin Only`
- Pagination: Use Params to Paginate and Filter
- Searchable Field: `searchTerm` apply with `name`, `email`, `username`, `mobile`
- Request Headers: `Authorization: <JWT_TOKEN>`
- Example URL: `http://localhost:5000/api/v1/users/create-user`

### 3. Update user status by UserId

- Endpoint: **POST /api/v1/users/update-status/:userId** `Admin Only`
- Request body: Contain user status object in JSON
- Request Headers: `Authorization: <JWT_TOKEN>`
- Example URL: `http://localhost:5000/api/v1/users/update-status/:userId`

### 4. Update user role by UserId

- Endpoint: **POST /api/v1/users/update-role/:userId** `Admin Only`
- Request body: Contain user role object in JSON
- Request Headers: `Authorization: <JWT_TOKEN>`
- Example URL: `http://localhost:5000/api/v1/users/update-role/:userId`

## Trip API Endpoints

### 1. Create Trip:

- Endpoint: **POST /api/v1/trips** `User Only`
- Request body: Contain trip data and images in FormData
- Request Headers: `Authorization: <JWT_TOKEN>`
- Example URL: `http://localhost:5000/api/v1/trips`

### 2. Update Trip:

- Endpoint: **PUT /api/v1/trips/:tripId** `Private`
- Request body: Contain trip data and images in FormData
- Request Headers: `Authorization: <JWT_TOKEN>`
- Example URL: `http://localhost:5000/api/v1/trips/:tripId`

### 3. Get Trip Details:

- Endpoint: **GET /api/v1/trips/:tripId** `Public`
- Example URL: `http://localhost:5000/api/v1/trips/:tripId`

### 4. Delete Trip:

- Endpoint: **DELETE /api/v1/trips/:tripId** `Private`
- Request Headers: `Authorization: <JWT_TOKEN>`
- Example URL: `http://localhost:5000/api/v1/trips/:tripId`

### 5. Get All Trip with Pagination, Search and Filter:

- Endpoint: **GET /api/v1/trips** `Public`
- Pagination: Use Params to Paginate and Filter
- Searchable Field: `searchTerm` apply with `destination`, `description`, `budget`
- Filterable Field: `destination`, `startDate`, `endDate`, `budget`
- Example URL: `http://localhost:5000/api/v1/trips?searchTerm=paris&page=2`

### 6. Get All Trip by userId with Pagination, Search and Filter:

- Endpoint: **GET /api/v1/trips/get-my-trips** `User Only`
- Pagination: Use Params to Paginate and Filter
- Request Headers: `Authorization: <JWT_TOKEN>`
- Searchable Field: `searchTerm` apply with `destination`, `description`, `budget`
- Filterable Field: `destination`, `startDate`, `endDate`, `budget`
- Example URL: `http://localhost:5000/api/v1/trips/get-my-trips?searchTerm=paris&page=2`

### 7. Get All Trip Type with Pagination

- Endpoint: **GET /api/v1/trips/trip-type** `Public`
- Pagination: Use Params to Paginate
- Example URL: `http://localhost:5000/api/v1/trips/trip-type`

### 8. Get Top Trips with Count

- Endpoint: **GET /api/v1/trips/top-trip-types** `Public`
- Example URL: `http://localhost:5000/api/v1/trips/top-trip-types`

### 9. Get Trip Photos

- Endpoint: **GET /api/v1/trips/photos** `Public`
- Example URL: `http://localhost:5000/api/v1/trips/photos`

## Trip Buddies

### 1. Send Trip Buddy Request

- Endpoint: **GET /api/v1/travel-buddies/reqeust/:tripId** `User Only`
- Request body: Contain trip buddy data object in JSON
- Request Headers: `Authorization: <JWT_TOKEN>`
- Example URL: `http://localhost:5000/api/v1/travel-buddies/reqeust/:tripId`

### 2. Response Trip Buddy Request

- Endpoint: **PUT /api/v1/travel-buddies/response/:buddyId** `User Only`
- Request body: Contain trip buddy data object in JSON
- Request Headers: `Authorization: <JWT_TOKEN>`
- Example URL: `http://localhost:5000/api/v1/travel-buddies/response/:buddyId`

### 3. Get Trip Buddy Requests by UserID with Pagination and Search

- Endpoint: **GET /api/v1/travel-buddies** `User Only`
- Request Headers: `Authorization: <JWT_TOKEN>`
- Searchable Field: `searchTerm` apply with `destination`, `description`, `buddys name`, `buddy email`, `buddy username`, `buddy mobile`
- Example URL: `http://localhost:5000/api/v1/travel-buddies`

### 4. Get Trip Buddy History by UserID with Pagination and Search

- Endpoint: **GET /api/v1/travel-buddies/history** `User Only`
- Request Headers: `Authorization: <JWT_TOKEN>`
- Searchable Field: `searchTerm` apply with `destination`, `description`, `buddys name`, `buddy email`, `buddy username`, `buddy mobile`
- Example URL: `http://localhost:5000/api/v1/travel-buddies/history`

### 5. Get Confirm Buddies by UserID with Pagination and Search

- Endpoint: **GET /api/v1/travel-buddies/buddies** `User Only`
- Request Headers: `Authorization: <JWT_TOKEN>`
- Searchable Field: `searchTerm` apply with `destination`, `description`, `buddys name`, `buddy email`, `buddy username`, `buddy mobile`
- Example URL: `http://localhost:5000/api/v1/travel-buddies/buddies`
