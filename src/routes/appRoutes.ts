import express from 'express';
import exchangeRoutes from './exchangeRoutes';

const appRouter = express.Router({ mergeParams: true });

appRouter.use('/', exchangeRoutes);

export default appRouter;