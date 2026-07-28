import express from 'express';
import { 
  register, 
  login, 
  forgotPassword, 
  resetPassword, 
  changePassword, 
  getMe, 
  updateProfile 
} from '../controllers/authController.js';
import { 
  registerValidator, 
  loginValidator, 
  forgotPasswordValidator, 
  resetPasswordValidator, 
  changePasswordValidator, 
  updateProfileValidator 
} from '../validators/authValidator.js';
import validateFields from '../middleware/validationMiddleware.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

// Public Gateways
router.post('/register', registerValidator, validateFields, register);
router.post('/login', loginValidator, validateFields, login);
router.post('/forgot-password', forgotPasswordValidator, validateFields, forgotPassword);
router.post('/reset-password', resetPasswordValidator, validateFields, resetPassword);

// Protected Operations
router.get('/me', protect, getMe);
router.put('/update-profile', protect, updateProfileValidator, validateFields, updateProfile);
router.post('/change-password', protect, changePasswordValidator, validateFields, changePassword);

export default router;
