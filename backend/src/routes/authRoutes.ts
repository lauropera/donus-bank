import 'express-async-errors';
import { Router } from 'express';
import { userController } from './controllerInstances';

const router = Router();

router.post('/login', userController.login);
router.post('/register', userController.register);

export default router;