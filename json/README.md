# JSON

## What is JSON?

JSON stands for JavaScript Object Notation. Despite the name, JSON is not just for JavaScript. It is a universal format used by every programming language including Python, Java, Go, C#, Rust, PHP, and Ruby.

JSON is simply a lightweight format used to store and exchange data between different programs and machines.

Think of JSON as a universal language that different applications can understand. Just like English is a common language between people from different countries, JSON is a common language between different software systems.

## Why JSON Is Everywhere

JSON has become the standard way to work with data. Here's why:

### It is Simple

JSON is readable by both humans and machines. When you look at JSON, you can understand what data is being stored without needing special knowledge.

### It is Universal

Every programming language can read and work with JSON. This makes it perfect for moving data between different systems.

### It is Lightweight

JSON is small and compact compared to older formats like XML. It has no unnecessary tags or heavy metadata. Smaller files mean faster communication between your server and applications.

### It Supports Common Data Types

JSON can store the types of data that real applications actually use:

- Strings (text)
- Numbers
- Booleans (true or false)
- Arrays (lists)
- Objects (collections of related data)
- Null (empty/no value)

## JSON Syntax Rules

JSON has a simple but strict syntax. You must follow these rules exactly or the JSON will be invalid.

### Valid Data Types

Here's an example showing all the data types you can use in JSON:

```json
{
  "string": "Hello",
  "number": 42,
  "boolean": true,
  "null_value": null,
  "array": [1, 2, 3],
  "object": {
    "name": "Ankit"
  }
}
```

### Rules You Must Always Follow

**Keys must use double quotes**

Correct:

```json
{
  "name": "John"
}
```

Incorrect:

```json
{
  'name': "John" // it is meant to be 'name' if it is in double quotes prettier formated code while saving it 
}
```

Keys (the names on the left) must always be surrounded by double quotes. Single quotes are not allowed.

**Strings must use double quotes**

In JSON, all text values must be surrounded by double quotes. Single quotes will cause an error.

**No trailing commas**

Incorrect:

```json
{
  "name": "John",
  "age": 30,  // it is meant to be "age": 30, if it is "age": 30 prettier formated code while saving it 
}
```

Correct:

```json
{
  "name": "John",
  "age": 30
}
```

Do not add a comma after the last item in an object or array.

**Top level must be an object or array**

Valid:

```json
{
  "name": "John"
}
```

Also valid:

```json
[1, 2, 3]
```

Invalid:

```json
"just a string"
```

At the highest level, your JSON must be either an object starting with curly braces or an array starting with square brackets. Just a single string or number is not valid JSON.

## Creating JSON Files

Creating a JSON file is straightforward:

1. Create a new file with the .json extension (for example: data.json)
2. Write your JSON content inside
3. Save the file

Example file named data.json:

```json
{
  "name": "Ankit",
  "age": 21,
  "isStudent": true
}
```

That's all there is to it. A JSON file is just a text file with the .json extension containing properly formatted JSON.

## Where JSON is Used

As a developer, you will encounter JSON in many places:

### API Responses

When your server sends data to a client (like a web browser or mobile app), it usually sends JSON.

Example - A server responding to a login request:

```json
{
  "success": true,
  "user": {
    "id": 1,
    "email": "ankit@example.com"
  }
}
```

### API Requests

When clients send data to servers, they often send it as JSON.

Example - A client sending login credentials:

```json
{
  "email": "ankit@example.com",
  "password": "123456"
}
```

### Configuration Files

Modern development tools use JSON files to store settings and configuration.

Common configuration files:

- package.json (Node.js project settings)
- tsconfig.json (TypeScript settings)
- eslint.json (Code style settings)

Example configuration file:

```json
{
  "name": "my-app",
  "version": "1.0.0",
  "description": "A sample application"
}
```

### Storing Lightweight Data

JSON can store user preferences and application settings:

```json
{
  "theme": "dark",
  "language": "English",
  "notifications": true
}
```

### Database Communication

Many databases like MongoDB use JSON-like formats internally to store data. Other databases also use JSON for data exchange.

## Working With JSON in JavaScript

JavaScript has built-in tools for working with JSON. You will use these constantly in web development.

### Converting JSON String to JavaScript Object

Sometimes you receive JSON as text (a string). You need to convert it to a JavaScript object that you can work with.

Use JSON.parse():

```javascript
const jsonString = '{"name":"Ankit", "age":21}';
const object = JSON.parse(jsonString);

console.log(object.name); // Output: Ankit
console.log(object.age); // Output: 21
```

### Converting JavaScript Object to JSON String

When you need to send data to a server or save it to a file, you convert your JavaScript object to a JSON string.

Use JSON.stringify():

```javascript
const object = {
  name: "Ankit",
  age: 21,
};

const jsonString = JSON.stringify(object);
console.log(jsonString);
// Output: {"name":"Ankit","age":21}
```

### Pretty Printing JSON

When testing or debugging, you want to see JSON formatted nicely with indentation.

Use JSON.stringify() with formatting:

