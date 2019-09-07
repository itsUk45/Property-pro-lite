// Property routes
import express from 'express';
import multer from 'multer';
import FormData from 'form-data';
import axios from 'axios';
import propertyController from '../controllers/property';
import {upload} from '../middleware/multerConfig'
import {checkTokens,checkTokensFormData} from '../middleware/auth';


const router = express.Router();
router.post('/', upload, propertyController.postProperty);

router.patch('/:propertyId', checkTokens, propertyController.updateProperty);
router.patch('/:propertyId/sold', propertyController.markSold);
router.delete('/:propertyId', propertyController.deleteProperty);
router.get('/', propertyController.getAllProperty);
router.get('/type', propertyController.getAllSpecificTypesProperty);
router.get('/:propertyId', propertyController.viewPropertyDetails);

export default router;