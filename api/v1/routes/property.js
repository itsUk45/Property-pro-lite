// Property routes
import express from 'express';
import multer from 'multer';
import FormData from 'form-data';
import axios from 'axios';
import propertyController from '../controllers/property';
import {upload} from '../middleware/multerConfig'
import {checkTokens,checkTokensFormData} from '../middleware/auth';
import {validatePost} from '../middleware/validators';


const router = express.Router();
router.post('/', upload, propertyController.postProperty); // BOLCKER, cant add auth middleware chec

router.patch('/:propertyId', checkTokens, propertyController.updateProperty);
router.patch('/:propertyId/sold',checkTokens, propertyController.markSold);
router.delete('/:propertyId', checkTokens, propertyController.deleteProperty);
router.get('/', propertyController.getAllProperty);
router.get('/type', propertyController.getAllSpecificTypesProperty);
router.get('/:propertyId', propertyController.viewPropertyDetails);

export default router;

