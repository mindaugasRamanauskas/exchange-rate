import dotenv from 'dotenv';

dotenv.config({ path:'.env' });

if (process.env.NODE_ENV == 'dev') {
  dotenv.config({ path: 'environments/dev.env' })
}

import cors from 'cors';
import express from 'express';
import morgan from'morgan';
import { errorHandler } from './middlewares/errorHandler';
import appRoutes from './routes/appRoutes';
import logger from './utils/logger';

const app = express();
const port = process.env.SERVER_PORT || 3000;
const baseUrl = process.env.BASE_API_URL || '/api/v1';
const morganFormat = ':method :url :status :res[content-length] - :response-time ms';

app.use(cors());
app.use(express.json());
app.use(morgan(morganFormat, { stream: { write: (msg) => logger.http(msg) } }));
app.use(baseUrl, appRoutes);
app.use(errorHandler);

app.listen(port, () => {
  return logger.info(`Server is running on http://localhost:${port} in ${process.env.NODE_ENV} mode`);
});
