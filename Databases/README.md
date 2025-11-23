# Database

## What is a Database?

A database is a structured way to store, organize, and retrieve data. Think of it like a filing cabinet for your application. Without a database, every time your application restarts, all data would be lost. Databases persist data permanently on disk.

## Why Do We Need Databases?

Imagine building a social media app. You need to store:

- User accounts (usernames, passwords, emails)
- Posts (text, images, timestamps)
- Comments, likes, and followers
- User settings and preferences

You could store this in JavaScript variables or files, but that would be:

- Slow for large amounts of data
- Difficult to search and filter
- Hard to maintain data relationships
- Prone to data corruption
- Impossible to handle concurrent users

Databases solve all these problems efficiently.

## Two Main Types of Databases

### 1. SQL Databases (Relational)

Examples: PostgreSQL, MySQL, SQLite

**How they work:** Data is stored in tables with rows and columns, like Excel spreadsheets. Tables can be connected through relationships.

**Structure:**

```
Users Table:
| id | username  | email           | created_at |
|----|-----------|-----------------|------------|
| 1  | john_doe  | john@email.com  | 2024-01-15 |
| 2  | jane_dev  | jane@email.com  | 2024-01-16 |

Posts Table:
| id | user_id | title        | content          | created_at |
|----|---------|--------------|------------------|------------|
| 1  | 1       | First Post   | Hello world!     | 2024-01-17 |
| 2  | 1       | Another Post | Learning JS      | 2024-01-18 |
| 3  | 2       | My Post      | Databases rock!  | 2024-01-19 |
```

**Key Features:**

- Schema-based: You define the structure beforehand (columns, data types, constraints)
- ACID compliant: Guarantees data integrity (more on this below)
- Relationships: Use foreign keys to connect data
- Powerful queries: Use SQL language for complex searches

### 2. NoSQL Databases (Non-Relational)

Examples: MongoDB, Redis, Cassandra

**How they work:** Data is stored in flexible formats, usually as documents (like JSON objects).

**Structure:**

```json
// User document in MongoDB
{
  "_id": "507f1f77bcf86cd799439011",
  "username": "john_doe",
  "email": "john@email.com",
  "posts": [
    {
      "title": "First Post",
      "content": "Hello world!",
      "created_at": "2024-01-17"
    },
    {
      "title": "Another Post",
      "content": "Learning JS",
      "created_at": "2024-01-18"
    }
  ],
  "created_at": "2024-01-15"
}
```

**Key Features:**

- Schema-less: Flexible structure, can change anytime
- Document-based: Stores data like JSON objects
- Horizontal scaling: Easy to distribute across multiple servers
- Fast for specific use cases: Great for real-time apps and caching

## PostgreSQL Deep Dive

PostgreSQL (often called Postgres) is one of the most popular SQL databases. It's free, open-source, and extremely powerful.

### When to Use PostgreSQL

Use PostgreSQL when you need:

- Complex relationships between data (users, posts, comments, orders, products)
- Data integrity and consistency (banking apps, e-commerce)
- Complex queries (analytics, reporting, filtering)
- Transactions (multiple operations that must all succeed or all fail)

**Real-world examples:**

- E-commerce sites (products, orders, customers, inventory)
- Banking apps (accounts, transactions, transfers)
- CRM systems (companies, contacts, deals, activities)
- Content management systems (articles, authors, categories, tags)

### PostgreSQL Basic Concepts

#### Tables and Schemas

A schema is a blueprint for your data:

```sql
-- Create a users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create a posts table with a relationship to users
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  content TEXT,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Explanation:**

- `SERIAL`: Auto-incrementing integer (1, 2, 3, ...)
- `PRIMARY KEY`: Unique identifier for each row
- `VARCHAR(50)`: Text with max 50 characters
- `NOT NULL`: Field cannot be empty
- `UNIQUE`: No two rows can have the same value
- `REFERENCES`: Foreign key linking to another table
- `ON DELETE CASCADE`: If a user is deleted, delete their posts too

#### CRUD Operations

CRUD stands for Create, Read, Update, Delete - the four basic operations:

```sql
-- CREATE: Insert new data
INSERT INTO users (username, email, password_hash)
VALUES ('john_doe', 'john@email.com', 'hashed_password_here');

-- READ: Query data
SELECT * FROM users WHERE username = 'john_doe';

SELECT users.username, posts.title
FROM users
JOIN posts ON users.id = posts.user_id
WHERE users.id = 1;

-- UPDATE: Modify existing data
UPDATE users
SET email = 'newemail@example.com'
WHERE id = 1;

