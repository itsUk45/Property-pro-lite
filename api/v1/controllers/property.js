import uuidv1 from 'uuid/v1';
import multer from 'multer';
import JWT from 'jsonwebtoken';
import {propertyStorage, Property} from '../models/Property';
import {operationSucess, noPropertyError, noPermissionError, serverError} from '../helpers/propertyHelper';
//import {checkTokens, decodedToken} from '../middleware/auth';
import {verifyUser} from '../helpers/jwtAuthHelper';
import Joi from 'joi';




/*
...................................................
IMPLEMENTATION USING PERSISTENT STORAGE IE POSTGRESQL DATABASE
...............................................................
*/

// No property error, identifiers for either id or type
const idIdentifier = 'id';
const typeIdentifier='type';

//post property
const postProperty = async (req, res) => {
  const id = uuidv1();
  const {token, status, type, state, city, address, price} = req.body; // improvements, check if input is empty
  try{
    console.log('happening here only '+ (type===''));
    // verify user with the tokens sent
    var decoded = verifyUser(token, res);
    if(decoded===undefined) return res.status(404).json({'status': 'error', 'error': 'no token for the user'});
    // create property
    const created_on = new Date();
    const image_url = req.file.path;
    const email = decoded.email;
    // we convert all type field value to lower case because we will use to easy user searching for specific property
    // that means any search type will be converted 
    const newProperty = new Property(id, status.toLowerCase(), type.toLowerCase(), state, city, address, price, created_on, image_url, email);
     await newProperty.createProperty();
     return res.status(201).json({'status': 'success', 'data':{ id, status, type, state, city, address, price, created_on,image_url, email}});
  }catch(error){
   serverError(error, res);
  }

};


// update some selected fields with new data
const updateProperty = async (req, res) => {
  const id = uuidv1();
  const {token, status, type, state, city, address, price} = req.body;
  try{
     // get content of token
    const {propertyId} =req.params;
    const {token, type, price}  = req.body.data;
    const decoded = verifyUser(token, res);
    if(decoded===undefined) return noPermissionError(propertyId, res);
    const property = new Property();
    const dataEmail = await property.getPropertyDetails(propertyId); //used to get property with the given id
    // check if property  with given id is available
    if(dataEmail.rows.length===0) return noPropertyError(propertyId, res, idIdentifier);
    // compare emails(logged in user email , and property creation email) to ensure user delete only their property
    if(decoded.email != dataEmail.rows[0].owner_email) return noPermissionError(propertyId, res);
    // can update property attributes
    await property.updateProperty(type, price, propertyId);
    operationSucess(res);

  }catch(error){
   serverError(error, res);
  }

};

// change property status from available to sold
const markSold = async (req, res) => {
  try{
    // get content of token
    const {propertyId} =req.params;
    const {token}  = req.body.data;
    const decoded = verifyUser(token, res);
    if(decoded===undefined) return noPermissionError(propertyId, res);
    const property = new Property();
    const dataEmail = await property.getPropertyDetails(propertyId);
    // check if property  with given id is available
    if(dataEmail.rows.length===0) return noPropertyError(propertyId, res, idIdentifier);
    // compare emails(logged in user email , and property creation email) to ensure user delete only their property
    if(decoded.email != dataEmail.rows[0].owner_email) return noPermissionError(propertyId, res);
    // can update status to SOLD
    if(dataEmail.rows[0].status==='sold') return res.status(400).json({'status': 'error', 'error': 'Property status is already in SOLD'});
    const status = 'sold';
    await property.changeToSold(status, propertyId);
    operationSucess(res);
  
  }catch(error){
   serverError(error, res);
  }

};

// delete property of a given id
const deleteProperty = async (req, res) => {
  const {propertyId} = req.params;
  const {token} = req.body.data;
  try{
    // get content of token
    const decoded = verifyUser(token, res);
    if(decoded===undefined) return noPermissionError(propertyId, res);
    const property = new Property();
    const dataEmail = await property.getPropertyDetails(propertyId);
    // check if property  with given id is available
    if(dataEmail.rows.length===0) return noPropertyError(propertyId, res, idIdentifier);
    // compare emails(logged in user email , and property creation email) to ensure user delete only their property
    if(decoded.email != dataEmail.rows[0].owner_email) return noPermissionError(propertyId, res);
    // can delete property ie user own this property
    await property.deleteProperty(propertyId);
    operationSucess(res);
  }catch(error){
   serverError(error, res);
  }

};

// get all property, no auth needed
const getAllProperty =  async (req, res) => {
  try{
    const allProperty = new Property();
    const data = await allProperty.getAllProperty();
    if(data.rows.length===0) return res.status(404).json({'status':'error', 'error': 'No property found'});
    res.status(200).json({'status': 'success', data: data.rows});
  }catch(error){
   serverError(error, res);
  }

};

// get all property of the same type, no auth token needed. this operation is public
const getAllSpecificTypesProperty = async (req, res) => {
  const {type} = req.query;
  try{
    const allSameType = new Property();
    const data = await allSameType.getPropertyByType(type.toLowerCase());
    if(data.rows.length===0) return noPropertyError(type, res, typeIdentifier);
    res.status(200).json({ 'status': 'success', 'data': data.rows});
  }catch(error){
    serverError(error, res);
  }

};

// view property details
const viewPropertyDetails = async (req, res) => {
  // get id from the request params
  const {propertyId} = req.params;
  try{
    const viewDetails = new Property();
    const data = await viewDetails.getPropertyDetails(propertyId);
    if(data.rows.length===0) return noPropertyError(propertyId, res, idIdentifier);
    res.status(200).json({ 'status': 'success', 'data': data.rows});

  }catch(error){
   serverError(error, res);
  }

};

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