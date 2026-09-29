import express, { Application, Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import corsOptions from './config/cors';
import { globalLimiter } from './middleware/rateLimiter.middleware';
import errorHandler from './middleware/errorHandler.middleware';
import { NotFoundError } from './utils/AppError';
import { morganMiddleware } from './utils/logger';

import apiRoutes from './routes';

const app: Application = express();

// 1. Security HTTP Headers
app.use(helmet());

// 2. CORS with configured origin whitelist and credentials
app.use(cors(corsOptions));

// 3. Request body parsers with 10MB limit (SEC-013)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 4. HTTP Request Logger
app.use(morganMiddleware);

// 5. Global API Rate Limiter
app.use(globalLimiter);

// 6. API Routes (/api/v1/*)
app.use('/api/v1', apiRoutes);

// 7. 404 Handler for undefined routes
app.use((req: Request, _res: Response, next: NextFunction) => {
  next(new NotFoundError(`Route ${req.method} ${req.originalUrl} not found`));
});

// 8. Global Error Handler (must be last middleware)
app.use(errorHandler);

export default app;
