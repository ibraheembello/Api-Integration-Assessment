# 🧬 Gender Classifier AI - API Integration Assessment

A professional, high-performance Node.js/TypeScript API designed to classify names by gender using the [Genderize.io](https://genderize.io/) service. This project features robust error handling, caching, rate limiting, and interactive documentation.

[![CI](https://github.com/ibraheembello/Api-Integration-Assessment/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/ibraheembello/Api-Integration-Assessment/actions/workflows/ci.yml)
[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://api-integration-assessment.vercel.app/)
[![Swagger Docs](https://img.shields.io/badge/API-Docs-blue)](https://api-integration-assessment.vercel.app/api-docs)

---

## 🚀 Live Demo & UI

Experience the API directly through our polished web interface:

👉 **[Launch Live Application](https://api-integration-assessment.vercel.app/)**

### **Application Preview**
![Gender Classifier UI](https://raw.githubusercontent.com/ibraheembello/Api-Integration-Assessment/main/screenshot.png)
*(Note: Please ensure you upload a 'screenshot.png' to your repository root to display this image correctly.)*

---

## ✨ Features

- **Professional UI:** Minimalist, responsive landing page for live name classification.
- **Interactive Documentation:** Full Swagger/OpenAPI 3.0 integration at `/api-docs`.
- **Advanced Architecture:** Decoupled service/controller layers with Dependency Injection.
- **High Reliability:** 
  - Comprehensive Zod request validation.
  - Centralized global error handling with custom operational error classes.
  - 100% Test coverage (Unit & Integration) with Jest and Supertest.
- **Performance Optimized:**
  - In-memory caching (Node-Cache) to reduce upstream API latency.
  - Explicit timeouts and AbortController on all external network requests.
- **Secure:** Integrated Rate Limiting and CORS protection.
- **CI/CD:** Automated testing and builds via GitHub Actions.

---

## 🛠️ Tech Stack

- **Runtime:** Node.js (v20+)
- **Language:** TypeScript
- **Framework:** Express.js
- **Validation:** Zod
- **Documentation:** Swagger UI / swagger-jsdoc
- **Logging:** Winston & Morgan
- **Testing:** Jest, Supertest, Nock
- **Caching:** Node-Cache
- **Security:** Express-Rate-Limit

---

## 📖 API Usage

### **Endpoint: Classify Name**
`GET /api/classify?name={name}`

#### **Example Request**
```bash
curl "https://api-integration-assessment.vercel.app/api/classify?name=Alice"
```

#### **Success Response (200 OK)**
```json
{
  "status": "success",
  "data": {
    "name": "Alice",
    "gender": "female",
    "probability": 0.98,
    "sample_size": 100,
    "is_confident": true,
    "processed_at": "2026-04-13T04:57:05.613Z"
  }
}
```

---

## 🛠️ Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ibraheembello/Api-Integration-Assessment.git
   cd Api-Integration-Assessment
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run in development mode:**
   ```bash
   npm run dev
   ```

4. **Run tests:**
   ```bash
   npm test
   ```

5. **Build for production:**
   ```bash
   npm run build
   ```

---

## 🧪 Testing Strategy

This project follows a rigorous testing protocol:
- **Unit Tests:** Verify `GenderizeService` logic using Nock to mock external API responses.
- **Integration Tests:** Verify full HTTP request/response cycles, including all error paths (400, 404, 422, 502).

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

**Author:** [Ibraheem Bello](https://github.com/ibraheembello)
**HNG Internship - Stage 0 Assessment**
