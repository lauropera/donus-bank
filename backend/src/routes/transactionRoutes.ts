import 'express-async-errors';
import { Router } from 'express';
import { transactionController } from './controllerInstances';
import authMiddleware from '../middlewares/AuthMiddleware';

const router = Router();

router.use(authMiddleware);
router.get('/', transactionController.listAll);
router.post('/new', transactionController.create);

export default router;
