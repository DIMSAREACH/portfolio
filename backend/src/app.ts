import express, { Application, Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import corsOptions from './config/cors';
import { globalLimiter } from './middleware/rateLimiter.middleware';
import errorHandler from './middleware/errorHandler.middleware';
import { NotFoundError } from './utils/AppError';
import { morganMiddleware } from './utils/logger';

import apiRoutes from './routes';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger';

const app: Application = express();

// 1. Security HTTP Headers (CSP disabled to allow Swagger UI inline assets)
app.use(
  helmet({
    contentSecurityPolicy: false,
  }),
);

// 2. HTTP Response Compression (SEO-001 / PRD Section 24.2)
app.use(compression());

// 3. CORS with configured origin whitelist and credentials
app.use(cors(corsOptions));

// 3. Request body & cookie parsers with 10MB limit (SEC-013)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// 4. HTTP Request Logger
app.use(morganMiddleware);

// 5. Global API Rate Limiter
app.use(globalLimiter);

// 6. Interactive OpenAPI/Swagger Documentation (API-017 / PRD Section 6.6)
app.get('/api/docs.json', (_req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});
app.use(
  '/api/docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customSiteTitle: 'Developer Portfolio API Documentation',
  }),
);

// 7. API Routes (/api/v1/*)
app.use('/api/v1', apiRoutes);

// 7. 404 Handler for undefined routes
app.use((req: Request, _res: Response, next: NextFunction) => {
  next(new NotFoundError(`Route ${req.method} ${req.originalUrl} not found`));
});

// 8. Global Error Handler (must be last middleware)
app.use(errorHandler);

export default app;
