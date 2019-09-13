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

export {userOutput};