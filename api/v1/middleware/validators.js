import Joi from 'joi';
//signup
const signupV = (data) => {
	const schema = {
		data:{
			email: Joi.string().email({ minDomainSegments: 2 }).required(),
			firstName: Joi.string().required(),
			lastName: Joi.string().required(),
			phoneNumber: Joi.number().required(),
			address: Joi.string().required(),
			isAgent: Joi.string().required(),
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

export {validateSignup};
