import 'express-async-errors';
import { Router } from 'express';
import authMiddleware from '../middlewares/AuthMiddleware';
import { userController } from './controllerInstances';

const router = Router();

router.post('/login', userController.login);
router.post('/register', userController.register);
router.get('/me', authMiddleware, userController.getUser);

export default router;
