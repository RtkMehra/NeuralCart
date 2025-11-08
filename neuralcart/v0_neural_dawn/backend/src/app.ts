import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import { apiRouter } from './routes';
import { errorHandler } from './middleware/error-handler';

const app = express();

app.disable('x-powered-by');

app.use(helmet());
app.use(
  cors({
    origin: '*'
  })
);
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/v1', apiRouter);

app.use(errorHandler);

export { app };

