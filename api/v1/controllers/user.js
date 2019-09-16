import bcrypt from 'bcrypt';
import uuidv1 from 'uuid/v1';
import {userOutput, serverError} from '../helpers/userHelper';
import {GenerateTokens, verifyUser} from '../helpers/jwtAuthHelper.js';
import {pool} from '../models/configDB';
import {User} from '../models/Users';

/*
...............................................................................................
IMPLEMENTATION USING POSTGRESQL DATABASE INSTEAD OF NON PERSISTENT STORAGE i.e  DATA STRUCTURE
...............................................................................................
*/
let token= null;
// signup and put the data into a possgres database
const signup = async (req, res) => {
  const {email, firstName, lastName, phoneNumber, address, isAgent, gender, password,} = req.body.data;
  // BLOCKER, leaving existings user check to the DB constraint check rather than custom validations
  try{
    const id = uuidv1();
    const hashPassword = bcrypt.hashSync(password, 10); // hashing the plain password using bcrypt
    const users = new User(id,email, firstName, lastName, phoneNumber, address, isAgent, gender, hashPassword);
    // retrieve user with the corresponding email 
    const userFound = await users.findUserByEmail(email);
    if(userFound.rows.length===0){
      // can create user with the supplied data
      await users.createUser();
      token = GenerateTokens(email); // update the token variable with the newly generated token
      const outPut = userOutput(token, id, firstName, lastName, email, phoneNumber, address, isAgent, gender, hashPassword)
      res.status(201).json(outPut);
    }else{
      // user with the given email exist, and we cannot create duplicate,postgresql db constraint
      res.status(409).json({
        'status': 'error',
        'error': `user with the email ${email} already exist`
      });
    }
    
  }catch(error){
    // incase any error occurs in the try block, we handle it here with a 500 status to the requester
    serverError(error, res);
  }


};


// signin using data from postgres database
const signin = async (req, res) => {
  // get email from the request body data
  const {email,password} = req.body.data;
  try{
    const users = new User();
    const userFound = await users.findUserByEmail(email);
    if(userFound.rows.length===0) return res.status(404).json({'status': 'error', 'error': 'User not found'});
    // validate passwords using bcrypt compare
    bcrypt.compare(password, userFound.rows[0].password, (err, result) => {
      if(!result) return res.status(400).json({'status': 'error','error' : ` password mismatch`});
      // get user details to display 
      const {id, email, first_name, last_name, phone_number, address, is_agent, gender, password} = userFound.rows[0];
      const token = GenerateTokens(email, res);
      const outPut = userOutput(token, id, first_name, last_name,email, phone_number,address, is_agent, gender, password);
      res.status(200).json(outPut);
      // BLOCKER:  Don't generate new tokens when signup token is still valid
      // Cannot read decoded.email when signup route is not hit, because token is still null  . 16/09/2019
         /*  SOME error occuring  16/09/2019, Checkout later.
          const decoded = verifyUser(token, res);
          if(decoded.email === email){
            return  res.status(200).json({
            token,
            email,
            password});
          }else{
          // generate new token
          token = GenerateTokens(email);
          res.status(200).json({
            token,
            email,
            password});
        }
        */
    } );



  }catch(error) {
    serverError(error, res);
  }

};



export default { signup, signin };

























/*
.......................................................           .
.......................................................        ... ...
IMPLEMENTATION USING DATA STRUCTURE INSTEAD OF DATABASE          ...
.......................................................       ....  ....
.......................................................      .....   .....

// let token =null;
// const signup = async (req, res, next) => {
//   const {
//     email, firstName, lastName, phoneNumber, address, isAgent, gender, password,
//   } = req.body.data;

//   // function to create new user if user doesn't exist in the data storage
//   const userCreation = () => {
//     const id = uuidv1();
//     const saltRounds = 10;
//     const hashedPassword = bcrypt.hashSync(password, saltRounds); // sync method
//     const userObject = new Users(id, email, firstName, lastName, phoneNumber,
//                                 address, isAgent, gender, hashedPassword, gender);
//     const createNewUser = userObject.createUser(); // await the promise here using await
//     token = GenerateTokens(email);
//     const userOut = userOutput(token,id, firstName, lastName, email, phoneNumber,
//                                address, isAgent, gender, hashedPassword);

//    return res.status(201).send(userOut);
//   };

//   if (USERS.length === 0) { // Check if there's no user in USERS array, then create new user
//     userCreation(); // actual user is created
//   } else {
//     // Iterate USERS storage to find if there's a user with the submitted email
//     let user =undefined;
//     USERS.forEach((elements, index, array) => {
//       if(elements.email === email){
//         user = USERS[index];
//       }
//     });

//     if(user !=undefined){
//       res.status(409).send({ // user already exist
//           status: 'error',
//           error: `User with email ${email} already exist please use different credentials`,
//         });
//     }else{
//       userCreation(); // actual user is created
//     }
//   }
// };




//Signin user  using data from datas tructure
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

*/



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