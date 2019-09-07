import axios from 'axios';
import FormData from 'form-data';

// Axios Implementation
const formData = new FormData();
       formData.append('file',req.file);
       formData.append('upload_preset',CLOUDINARY_UPLOAD_PRESET);
 axios({
 	url: CLOUDINARY_URL,
 	method:'POST',
 	headers: {
 		'Content-type':'application/form-data'
 	},
 	data: formData
 }).then( res => console.log(res))
   .catch(err => console.log(err));

 // Fetch api implemention
const formData = new FormData();
	//var fileField = document.querySelector('input[type="file"]');
console.log("form data is "+formData);
formData.append('file', req.file);
formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

fetch(CLOUDINARY_URL, {
	  method: 'POST',
	  body: formData
})
.then(response => console.log(response.json()))
.catch(error => console.error('Error:', error))
.then(response => console.log('Success:', JSON.stringify(response)));