import {GenerateTokens} from '../helpers/jwtAuthHelper';

// Output to be printed to the user as json object after successful signup or signin
const userOutput = (
  token, id, firstName, lastName, email, phoneNumber, address, isAgent, gender, hashedPassword,
) => {
  const result = {
    status: 'success',
    data: {
      //token: GenerateTokens(email),
      token,
      id,
      firstName,
      lastName,
      email,
      phoneNumber,
      address,
      isAgent,
      gender,
      hashedPassword,
    },
  };
  return result;
};


// when something goes wrong in a try block of asyn function
const serverError =(error, res) => {
  return res.status(500).json({
    'status': 'error',
    'error': `something went wrong  ${error}`
  })
};

export {userOutput, serverError};