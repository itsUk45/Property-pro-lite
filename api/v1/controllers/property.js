import uuidv1 from 'uuid/v1';
import multer from 'multer';
import JWT from 'jsonwebtoken';
import {propertyStorage, Property} from '../models/Property';
import {operationSucess, noPropertyError, noPermissionError} from '../helpers/propertyHelper';
//import {checkTokens, decodedToken} from '../middleware/auth';
import {verifyUser} from '../helpers/jwtAuthHelper';
import Joi from 'joi';




/*
...................................................
IMPLEMENTATION USING PERSISTENT STORAGE IE POSTGRESQL DATABASE
...............................................................
*/


//post property
const postProperty = (req, res) => {
  const id = uuidv1();
  const {token, status, type, state, city, address, price} = req.body;
  try{
    console.log('happening here only');
    // verify user with the tokens sent
    const decoded = verifyUser(token, res);
    // create property


  }catch(error){
   res.status(500).json('something bit bad');
  }

};


// update some selected fields with new data
const updateProperty = (req, res) => {
  const id = uuidv1();
  const {token, status, type, state, city, address, price} = req.body;
  try{
    console.log('happening here only');

  }catch(error){
   res.status(500).json('something bit bad');
  }

};

// change property status from available to sold
const markSold = (req, res) => {
  const id = uuidv1();
  const {token, status, type, state, city, address, price} = req.body;
  try{
    console.log('happening here only');

  }catch(error){
   res.status(500).json('something bit bad');
  }

};

// delete property of a given id
const deleteProperty = (req, res) => {
  const id = uuidv1();
  const {token, status, type, state, city, address, price} = req.body;
  try{
    console.log('happening here only');

  }catch(error){
   res.status(500).json('something bit bad');
  }

};

// get all property
const getAllProperty = (req, res) => {
  const id = uuidv1();
  const {token, status, type, state, city, address, price} = req.body;
  try{
    console.log('happening here only');

  }catch(error){
   res.status(500).json('something bit bad');
  }

};

// get all property of the same type
const getAllSpecificTypesProperty = (req, res) => {
  const id = uuidv1();
  const {token, status, type, state, city, address, price} = req.body;
  try{
    console.log('happening here only');

  }catch(error){
   res.status(500).json('something bit bad');
  }

};

// view property details
const viewPropertyDetails = (req, res) => {
  const id = uuidv1();
  const {token, status, type, state, city, address, price} = req.body;
  try{
    console.log('happening here only');

  }catch(error){
   res.status(500).json('something bit bad');
  }

};

//export default {postProperty};

export default {postProperty, updateProperty, markSold, deleteProperty, getAllProperty, getAllSpecificTypesProperty, viewPropertyDetails};

