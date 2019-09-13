import jwt from 'jsonwebtoken';
let decodedToken;
const checkTokens = (req, res, next) => {
  try {
    decodedToken = jwt.verify(req.body.data.token, 'secretKeys');
    next();
  } catch (error) {
    	res.status(401).send({ // 401 is unauthorised access 409 is conflicting request
    		status: 'error',
    		message: `Auth failed: ${error}`,
    	});
  }
};

// middleware function to use if the request was made with form-date instead of json
const checkTokensFormData = (req, res, next) => {
  try {
    const { token } = req.body;
    const decoded = jwt.verify(token, 'secretKeys');
    console.log(`working and the data decoded is ${decoded.email}`);
    console.log({
      status: 'success',
      message: 'Auth successful, you can now accesss this page: ',
    });
    next();
  } catch (error) {
    res.status(401).send({ // 401 is unauthorised access 409 is conflicting request
      status: 'error',
      message: `Auth failed: ${error}`,
    });
  }
};

// checkTokens();
export { checkTokens, checkTokensFormData, decodedToken };
