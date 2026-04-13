import express, { Application, Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import classifyRoutes from "./routes/classify.routes";
import { config } from "./config";
import { logger } from "./utils/logger";
import { errorMiddleware } from "./middleware/error.middleware";
import { rateLimiter } from "./middleware/rate-limit.middleware";

const app: Application = express();

// Swagger configuration
const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Gender Classification API",
      version: "1.0.0",
      description: "A professional API for name gender classification.",
    },
    servers: [
      {
        url: config.env === "development" ? `http://localhost:${config.port}` : "https://api-integration-assessment.vercel.app/",
        description: config.env === "development" ? "Local server" : "Production server",
      },
    ],
  },
  // Broaden patterns to ensure Swagger finds the route files in any environment
  apis: [
    path.join(process.cwd(), "src/routes/*.ts"),
    path.join(process.cwd(), "dist/routes/*.js"),
    "./src/routes/*.ts",
    "./routes/*.js",
  ],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

// Middleware
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(morgan(config.env === "development" ? "dev" : "combined", {
  stream: { write: (message) => logger.info(message.trim()) },
}));
app.use(rateLimiter);

// Swagger UI - Use options that improve compatibility with serverless environments
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocs, {
    customSiteTitle: "Gender Classifier API Docs",
    swaggerOptions: {
      persistAuthorization: true,
    },
  })
);

// API Routes
app.use("/api", classifyRoutes);

// Health check
app.get("/health", (req, res) => res.status(200).json({ status: "ok" }));

// UI (Frontend)
app.get("/", (req: Request, res: Response) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Gender Classifier AI</title>
        <style>
            :root {
                --primary: #4f46e5;
                --bg: #f8fafc;
                --card: #ffffff;
                --text: #1e293b;
            }
            body {
                font-family: 'Inter', -apple-system, sans-serif;
                background-color: var(--bg);
                color: var(--text);
                margin: 0;
                display: flex;
                flex-direction: column;
                align-items: center;
                min-height: 100vh;
                padding-top: 4rem;
            }
            .container {
                max-width: 600px;
                width: 90%;
                text-align: center;
            }
            h1 { font-size: 2.5rem; margin-bottom: 0.5rem; color: var(--primary); }
            p { color: #64748b; margin-bottom: 2rem; }
            .search-box {
                background: var(--card);
                padding: 1.5rem;
                border-radius: 1rem;
                box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
                display: flex;
                gap: 0.5rem;
                margin-bottom: 2rem;
            }
            input {
                flex: 1;
                padding: 0.75rem 1rem;
                border: 1px solid #e2e8f0;
                border-radius: 0.5rem;
                font-size: 1rem;
            }
            button {
                background: var(--primary);
                color: white;
                border: none;
                padding: 0.75rem 1.5rem;
                border-radius: 0.5rem;
                cursor: pointer;
                font-weight: 600;
                transition: opacity 0.2s;
            }
            button:hover { opacity: 0.9; }
            .results {
                background: var(--card);
                padding: 1.5rem;
                border-radius: 1rem;
                box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
                display: none;
                text-align: left;
            }
            .links { margin-top: 3rem; display: flex; gap: 1rem; justify-content: center; }
            .link { text-decoration: none; color: var(--primary); font-weight: 500; }
            pre { background: #f1f5f9; padding: 1rem; border-radius: 0.5rem; overflow-x: auto; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Gender Classifier AI</h1>
            <p>Predict gender with confidence using our professional API.</p>
            
            <div class="search-box">
                <input type="text" id="nameInput" placeholder="Enter a name (e.g., Peter)" onkeypress="if(event.key==='Enter') classify()">
                <button onclick="classify()">Classify</button>
            </div>

            <div id="resultBox" class="results">
                <h3>Result:</h3>
                <pre id="resultJson"></pre>
            </div>

            <div class="links">
                <a class="link" href="/api-docs">📖 Swagger API Docs</a>
                <a class="link" href="https://github.com/ibraheembello/Api-Integration-Assessment">⭐ GitHub Repo</a>
            </div>
        </div>

        <script>
            async function classify() {
                const name = document.getElementById('nameInput').value;
                if (!name) return alert('Please enter a name');
                
                const resultBox = document.getElementById('resultBox');
                const resultJson = document.getElementById('resultJson');
                
                try {
                    const res = await fetch(\`/api/classify?name=\${encodeURIComponent(name)}\`);
                    const data = await res.json();
                    resultBox.style.display = 'block';
                    resultJson.textContent = JSON.stringify(data, null, 2);
                } catch (e) {
                    alert('Error classifying name');
                }
            }
        </script>
    </body>
    </html>
  `);
});

// Catch-all route for unhandled paths
app.use("*", (req: Request, res: Response) => {
  res.status(404).json({ status: "error", message: "Route not found" });
});

// Global Error Handler
app.use(errorMiddleware);

// Only listen when not running on Vercel
if (process.env.NODE_ENV !== "test" && !process.env.VERCEL) {
  app.listen(config.port, () => {
    logger.info(`Server is running on port ${config.port} in ${config.env} mode`);
    logger.info(`Swagger UI available at http://localhost:${config.port}/api-docs`);
  });
}

export default app;
