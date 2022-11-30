import 'express-async-errors';
import { Router } from 'express';
import { transactionController } from './controllerInstances';

const router = Router();

router.get('/all', transactionController.listAll);
router.post('/new', transactionController.create);

export default router;
