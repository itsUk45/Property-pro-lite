import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
//generate tokens
const GenerateTokens = (email) =>{
	const token = jwt.sign(
	  {email,
		}, 'secretKeys',
		{
		  expiresIn: '1hr',
		});
	return token;
} 

//user verification helper function
const verifyUser = (tokens, res) => {
  try{
    const decoded = jwt.verify(tokens, process.env.JWT_KEY);
    return decoded;
  }catch (error){
    res.status(401).send( {'status': 'error', 'error':error});
  }
};


export {GenerateTokens, verifyUser};
