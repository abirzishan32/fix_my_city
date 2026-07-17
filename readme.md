# 🏙️ FixMyCity - Smart Civic Issue Reporting and Management Platform

FixMyCity is a full-stack civic issue reporting platform that enables citizens to report and track urban problems while allowing administrators to efficiently manage, monitor, and analyze reported issues.

The platform bridges the communication gap between citizens and municipal authorities by providing a structured workflow for reporting problems such as potholes, garbage accumulation, broken street lights, water leakage, and other public infrastructure issues.

---

## 🚀 Features

### 👤 Authentication & Authorization

- Secure user registration and login
- JWT-based authentication
- Role-based access control

Supported roles:

- **Citizen**
    - Report civic issues
    - Upload issue images
    - Select issue location using interactive maps
    - Track submitted issues

- **Admin**
    - View all reported issues
    - Monitor issue statistics
    - Manage civic issue records

---

# 🏘️ Citizen Features

## Report Issues

Citizens can submit civic complaints with:

- Issue title
- Detailed description
- Category selection
- Severity level
- Image upload
- Geographic location
- Address information


Supported categories:

- Pothole
- Garbage
- Water Leakage
- Broken Street Light
- Traffic Problems
- Other Infrastructure Issues


---

## Location-Based Reporting

The system integrates interactive maps allowing users to:

- Select issue location
- Capture latitude and longitude
- Visualize reported locations

Technology:

- React Leaflet
- OpenStreetMap


---

## Issue Tracking

Citizens can monitor their reported issues through different states:

```
SUBMITTED
     ↓
IN_PROGRESS
     ↓
RESOLVED
```

---

# 📊 Admin Dashboard

Administrators can:

- View all reported issues
- Analyze issue statistics
- Monitor issue distribution
- Track resolution progress


Analytics include:

- Total reported issues
- Issue categories distribution
- Status breakdown
- Monthly issue trends


Visualization:

- Recharts


---

# 🏗️ System Architecture

```
                 Client
                   |
                   |
             Next.js Frontend
                   |
                REST API
                   |
            Spring Boot Backend
                   |
          Spring Data JPA / Hibernate
                   |
          PostgreSQL (Supabase)
```


---

# 🛠️ Tech Stack

## Backend

| Technology | Purpose |
|---|---|
| Java 21 | Programming Language |
| Spring Boot | Backend Framework |
| Spring Security | Authentication & Authorization |
| JWT | Secure API Authentication |
| Spring Data JPA | Database Access |
| Hibernate | ORM |
| PostgreSQL | Database |
| Lombok | Boilerplate Reduction |


## Frontend

| Technology | Purpose |
|---|---|
| Next.js 15 | React Framework |
| TypeScript | Type Safety |
| Tailwind CSS | Styling |
| shadcn/ui | UI Components |
| Framer Motion | Animations |
| React Leaflet | Interactive Maps |
| Recharts | Data Visualization |


## Database & Storage

- Supabase PostgreSQL
- Supabase Storage for image management

---

# 🔐 Security Implementation

The backend implements:

- Password encryption using BCrypt
- JWT token authentication
- Protected REST endpoints
- Role-based API authorization
- Request validation
- Exception handling


Example:

```
Citizen
   |
   | POST /api/issues
   |
Spring Security
   |
JWT Validation
   |
Issue Service
   |
Database
```

---

# 🗄️ Database Design

Main entities:

```
User

id
name
email
password
phone
role


Issue

id
title
description
category
severity
status
latitude
longitude
address
imageUrl
createdAt
updatedAt
citizen_id
```


Relationships:

```
User
 |
 | 1:N
 |
Issue
```

---

# ⚙️ Running Locally

## Backend Setup


Clone repository:

```bash
git clone <repository-url>
```

Navigate:

```bash
cd backend
```


Configure database:

`application.properties`

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/fixmycity
spring.datasource.username=postgres
spring.datasource.password=password

spring.jpa.hibernate.ddl-auto=update
```


Run:

```bash
./mvnw spring-boot:run
```

Backend runs on:

```
http://localhost:8080
```


---

## Frontend Setup


Navigate:

```bash
cd frontend
```


Install dependencies:

```bash
npm install
```


Create environment file:

```
.env.local
```


Add:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```


Run:

```bash
npm run dev
```


Frontend runs on:

```
http://localhost:3000
```




---

# 👨‍💻 Author

**Abir Rahman**

Computer Science & Engineering Student

GitHub:
https://github.com/abirzishan32


---