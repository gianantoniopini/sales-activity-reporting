import express from 'express';
export const router = express.Router();
import { getSalesActivity } from '../controllers/sales-activity-controller';

router.get('/salesdata/activity', getSalesActivity);
