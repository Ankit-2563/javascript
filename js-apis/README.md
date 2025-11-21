# Web API Development Guide for Beginners

## What is an API?

An API (Application Programming Interface) is a way for different programs to talk to each other. In web development, we use HTTP APIs that work like this:

1. Client sends a request asking for something
2. Server does some work (checks database, runs logic, calls other services)
3. Server sends back a response (usually in JSON format)

Think of it like ordering food at a restaurant: You (client) tell the waiter (API) what you want, the kitchen (server) prepares it, and the waiter brings it back to you.

## Understanding HTTP Basics

### HTTP Methods (Verbs)

HTTP methods tell the server what action you want to perform:

- **GET** - Read or retrieve data without changing anything
- **POST** - Create something new
- **PUT** - Replace an entire resource with new data
- **PATCH** - Update only some fields of a resource
- **DELETE** - Remove something

Example requests:

- GET /users - Get all users
- POST /users - Create a new user
- GET /users/1 - Get user with ID 1
- PATCH /users/1 - Update some information for user 1
- DELETE /users/1 - Delete user 1

### Status Codes

Status codes are numbers that tell you the result of your request. Common ones include:

- **200 OK** - Request succeeded
- **201 Created** - Something was successfully created
- **204 No Content** - Success but no data to return
- **400 Bad Request** - Client sent invalid data
- **401 Unauthorized** - Not authenticated (logged in)
- **403 Forbidden** - Logged in but not allowed to do this
- **404 Not Found** - The resource doesn't exist
- **429 Too Many Requests** - You've made too many requests too quickly
- **500 Internal Server Error** - Something went wrong on the server

### JSON Response Format

Responses should follow a consistent format:

Success response:

```json
{
  "data": {
    "id": 1,
    "name": "John"
  }
}
```

Error response:

```json
{
  "error": {
    "message": "Email already exists",
    "code": "EMAIL_EXISTS",
    "details": {
      "field": "email"
    }
  }
}
```

## API Design Principles

### Use Resource-Based URLs

Instead of using verbs in your URLs, use nouns that represent the resource:

Bad: /getUser, /fetchProducts
Good: /users, /products, /users/1, /products/5/reviews

This makes your API predictable and follows REST conventions that everyone understands.

### Query Parameters for Filtering and Pagination

Use query parameters (the ? part of the URL) to filter and organize results:

```
GET /products?category=phone&sort=price_asc&page=2&limit=20
```

This retrieves products from the phone category, sorted by price, showing page 2 with 20 items per page. This is better than creating separate endpoints for every filter combination.

### API Versioning

Plan for the day when you need to change your API. Use versioning to avoid breaking existing clients:

```
/api/v1/users
/api/v2/users
```

This lets old applications keep using v1 while new ones use v2.

### Idempotency

Idempotent operations are safe to repeat. For example:

- GET requests should never change data
- Calling DELETE on the same resource multiple times should result in the same final state
- PUT requests are usually idempotent (same request always produces the same result)

This is important because it makes retrying requests safe.

## Building APIs with Node.js and Express

### Basic Setup

Here's a simple Express server:

```javascript
const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
```

This starts a server on port 3000 that responds to requests.

### Organizing Code: Routes, Controllers, and Services

As your API grows, keep code organized in separate parts:

- **Routes** - Define which URLs exist and what methods they accept
- **Controllers** - Handle the HTTP request and response, call services
- **Services** - Contains business logic and database operations
- **Models** - Database structure definitions

This separation makes code easier to test, change, and scale.

Example routes file:

```javascript
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/", userController.listUsers);
router.post("/", userController.createUser);

module.exports = router;
```

Example controller file:

```javascript
const userService = require("../services/userService");

exports.listUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();
    res.json({ data: users });
  } catch (err) {
    next(err);
  }
};

exports.createUser = async (req, res, next) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json({ data: user });
  } catch (err) {
    next(err);
  }
};
```

### Middleware

Middleware are functions that run before your main handler. They can inspect or modify the request, modify the response, or even stop the request.

Common uses for middleware:

- Logging requests
- Authentication
- Validation
- Error handling
- Rate limiting

Simple logging middleware example:

```javascript
function logger(req, res, next) {
  console.log(`${req.method} ${req.path}`);
  next();
}

app.use(logger);
```

### Error Handling Middleware

Always have a central place to handle errors:

```javascript
function errorHandler(err, req, res, next) {
  console.error(err);

  const status = err.status || 500;
  const message = err.message || "Internal Server Error";

  res.status(status).json({
    error: {
      message,
    },
  });
}

app.use(errorHandler);
```

This ensures all errors are handled consistently.

## Security Basics

### Use HTTPS in Production

Always use HTTPS (the secure version of HTTP) for live applications. This encrypts data between the client and server, preventing someone from stealing sensitive information.

### Authentication and Authorization

Authentication means verifying who you are. Authorization means checking what you're allowed to do.

Two common approaches:

**JWT (JSON Web Tokens)**

1. User logs in with email and password
2. Server creates a token and sends it back
3. Client includes token in future requests using: Authorization: Bearer [token]
4. Server verifies token for each request

**Sessions and Cookies**

1. User logs in
2. Server stores session info and sends a cookie to the browser
3. Browser automatically includes cookie in future requests
4. Server checks the session for each request

JWT is more common for modern APIs.

### Input Validation

Never trust data from the client. Always validate it:

