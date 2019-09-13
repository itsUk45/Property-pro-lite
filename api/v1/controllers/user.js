import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import uuidv1 from 'uuid/v1';
import { Users, USERS } from '../models/Users';
import { signupV } from '../middleware/validators';
import {userOutput} from '../helpers/userHelper';
import {GenerateTokens, verifyUser} from '../helpers/jwtAuthHelper.js';

let token =null;
const signup = (req, res, next) => {
  const {
    email, firstName, lastName, phoneNumber, address, isAgent, gender, password,
  } = req.body.data;

  // function to create new user if user doesn't exist in the data storage
  const userCreation = () => {
    const id = uuidv1();
    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(password, saltRounds); // sync method
    const userObject = new Users(id, email, firstName, lastName, phoneNumber,
                                address, isAgent, gender, hashedPassword, gender);
    const createNewUser = userObject.createUser(); // await the promise here using await
    token = GenerateTokens(email);
    const userOut = userOutput(token,id, firstName, lastName, email, phoneNumber,
                               address, isAgent, gender, hashedPassword);

   return res.status(201).send(userOut);
  };

  if (USERS.length === 0) { // Check if there's no user in USERS array, then create new user
    userCreation(); // actual user is created
  } else {
    // Iterate USERS storage to find if there's a user with the submitted email
    let user =undefined;
    USERS.forEach((elements, index, array) => {
      if(elements.email === email){
        user = USERS[index];
      }
    });

    if(user !=undefined){
      res.status(409).send({ // user already exist
          status: 'error',
          error: `User with email ${email} already exist please use different credentials`,
        });
    }else{
      userCreation(); // actual user is created
    }
  }
};

//Signin user 
const signin = (req, res) => {
  if (USERS.length === 0){
   return res.status(404).send({
    'status':'error',
    'error': 'user not found! please use different credentials'
   }); 
  }

  // get user model and extract emaill and password
  let user = undefined;
  let id, firstName, lastName,email, phoneNumber,
                               address, isAgent, gender, password;  
  USERS.forEach((elements, index, array) => {
    if (req.body.data.email === elements.email) {
       user = USERS[index];
       id = elements.id;
       firstName =elements.first_name;
       lastName = elements.last_name;
       email = elements.email;
       phoneNumber = elements.phone_number;
       address =elements.address;
       isAgent = elements.is_agent;
       gender = elements.gender;
       password = elements.password;

       //break;
    }
  });

  if (user === undefined) {
      return res.status(404).send(`User with the given email not found`);
  }

  bcrypt.compare(req.body.data.password, user.password, (err, result) => {
        if (!result) {
          return res.status(400).send('wrong credentials password');
        } else {
           //verify tokens generated during signup to make sure tokens belongs to that user only, not new login user
           const decoded = verifyUser(token, res);
           // sigin user or if tokens expired, then generate new tokens
           //TODO ACTUALLY we should check for expiry first before comparing the emails 
           if(decoded.email===email) return res.status(200).send(userOutput(token, id, firstName,lastName,
            email, phoneNumber, address, isAgent, gender, password));
           // generate new tokens for the user logingin
           return  res.status(200).send(userOutput(GenerateTokens(email), id, firstName,lastName,
            email, phoneNumber, address, isAgent, gender, password));
        } 
   });
};

export default { signup, signin };


/*
BLOCKERS, cant send header error happendds everytime the array has 2 or more user objects,
as per reddit user suggestions, problem is with the forEach loop, so better use traditional for loop
*/


// USER2 suggestion works vola!!!!!!!

/*
separate other code computation from the loop, and only keep one conditional statement to
easily break the loop, otherwise the loop will continue runing until the last statements in the chain
without actually breaking
*/

//USER3 IMplementing with array.find method, WORKS VOLAAAAAAAAAAAA!!!!!!!!!!!!

// const signin = (req, res) => {
//   if (USERS.length === 0){
//    return res.status(404).send({
//     'status':'error',
//     'error': 'user not found! please use different credentials'
//    }); 
//   }
//   // find user by email
//   const user = USERS.find((user) => {
//     return req.body.data.email === user.email;
//   });
//   if (!user) {
//     return res.status(404).send(`User with the given email not found`);
//   }
//   // compare hashed passwords with user submitted password using bcrypt compare
//   bcrypt.compare(req.body.data.password, user.password, (err, result) => {
//     if (!result) {
//       return res.status(400).send('wrong credentials password');
//     }
//     return res.status(200).send('login successful');
//   });

// };


/*
BEST PRACTICES based on today's http headers already sent error,
always separate other computations from the loop, use the loop to check for one conditions like email match
then other comparision like passwords to be done outside the loop
*/