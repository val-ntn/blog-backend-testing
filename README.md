# Your Project Name

## Overview
Projekt Übung.
Umgestalten einer Webseite.
Implementierung eines Blogs, 
mit CRUD funktionalität für einen Admin über ein Dashboard.

---

## Getting Started

### Prerequisites
- Node.js (version X or above)
- MongoDB running (locally or remote)


### Installation

1. **Clone the repositories**

```bash
git clone https://github.com/val-ntn/blog-backend-testing
git clone https://github.com/yourusername/val-ntn/blog-frontend-testing
```



**Backend Setup**
2. **Navigate to the backend directory**
```bash
cd backend
```


3. **Install dependencies**
```bash
npm install
```

4. **Create a .env file with your environment variables**
for example:
```env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
```
5. **Run the setup script to create an admin user and seed example posts and events:**
```bash
node setup.js
```

6. **Follow the prompts to create an admin user**

7. **Start the backend server**
```bash
npm start
```

**Frontend Setup**
8. **Navigate to the frontend directory**
```bash
cd ../frontend
```

9. **Install dependencies:**
```bash
npm install
```

10. **Create a .env file (if necessary) with API base URL, e.g.**
```env
VITE_API_BASE_URL=http://localhost:5000
```

11. **Start the frontend dev server:**
```bash
npm run dev
```