import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import * as authController from './auth.controller';

const checkEmailLimiter = rateLimit({
  windowMs: 60_000,
  max: 10,
  message: {
    success: false,
    error: { code: 'RATE_LIMIT_EXCEEDED', message: 'Too many requests' },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const router = Router();

router.post('/register', authController.register);
router.get('/check-email', checkEmailLimiter, authController.checkEmail);

export default router;
