import Joi from 'joi';
import multer from 'multer';

// Users validations
//signup
const signupV = (data) => {
	const schema = {
		data:{
			email: Joi.string().email({ minDomainSegments: 2 }).required(),
			firstName: Joi.string().required(),
			lastName: Joi.string().required(),
			phoneNumber: Joi.number().required(),
			address: Joi.string().required(),
			isAgent: Joi.boolean().required(),
			gender: Joi.string().required(),
			password: Joi.string().min(5).required()

		}
	}
	return Joi.validate(data,schema);
}

const validateSignup = (req, res,next) =>{
    const {error} = signupV(req.body)
  	if(error) return res.status(400).json({status:"error", error: error.details[0].message});
  	next();
};

// signin
const signinV = (data) => {
	const schema = {
		data:{
			email: Joi.string().email({ minDomainSegments: 2 }).required(),
			password: Joi.string().min(5).required()

		}
	}
	return Joi.validate(data,schema);
}

const validateSignin = (req, res,next) =>{
    const {error} = signinV(req.body)
  	if(error) return res.status(400).json({status:"error", error: error.details[0].message});
  	next();
};


// Property validations
//post property
const postPropertyV = (postData) => {
  const schema = {
  
  		'status': Joi.string().required(),
  		'city': Joi.string().required()
  
  }
  return Joi.validate(postData, schema);

};

const validatePost = (req, res, next) =>{
 const {error} = postPropertyV(req.body);
 if(error) return res.status(400).json({status: 'error', error: error.details[0].message});
 next();
};
export {validateSignup, validateSignin,
        validatePost};

/*
10/09/2019
BLOCKER, cannot validate post property with middleware, nothing happens
need to figure out some ways,
*/