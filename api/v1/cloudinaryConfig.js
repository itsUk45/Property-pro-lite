import  cloudinary from 'cloudinary';

cloudinary.config({
	cloud_name: 'ddrxcfhxk',
	api_key: '546586939958268',
	api_secret: 'kVOO1bfqA5UrR3E6h7KWl3n8jF0'
});



exports.uploads = (file) =>{
	return new Promise(resolve => {
		cloudinary.uploader.upload(file, (result) =>{
			resolve({url: result.url, id: result.public_id})
		}, 
	{resource_type: "auto"})
})};



//separate setup for  cloudinary, details where on the property route before
const CLOUDINARY_URL = " https://api.cloudinary.com/v1_1/ddrxcfhxk/upload";
const CLOUDINARY_UPLOAD_PRESET = "gcupp3vx";