-- DELETE: Remove data
DELETE FROM posts WHERE id = 5;
```

#### Relationships

There are three types of relationships:

**One-to-Many:** One user has many posts

```sql
-- Already shown above with user_id in posts table
```

**Many-to-Many:** Posts can have many tags, tags can belong to many posts

```sql
CREATE TABLE tags (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE post_tags (
  post_id INTEGER REFERENCES posts(id),
  tag_id INTEGER REFERENCES tags(id),
  PRIMARY KEY (post_id, tag_id)
);
```

**One-to-One:** One user has one profile

```sql
CREATE TABLE profiles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER UNIQUE REFERENCES users(id),
  bio TEXT,
  avatar_url VARCHAR(255)
);
```

### Using PostgreSQL with JavaScript

You'll use a library to connect Node.js to PostgreSQL. The most popular is `pg`:

```javascript
const { Pool } = require("pg");

// Create a connection pool
const pool = new Pool({
  user: "your_username",
  host: "localhost",
  database: "your_database",
  password: "your_password",
  port: 5432,
});

// Query example
async function getUser(username) {
  try {
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);
    return result.rows[0];
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
}

// Insert example
async function createPost(userId, title, content) {
  try {
    const result = await pool.query(
      "INSERT INTO posts (user_id, title, content) VALUES ($1, $2, $3) RETURNING *",
      [userId, title, content]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
}
```

**Important concepts:**

- `$1, $2, $3`: Parameterized queries prevent SQL injection attacks
- `RETURNING *`: Returns the inserted row
- `pool.query()`: Executes SQL and returns results
- Always use try-catch for error handling

### Transactions

Transactions ensure multiple operations either all succeed or all fail. Critical for data integrity.

**Real-world example:** Transferring money between bank accounts

```javascript
async function transferMoney(fromAccountId, toAccountId, amount) {
  const client = await pool.connect();

  try {
    // Start transaction
    await client.query("BEGIN");

    // Deduct from sender
    await client.query(
      "UPDATE accounts SET balance = balance - $1 WHERE id = $2",
      [amount, fromAccountId]
    );

    // Add to receiver
    await client.query(
      "UPDATE accounts SET balance = balance + $1 WHERE id = $2",
      [amount, toAccountId]
    );

    // Commit transaction (make changes permanent)
    await client.query("COMMIT");

    return { success: true };
  } catch (error) {
    // Rollback (undo all changes)
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
```

### ACID Properties

ACID ensures data reliability:

- **Atomicity:** All operations in a transaction succeed or all fail
- **Consistency:** Database remains in a valid state
- **Isolation:** Concurrent transactions don't interfere with each other
- **Durability:** Committed data is permanently saved

## MongoDB Deep Dive

MongoDB is the most popular NoSQL database. It stores data as JSON-like documents.

### When to Use MongoDB

Use MongoDB when you need:

- Flexible schemas (structure changes frequently)
- Nested data (documents within documents)
- Rapid development (no need to plan schema upfront)
- Horizontal scaling (distributing data across servers)
- Real-time applications (chat apps, gaming, IoT)

**Real-world examples:**

- Content management (blogs, news sites with varying article formats)
- Catalogs (products with different attributes)
- Real-time analytics (logs, events, user behavior)
- Mobile apps (offline sync, flexible data structures)
- IoT applications (sensor data with varying formats)

### MongoDB Basic Concepts

#### Collections and Documents

MongoDB organizes data into:

- **Database:** Container for collections
- **Collection:** Like a table, but for documents (similar to an array)
- **Document:** A JSON-like object (similar to a row)

```javascript
// A user document in MongoDB
{
  "_id": ObjectId("507f1f77bcf86cd799439011"),
  "username": "john_doe",
  "email": "john@email.com",
  "profile": {
    "firstName": "John",
    "lastName": "Doe",
    "age": 28,
    "bio": "JavaScript developer"
  },
  "interests": ["coding", "music", "travel"],
  "created_at": ISODate("2024-01-15T10:30:00Z")
}
```

**Key differences from SQL:**

- No fixed schema - each document can have different fields
- Nested objects and arrays are natural
- `_id` is automatically created as a unique identifier

#### CRUD Operations in MongoDB

Using the official MongoDB Node.js driver:

```javascript
const { MongoClient, ObjectId } = require("mongodb");

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

async function main() {
  await client.connect();
  const db = client.db("myapp");
  const users = db.collection("users");

  // CREATE: Insert documents
  const newUser = await users.insertOne({
    username: "jane_dev",
    email: "jane@email.com",
    profile: {
      firstName: "Jane",
      lastName: "Developer",
    },
    interests: ["JavaScript", "databases"],
  });
  console.log("Created user with ID:", newUser.insertedId);

  // READ: Query documents
  const user = await users.findOne({ username: "jane_dev" });
  console.log("Found user:", user);

  // Find multiple with filters
  const jsDevs = await users
    .find({
      interests: "JavaScript",
    })
    .toArray();

  // UPDATE: Modify documents
  await users.updateOne(
    { username: "jane_dev" },
    {
      $set: { email: "newemail@example.com" },
      $push: { interests: "MongoDB" },
    }
  );

  // DELETE: Remove documents
  await users.deleteOne({ username: "jane_dev" });

  await client.close();
}
```

**MongoDB operators:**

- `$set`: Update specific fields
- `$push`: Add to an array
- `$pull`: Remove from an array
- `$inc`: Increment a number
- `$unset`: Remove a field

#### Embedding vs Referencing

**Embedding:** Store related data inside the document

```javascript
// User with embedded posts
{
  "_id": ObjectId("..."),
  "username": "john_doe",
  "posts": [
    {
      "title": "First Post",
      "content": "Hello world!",
      "created_at": ISODate("2024-01-17")
    },
    {
      "title": "Second Post",
      "content": "Learning MongoDB",
      "created_at": ISODate("2024-01-18")
    }
  ]
}
```

**Pros:** Fast reads (one query), data stays together
**Cons:** Document size limits (16MB), data duplication

**Referencing:** Store related data in separate collections

```javascript
// User document
{
  "_id": ObjectId("507f1f77bcf86cd799439011"),
  "username": "john_doe"
}

// Post documents
{
  "_id": ObjectId("..."),
  "user_id": ObjectId("507f1f77bcf86cd799439011"),
  "title": "First Post",
  "content": "Hello world!"
}
```

**Pros:** No duplication, flexible, no size limits
**Cons:** Requires multiple queries or joins

**Rule of thumb:**

- Embed when data is always accessed together (user profile, address)
- Reference when data is accessed independently (posts, comments)

### Using Mongoose (ODM)

Mongoose is an Object Data Modeling library that makes MongoDB easier to use:

```javascript
const mongoose = require("mongoose");

// Define a schema (even though MongoDB is schema-less, Mongoose adds structure)
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: {
      validator: function (v) {
        return /\S+@\S+\.\S+/.test(v);
      },
      message: "Invalid email format",
    },
  },
  profile: {
    firstName: String,
    lastName: String,
    age: {
      type: Number,
      min: 0,
      max: 120,
    },
  },
  interests: [String],
  created_at: {
    type: Date,
    default: Date.now,
  },
});

// Create a model
const User = mongoose.model("User", userSchema);

// Connect to MongoDB
await mongoose.connect("mongodb://localhost:27017/myapp");

// Use the model
async function createUser() {
  const user = new User({
    username: "john_doe",
    email: "john@email.com",
    profile: {
      firstName: "John",
      lastName: "Doe",
      age: 28,
    },
    interests: ["coding", "music"],
  });

  await user.save();
  return user;
}

async function findUsers() {
  // Find all users interested in coding
  const users = await User.find({ interests: "coding" });

  // Find with multiple conditions
  const youngCoders = await User.find({
    interests: "coding",
    "profile.age": { $lt: 30 },
  });

  return users;
}
```

**Mongoose benefits:**

- Schema validation
- Type casting
- Middleware (hooks)
- Query building
- Virtual properties

### Indexing

Indexes make queries faster by creating a quick lookup structure.

**Without index:** Database scans every document (slow)
**With index:** Database uses an index to jump directly to matching documents (fast)

```javascript
// Create an index in MongoDB
await users.createIndex({ username: 1 }); // 1 = ascending, -1 = descending

// Compound index (multiple fields)
await users.createIndex({ email: 1, created_at: -1 });

// Text index for full-text search
await posts.createIndex({ title: "text", content: "text" });

// Using text search
const results = await posts.find({ $text: { $search: "javascript mongodb" } });
```

**In Mongoose:**

```javascript
userSchema.index({ username: 1 });
userSchema.index({ email: 1, created_at: -1 });
```

## PostgreSQL vs MongoDB: When to Use Which

### Use PostgreSQL when:

- Data has clear relationships (users, orders, products)
- Data integrity is critical (financial data, user accounts)
- You need complex queries and joins
- Schema is stable and well-defined
- ACID compliance is required
- You need strong consistency

**Example use cases:**

- E-commerce platforms
- Banking systems
- ERP systems
- Traditional web applications
- Reporting and analytics

### Use MongoDB when:

- Schema changes frequently
- Data is document-oriented (articles, profiles)
- You need high write throughput
- Data has varying structures
- You need horizontal scaling
- Development speed is priority

**Example use cases:**

- Content management systems
- Real-time analytics
- IoT applications
- Mobile backends
- Catalogs with varied attributes
- Logging systems

### You Can Use Both

Many applications use both:

- PostgreSQL for core business data (users, orders, payments)
- MongoDB for flexible data (logs, sessions, product catalogs)

## Database Design Best Practices

### Normalization (SQL)

Normalization reduces data redundancy:

**Bad (denormalized):**

```
Orders Table:
| order_id | customer_name | customer_email | product_name | price |
|----------|---------------|----------------|--------------|-------|
| 1        | John Doe      | john@email.com | Laptop       | 1000  |
| 2        | John Doe      | john@email.com | Mouse        | 20    |
```

Problem: Customer data is duplicated. If email changes, you must update multiple rows.

**Good (normalized):**

```
Customers Table:
| customer_id | name     | email          |
|-------------|----------|----------------|
| 1           | John Doe | john@email.com |

Products Table:
| product_id | name   | price |
|------------|--------|-------|
| 1          | Laptop | 1000  |
| 2          | Mouse  | 20    |

Orders Table:
| order_id | customer_id | product_id |
|----------|-------------|------------|
| 1        | 1           | 1          |
| 2        | 1           | 2          |
```

### General Best Practices

1. **Use meaningful names:** `user_id` not `uid`, `created_at` not `ca`

2. **Add timestamps:** Always include `created_at` and `updated_at`

3. **Validate data:** Use constraints (SQL) or schema validation (Mongoose)

4. **Index frequently queried fields:** Username, email, foreign keys

5. **Use connection pooling:** Reuse database connections for better performance

6. **Handle errors properly:** Always wrap database operations in try-catch

7. **Sanitize inputs:** Prevent SQL injection (use parameterized queries)

8. **Backup regularly:** Set up automatic backups

9. **Monitor performance:** Log slow queries and optimize them

10. **Use migrations:** Version control your schema changes

## Connection Pooling

Instead of opening a new connection for each request (slow), maintain a pool of reusable connections:

```javascript
// PostgreSQL
const pool = new Pool({
  max: 20, // maximum number of connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// MongoDB (built into the driver)
const client = new MongoClient(uri, {
  maxPoolSize: 50,
  minPoolSize: 10,
});
```

## Common Patterns

### Pagination

Don't load all records at once:

```javascript
// PostgreSQL
async function getPostsPaginated(page = 1, pageSize = 10) {
  const offset = (page - 1) * pageSize;
  const result = await pool.query(
    "SELECT * FROM posts ORDER BY created_at DESC LIMIT $1 OFFSET $2",
    [pageSize, offset]
  );
  return result.rows;
}

// MongoDB
async function getPostsPaginated(page = 1, pageSize = 10) {
  const posts = await db
    .collection("posts")
    .find()
    .sort({ created_at: -1 })
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .toArray();
  return posts;
}
```

### Soft Deletes

Instead of deleting data, mark it as deleted:

```javascript
// PostgreSQL
ALTER TABLE users ADD COLUMN deleted_at TIMESTAMP;

UPDATE users SET deleted_at = CURRENT_TIMESTAMP WHERE id = 1;

SELECT * FROM users WHERE deleted_at IS NULL; // Active users

// MongoDB with Mongoose
userSchema.add({ deletedAt: Date });

// Soft delete
await User.updateOne({ _id: userId }, { deletedAt: new Date() });

// Find active users
const users = await User.find({ deletedAt: null });
```

## Environment Variables

Never hardcode database credentials:

```javascript
// .env file
DB_HOST=localhost
DB_PORT=5432
DB_NAME=myapp
DB_USER=myuser
DB_PASSWORD=mypassword
MONGO_URI=mongodb://localhost:27017/myapp

// In your code
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});
```

## Testing

Always test database operations:

```javascript
// Example with Jest
describe("User model", () => {
  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect("mongodb://localhost:27017/test");
  });

  afterAll(async () => {
    // Clean up
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  afterEach(async () => {
    // Clear data after each test
    await User.deleteMany({});
  });

  test("should create a user", async () => {
    const user = await User.create({
      username: "testuser",
      email: "test@example.com",
    });

    expect(user.username).toBe("testuser");
    expect(user._id).toBeDefined();
  });
});
```

## Summary

- **Databases persist data permanently** and provide efficient storage, retrieval, and querying
- **PostgreSQL (SQL)** is best for structured data with relationships, requiring data integrity
- **MongoDB (NoSQL)** is best for flexible, document-oriented data with changing schemas
- **Use indexes** to speed up queries on frequently accessed fields
- **Connection pooling** improves performance by reusing connections
- **Always validate data** and handle errors properly
- **Use environment variables** for configuration
- **Test your database operations** to ensure reliability
