// User route for all operations performed on user
import express from 'express';
import userController from '../controllers/user.js';
import {validateSignup, validateSignin} from '../middleware/validators'
const router = express.Router();

router.post('/signup', validateSignup, userController.signup);
router.post('/signin', validateSignin, userController.signin);
































export default router;