```javascript
function validateCreateUser(req, res, next) {
  const { email, password } = req.body;

  if (!email || typeof email !== "string") {
    return res.status(400).json({ error: { message: "Invalid email" } });
  }

  if (!password || password.length < 8) {
    return res.status(400).json({ error: { message: "Password too short" } });
  }

  next();
}
```

This prevents broken data and security issues.

### Secure Headers and CORS

Use the helmet package to add security headers automatically:

```javascript
const helmet = require("helmet");
app.use(helmet());
```

Configure CORS (Cross-Origin Resource Sharing) to control which websites can access your API:

```javascript
const cors = require("cors");
app.use(
  cors({
    origin: "https://your-frontend.com",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);
```

### Keep Secrets Safe

Never put passwords, API keys, or other secrets in your code. Use a .env file:

```
PORT=3000
JWT_SECRET=your_secret_key_here
DB_URL=database_connection_string
```

Then load it in your code:

```javascript
require("dotenv").config();
const jwtSecret = process.env.JWT_SECRET;
```

## Performance and Scalability

### Avoid Heavy Work in Request Handlers

If something takes a long time, consider:

- Running it in the background with job queues
- Caching the results
- Optimizing database queries

This keeps your API responsive.

### Caching

Caching stores frequently accessed data so you don't have to recalculate it:

1. Check if data is in cache
2. If yes, return cached version
3. If no, get from database, store in cache, return

This reduces database load and speeds up responses.

### Pagination

Never return huge lists at once. Always limit results:

Good request:

```
GET /products?page=1&limit=20
```

Good response:

```json
{
  "data": [
    /* 20 products */
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "totalPages": 10,
    "totalItems": 200
  }
}
```

This protects your server and prevents huge download times for clients.

### Database Indexing

If you frequently search by a column, create an index:

```sql
CREATE INDEX idx_users_email ON users(email);
```

Indexes dramatically speed up search queries.

### Compression

Enable gzip or brotli compression on your server to reduce response size and improve speed.

## Rate Limiting

Rate limiting restricts how many requests a client can make in a time period. For example: maximum 100 requests per 15 minutes per IP address.

If exceeded, respond with status code 429 (Too Many Requests).

This protects your API from abuse, bots, and overload.

Simple rate limiting in Express:

```javascript
const rateLimit = require("express-rate-limit");

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api", apiLimiter);
```

For distributed setups with multiple servers, store rate limit counts in Redis instead of in-memory.

## Making APIs Easy to Use

### Clear Naming

Your endpoint names should make the behavior obvious:

Bad: /doStuff, /processData
Good: /users, /orders, /products

### Consistent Response Format

Every endpoint should return responses in the same format. This lets clients build generic error handlers that work for all endpoints.

### API Documentation

Use tools like OpenAPI/Swagger to document your API. This makes it easy for developers to explore and test your endpoints without reading your code.

You can even serve interactive documentation UI in your application:

```javascript
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
```

### Deprecation Policy

When you need to change endpoints, give developers time:

1. Keep old endpoints working for a period
2. Mark them as deprecated in documentation
3. Send warnings in response headers if needed
4. Set a deadline for when old endpoints will stop working

## Using APIs from Frontend JavaScript

### Basic Fetch Request

```javascript
async function getUsers() {
  const res = await fetch("https://api.example.com/users");

  if (!res.ok) {
    const errorBody = await res.json();
    throw new Error(errorBody.error?.message || "Request failed");
  }

  const body = await res.json();
  console.log(body.data);
}
```

### Fetch with Authentication

```javascript
async function getProfile(token) {
  const res = await fetch("https://api.example.com/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch profile");
  }

  const body = await res.json();
  return body.data;
}
```

Always handle errors properly and include necessary headers like Authorization.

## Testing and Monitoring

### Types of Tests

- **Unit Tests** - Test individual functions and services
- **Integration Tests** - Test endpoints working with a database
- **Contract Tests** - Verify your API matches its documentation

### Testing Example

Using supertest to test an endpoint:

```javascript
const request = require("supertest");
const app = require("../server");

describe("GET /users", () => {
  it("should return 200 and a list of users", async () => {
    const res = await request(app).get("/users");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});
```

### Logging and Monitoring

Log important information:

- Each request (method, path, status, time taken)
- All errors with stack traces
- Performance metrics

You cannot fix problems you cannot see. Good logging and monitoring are essential for production APIs.

## Senior Developer API Checklist

If you can do all of these confidently, you're developing at a senior level:

### Design

- RESTful routes with clear naming
- Proper HTTP methods and status codes
- Pagination, filtering, and sorting
- Versioning strategy

### Implementation

- Clean separation: routes, controllers, services, models
- Reusable middleware for common tasks
- Central error handling

### Security

- HTTPS in production
- Authentication (JWT or sessions)
- Input validation and sanitization
- CORS configured properly
- Secrets stored in .env file

### Performance

- Database indexes on frequently searched columns
- Caching strategy for expensive operations
- Proper pagination implementation
- Understanding of horizontal scaling

### Rate Limiting

- Global rate limiting across all endpoints
- Per-route rate limiting where needed
- Returns 429 status with clear messaging

### Developer Experience

- Consistent JSON response format
- Clear naming and comprehensive documentation
- Versioning with deprecation plan

### Quality

- Automated tests for critical functionality
- Logging in place
- Monitoring and alerting configured

## Key Takeaways

Building good APIs is about three things:

1. **Clarity** - Make your API obvious and consistent
2. **Safety** - Protect data and handle errors gracefully
3. **Performance** - Keep responses fast and handle load
