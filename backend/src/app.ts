import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import errorHandler from './middleware/errorHandler.middleware';
import { NotFoundError } from './utils/AppError';

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/v1/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

// 404 handler for undefined routes
app.use((req: Request, _res: Response, next) => {
  next(new NotFoundError(`Route ${req.method} ${req.originalUrl} not found`));
});

// Global error handler (must be last middleware)
app.use(errorHandler);

export default app;
