import express from 'express';
import { getQuote } from '../controllers/exchangeController';

const router = express.Router({ mergeParams: true });

router.route('/quote')
    .get(getQuote);

export default router;