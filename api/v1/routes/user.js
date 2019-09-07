// User route for all operations performed on user
import express from 'express';
import userController from '../controllers/user.js';

const router = express.Router();

router.post('/signup', userController.signup);
router.post('/signin', userController.signin);
































export default router;