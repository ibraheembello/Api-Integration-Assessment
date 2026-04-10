# HNG 14 Stage 0: API Integration & Data Processing

A modular, high-performance RESTful API built to integrate with the external Genderize API, process the incoming data based on specific business logic, and return a strictly formatted JSON response.

**Live API URL:** `[https://api-integration-assessment.vercel.app/api/classify?name=john]`

---

## 🚀 Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Deployment:** Vercel (Serverless)

---

## ⚙️ Features & Requirements Addressed

- **Single `GET` Endpoint:** Integrates with `https://api.genderize.io/`.
- **Data Processing:** Extracts `gender`, `probability`, and `count` (renamed to `sample_size`).
- **Dynamic Confidence Calculation:** Computes `is_confident` strictly as `true` only when `probability >= 0.7` AND `sample_size >= 100`.
- **Dynamic Timestamp:** Generates `processed_at` in UTC ISO 8601 format on every request.
- **Strict Error Handling:** Handles missing parameters, invalid data types, external API failures, and edge cases.
- **CORS Configured:** Returns `Access-Control-Allow-Origin: *` to ensure compatibility with automated grading scripts.
- **Performance:** Optimized to respond in under 500ms (excluding external API latency).

---

## 📖 API Documentation

### **Classify Name**

Analyzes a given name and returns gender probability data.

- **URL:** `/api/classify`
- **Method:** `GET`
- **Query Parameters:**
  - `name` (string, required): The name to be analyzed.

#### **Success Response (200 OK)**

```json
{
  "status": "success",
  "data": {
    "name": "john",
    "gender": "male",
    "probability": 0.99,
    "sample_size": 1234,
    "is_confident": true,
    "processed_at": "2026-04-10T12:00:00.000Z"
  }
}
```

#### **Error Responses**

**400 Bad Request** (Missing or empty parameter)

```json
{
  "status": "error",
  "message": "Missing or empty name parameter"
}
```

**422 Unprocessable Entity** (Invalid data type)

```json
{
  "status": "error",
  "message": "name must be a string"
}
```

**404 Not Found** (Edge Case: Name not found in Genderize database)

```json
{
  "status": "error",
  "message": "No prediction available for the provided name"
}
```

**502 Bad Gateway** (External API failure)

```json
{
  "status": "error",
  "message": "Upstream or server failure"
}
```

---

## 💻 Local Setup & Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/ibraheembello/[YOUR-REPO-NAME].git
   cd [YOUR-REPO-NAME]
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Run the development server:**

   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

---

## 👨‍💻 Author

**Ibraheem Bello (BaCkEnD_bRo)**

- GitHub: [@ibraheembello](https://github.com/ibraheembello)

---

---
