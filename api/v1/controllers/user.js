import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import uuidv1 from 'uuid/v1';
import { Users, USERS } from '../models/Users';
import { signupV } from '../middleware/validators';
// Generate tokens using jwt
const GenerateTokens = (email) => jwt.sign({
  email,
}, 'secretKeys',
{
  expiresIn: '1hr',
});

// Output to be printed to the user as json object after successful signup or signin
const userOutput = (
  id, firstName, lastName, email, phoneNumber, address, isAgent, gender, hashedPassword,
) => {
  const result = {
    status: 200,
    data: {
      token: GenerateTokens(email),
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

// signup route
const signup = (req, res, next) => {
  // const {error} = signupV(req.body)
  // if(error) return res.status(400).json({status:'error', error: error.details[0].message});
  const {
    email, firstName, lastName, phoneNumber, address, isAgent, gender, password,
  } = req.body.data;

  // Create new user if user doesn't exist in the data storage
  const userCreation = () => {
    const id = uuidv1();
    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(password, saltRounds); // sync method
    const userObject = new Users(id, email, firstName, lastName, phoneNumber,
      address, isAgent, gender, hashedPassword, gender);
    const createNewUser = userObject.createUser(); // await the promise here using await
    const userOut = userOutput(id, firstName, lastName, email, phoneNumber,
      address, isAgent, gender, hashedPassword);

    res.send(userOut);
  };
  if (USERS.length === 0) { // Check if there's no user in USERS array, then create new user
    userCreation();
  } else {
    // Iterate to find if there's a user with the submitted email
    USERS.forEach((elements, index, array) => {
      if (email === elements.email) {
        res.status(409).send({ // user already exist
          status: 'error',
          error: `User with email ${email} already exist please use different credentials`,
        });
      // BLOCKERS, cant send headers after they are sent to clients . this happens after multiple hitting of the signup with duplicate data
      } else { // Create new user since there's no email match
        userCreation();
      }
    });
  }
};


// signin user controller ie logic from user signin
const signin = (req, res, next) => {
  if (USERS.length === 0) res.status(404).send({'status':'error', 'error': 'user not found! please use different credentials'}); 
  // get user model and extract emaill and password
  USERS.forEach((elements, index, array) => {
    if (req.body.data.email === elements.email) {
      // compare hashed passwords with user submitted password using bcrypt compare
      bcrypt.compare(req.body.data.password, USERS[index].password, (err, result) => {
        if (err) throw err;
        if (result) {
          // generate tokens here using the user email, we can then use these token to control user access
          const userOut = userOutput(elements.id, elements.first_name, elements.last_name, elements.email,
            elements.phone_number, elements.address, elements.is_agent, elements.gender, elements.password);
          res.send(userOut);
        } else {
          res.send('wrong credentials password');
        }
      });
    } else {
      res.send('wrong credentials email');
    }
  });
};


export default { signup, signin };
