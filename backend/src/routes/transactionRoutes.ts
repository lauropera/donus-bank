import 'express-async-errors';
import { Router } from 'express';
import { transactionController } from './controllerInstances';

const router = Router();

router.get('/', transactionController.listAll);

export default router;