/*
......................................
IMPLEMENTATION WITH NON PERSISTENT STORAGE
............................................

// create new property
const postProperty = async (req, res, next) => {
  const id = uuidv1(); //generate a unique id based on the timestamp
	const {token,status, type, state, city, address, price} = req.body;
  try {
  const decoded = verifyUser(token, res); //verify user tokens
  // Create property if user is authenticated with JWT
  const propertyObj  = new Property(id, status,type.toLowerCase(), state, city, address, price, new Date(), req.file.path, decoded.email);
 
    const data = await propertyObj.createProperty();
    //property output to send as response as per the api specification
    const propertyOutput = {
      "status":'success',
        data
    }
    return res.status(201).send(propertyOutput); // successfull created property 

  }catch(error){
   return  res.status(500).send({'status': 'error', 'error': error});
  }
  };


// update existing property
const updateProperty = async (req, res) => {
  const id = req.params.propertyId;
  const {token, address} = req.body.data;
  if(propertyStorage.length ===0) return noPropertyError(id, res);
  try {

  
   const property = await propertyStorage.find( property => property.id===id )
   if(!property) return noPropertyError(id, res);
   //veryfying user owns the property
   const decoded = verifyUser(token, res);
   if(decoded.email != property.ownerEmail) return noPermissionError(id, res);
   //update data ie address
   property.address = address;
   res.status(200).json(propertyStorage[0]); //updated property data

  }catch (error){
    res.status(500).send({'status': 'error', 'error': error});
  }

};


// Change property status from AVAILABLE to SOLD
const markSold = async (req, res) =>{
  const id = req.params.propertyId;
  const {token} = req.body.data;
  if(propertyStorage.length === 0){
    return noPropertyError(id, res);
  }else{
    try{

      let property =undefined;
      await propertyStorage.forEach( (elements, index, array) =>{
        if(elements.id === id){
          property =propertyStorage[index];
        }
      });

      if(property === undefined){
        return noPropertyError(id, res); 
      }else{
        //check email match
        const decoded = verifyUser(token, res);
          if(decoded.email != property.ownerEmail){
          return noPermissionError(id, res);
          } else{
            let status = property.status;
            if(status==='Available'){
              property.status = 'Sold';
              operationSucess(res);
            }else{
              return res.status(403).json({
                'status': 'error',
                'error': 'Property already marked as sold'
              });
              }
          }
        
      }
      


    }catch(err){
     return res.status(500).json({'status': 'error', 'error': err});
    }
  }
};




// Delete existing property 
const deleteProperty = async (req, res) => {
    const {token} = req.body.data;
    const id = req.params.propertyId;
    const decoded = verifyUser(token, res); //
    if (propertyStorage.length !=0){
      // continue to verify user 
      try {
        //const property = propertyStorage.find( property => property.id===id); //BLOCKER find() not efficient because gettting index was abit costly
        let property = undefined;
        let indexP;
        propertyStorage.forEach( (elements, index, array) =>{
          if(elements.id ===id){
            indexP = index
            property = propertyStorage[index];
          }
        });
        if(property===undefined) return noPropertyError(id, res);
        //verify user
        if(decoded.email != property.ownerEmail) return noPermissionError(id, res);
        propertyStorage.splice(indexP,1); //pop() and delete weren't useful in this case 
                                          //pop() removed only last element in the array
                                          //delete removed the element at the intended loc, but leaves traces in the array
        operationSucess(res);
      }catch ( error){
        res.status(500).send({'status': 'error', 'error':`Something went wrong ${error}`});
      }
    }else{
      noPropertyError(id, res);
    }
   
};


// Display all properties
const getAllProperty = (req, res) => {
  return res.status(200).send({
        'status': 'success',
        'data': propertyStorage
  });
};

// Display all properties of specified types ie Properties with type= Room, House, Aprtment, Camp etc
const getAllSpecificTypesProperty = async (req, res) => {
	const rawType = req.query.type; // BLOCKERS, escape cases ex ROOM=Room=room are same
  const type =rawType.toLowerCase(); // Above blocker resolved 14/09/2019
  try {
    const properties = await propertyStorage.filter( properties => properties.type === type);
    if(properties.length ===0) return res.status(404).json({'status':'error', 'error': `Properties with type ${type} Not Found`});
    return res.status(200).json({
    'status': 'success',
    'data': properties
    });
  }catch (error){
    return res.status(500).send({'status': 'error', 'error': error});
  }
};

// View details of specified property
const viewPropertyDetails = async (req, res) =>{
	const id = req.params.propertyId;
  try{
    const property = await propertyStorage.filter( property => property.id ===id);
    if(property.length === 0) return noPropertyError(id, res);
    res.status(200).json({
      'status': 'success',
      'data': property[0] //index 0 indicates the first element to be found, so it is at index 0
    });
  }catch (error){
     res.status(500).json({
      'status': 'error',
      'error': `Error occurring ${error}`
    })
  }

}

export default {postProperty, updateProperty, markSold, deleteProperty, getAllProperty, getAllSpecificTypesProperty, viewPropertyDetails};

*/