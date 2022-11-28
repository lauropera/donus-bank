import 'express-async-errors';
import { Router } from 'express';
import authMiddleware from '../middlewares/AuthMiddleware';
import { transactionController } from './controllerInstances';

const router = Router();

router.use(authMiddleware);
router.get('/', transactionController.listAll);

export default router;