```javascript
const object = {
  name: "Ankit",
  age: 21,
  email: "ankit@example.com",
};

const prettyJson = JSON.stringify(object, null, 2);
console.log(prettyJson);
```

Output:

```json
{
  "name": "Ankit",
  "age": 21,
  "email": "ankit@example.com"
}
```

The third parameter (2) controls the indentation level. Using 2 adds 2 spaces before each line, making it readable.

## JSON vs JavaScript Objects

These look similar but they are not the same thing:

### JavaScript Object

```javascript
const user = {
  name: "Ankit",
  age: 21,
};
```

### JSON

```json
{
  "name": "Ankit",
  "age": 21
}
```

### Key Differences

| Feature                     | JavaScript Object | JSON |
| --------------------------- | ----------------- | ---- |
| Single quotes allowed       | Yes               | No   |
| Methods (functions) allowed | Yes               | No   |
| Comments allowed            | Yes               | No   |
| Trailing commas allowed     | Sometimes         | No   |

The main difference is that JSON is pure data with no logic or special formatting. A JavaScript object can contain functions and methods, but JSON cannot.

Think of it this way:

- JavaScript objects are code that your program uses
- JSON is a text representation of data that gets transmitted or stored

## When to Use JSON

Use JSON when you need to:

### Transfer Data Between Systems

- Browser to server communication
- Mobile app to backend communication
- One service to another service
- Frontend to backend

### Store Structured Data

- Application configuration
- User preferences and settings
- Cached data
- Lightweight database storage

### Define API Contracts

You can use JSON to show exactly what shape of data your API will return. This helps developers know what to expect.

Example - "Your API will always return this structure":

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John"
  }
}
```

### Work Across Different Programming Languages

When your backend uses one language and frontend uses another, JSON is the universal bridge that both can understand.

## When NOT to Use JSON

There are situations where JSON is not the best choice:

### Configuration Files That Need Comments

For configuration files where you want to add explanatory notes, use YAML instead of JSON. JSON does not support comments.

### Very Large Binary Data

If you need to store large binary files (images, videos), JSON is not suitable. Use binary formats instead.

### Extremely Complex Hierarchies

If you have deeply nested structures with many levels, JSON can become messy and hard to read. Consider other formats.

## Common Mistakes to Avoid

### Missing Quotes Around Keys

Incorrect:

```json
{
  name : "John"
}
```

Correct:

```json
{
  "name": "John"
}
```

All keys must be surrounded by double quotes.

### Using Single Quotes

Incorrect:

```json
{
  'name': "John"
}
```

Correct:

```json
{
  "name": "John"
}
```

JSON requires double quotes, not single quotes.

### Trailing Commas

Incorrect:

```json
{
  "name": "John",
  "age": 30,
}
```

Correct:

```json
{
  "name": "John",
  "age": 30
}
```

Never add a comma after the last item.

### Sending Invalid JSON from Your API

Always ensure that data being sent from your server is valid JSON. Use JSON.stringify() in JavaScript to ensure proper formatting.

### Including Functions in JSON

Incorrect:

```json
{
  "name": "John",
  "greet": function() { return "Hello"; }
}
```

JSON cannot contain functions. Only use data.

### Adding Comments to JSON

Incorrect:

```json
{
  "name": "John", // This is the user's name
  "age": 30
}
```

JSON does not support comments. If you need comments, use a different format.

### Storing Dates Incorrectly

Dates should be stored as strings in ISO format:

Correct:

```json
{
  "createdAt": "2025-01-10T12:30:00Z"
}
```

Incorrect:

```json
{
  "createdAt": 2025-01-10
}
```

## Real-World JSON Examples

### Login API Request

When a user tries to log in, the frontend sends this to the server:

```json
{
  "email": "example@gmail.com",
  "password": "secure123"
}
```

### Login API Response

The server responds with user information:

```json
{
  "status": "success",
  "data": {
    "id": 1,
    "email": "example@gmail.com",
    "username": "john_doe",
    "createdAt": "2025-01-10T12:30:00Z"
  }
}
```

### Application Configuration File

A configuration file storing application settings:

```json
{
  "port": 3000,
  "environment": "development",
  "database": {
    "host": "localhost",
    "port": 27017,
    "name": "myapp"
  },
  "logging": {
    "level": "info",
    "format": "json"
  }
}
```

### User Profile Data

Data representing a user profile:

```json
{
  "id": 42,
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "age": 28,
  "isActive": true,
  "address": {
    "street": "123 Main St",
    "city": "Springfield",
    "country": "USA"
  },
  "tags": ["developer", "python", "javascript"]
}
```

## Validating JSON

Before using JSON in your application, you should validate it to ensure it is correctly formatted.

### Online JSON Validators

Search for "JSON validator" online. There are many free tools available where you can paste JSON and it will check if it is valid.

### Validation in Code

Most programming languages have built-in functions to validate JSON. In JavaScript, JSON.parse() will throw an error if the JSON is invalid:

```javascript
try {
  const data = JSON.parse(invalidJson);
} catch (error) {
  console.log("Invalid JSON:", error.message);
}
```
