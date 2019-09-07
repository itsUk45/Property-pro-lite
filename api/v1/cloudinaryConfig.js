import  cloudinary from 'cloudinary';

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.api_key,
	api_secret: process.env.api_secret
});



exports.uploads = (file) =>{
	return new Promise(resolve => {
		cloudinary.uploader.upload(file, (result) =>{
			resolve({url: result.url, id: result.public_id})
		}, 
	{resource_type: "auto"})
})};



//separate setup for  cloudinary, details where on the property route before
const CLOUDINARY_URL = process.env.CLOUDINARY_URL;
const CLOUDINARY_UPLOAD_PRESET = process.env.CLOUDINARY_UPLOAD_PRESET;