import multer from 'multer';
// Multer configuration
import {propertyStorage} from '../models/Property';
const storage = multer.diskStorage({
	destination: (req, file, callBack) => {
		callBack( null, './uploads/');

	},
	filename: (req, file, callBack) => {
		callBack(null, new Date().toISOString() + file.originalname);
	}
});

const upload1 = multer({storage:storage});
const upload = upload1.single('image');

export {upload};