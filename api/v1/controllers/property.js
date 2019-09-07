/*****************
BLOCKERS for tomorrow 03/09/2019
write try and catch in every async await promise function
findout how to resolve "cannot set headers after they are sent to the client ERRORR" 
This error can actually be resolve using the console for output, 
but my api specifications needs response to be send to the client browser not console 
******************/

//property contoller
import uuidv1 from 'uuid/v1';
import multer from 'multer';
import JWT from 'jsonwebtoken';
import {propertyStorage, Property} from '../models/Property';
import {operationSucess, noPropertyError, noPermissionError} from '../helpers/messageResponse';
// import {verifyUser} from '../helpers/verify';


//user verification helper function
const verifyUser = (tokens, res) => {
  try{
    const decoded = JWT.verify(tokens, "secretKeys");
    return decoded;
  }catch (error){
    res.status(401).send( {'status': 'error', 'error':error});
  }
};


// create new property
const postProperty = async (req, res, next) => {
  const id = uuidv1(); //generate a unique id based on the timestamp
	const {token,status, type, state, city, address, price} = req.body;
  try {
  const decoded = verifyUser(token, res); //verify user tokens
  // Create property if user is authenticated with JWT
  const propertyObj  = new Property(id, status,type, state, city, address, price, new Date(), req.file.path, decoded.email);
 
    const data = await propertyObj.createProperty();
    //property output to send as response as per the api specification
    const propertyOutput = {
      "status":'success',
        data
    }
    res.status(201).send(propertyOutput); // successfull created property 

  }catch(error){
    res.status(500).send({'status': 'error', 'error': error});
  }
  };


// update existing property
const updateProperty = async (req, res) => {
  const id = req.params.propertyId;
  const {token, address} = req.body.data;
  if(propertyStorage.length ===0) return noPropertyError(id, res);
  try {
    await propertyStorage.forEach( (elements, index, array) => {
      if(elements.id != id) return noPropertyError(id, res);
      //verifying user is the owner
      const decoded = verifyUser(token, res);
        if (decoded.email === elements.ownerEmail){
          // update address use case
          elements.address =address;
          res.status(200).send(propertyStorage[index]); //updated property
        }else {
          noPermissionError(id, res);
        }
      });

  }catch (error){
    res.status(500).send({'status': 'error', 'error': error});
  }

};

// Change property status from AVAILABLE to SOLD
const markSold = async (req, res) =>{
    const id = req.params.propertyId;
    const {token} = req.body.data;
    if (propertyStorage.length != 0){
      //check property to update
      try{
        await propertyStorage.forEach( (elements, index, array) => {
          if (elements.id != id) return noPropertyError(id, res);
          else {
            const decoded = verifyUser(token, res);
            if (decoded.email == elements.ownerEmail){
              // Continue to perform operation
              let status = elements.status;
              if(status === "Available"){ //TODO 04/09/19 escaping cases ie upper or lower shouldnt make a difference
              // mark status from available to sold
              elements.status = "Sold";
              operationSucess(res);
          }else{
            res.status(403).json({'status': 'error', 'error': 'Property already marked as sold'});
          }
            } else {
                //user is not verified ie no permission to update status
                noPermissionError(id, res);
            }
          }
          
        });

      }catch (error){
        res.status(500).send({'status': 'error', 'error': error});
      }
      

    }else{
      //no property available in the data store
      noPropertyError(id, res);
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
        await propertyStorage.forEach( (elements, index, array) => {
          if ( elements.id != id){
            noPropertyError(id, res);
          }else{

            if(elements.ownerEmail != decoded.email){
             noPermissionError(id, res); // send operation denied message
            }else{
              // delete property here
              // delete propertyStorage[index]; NOT efficient method as it leaves holes in array
              propertyStorage.pop(propertyStorage[index]);
              operationSucess(res); //send success message to user
            }
          }
        });
      }catch ( error){
        res.status(500).send({'status': 'error', 'error': error});
      }
    }else{
      noPropertyError(id, res);
    }
   
};


// Display all properties
const getAllProperty = (req, res) => {
  res.status(200).send({
        'status': 'success',
        'data': propertyStorage
  });
};

// Display all properties of specified types ie Properties with type= Room, House, Aprtment, Camp etc
const getAllSpecificTypesProperty = async (req, res) => {
	const type = req.query.type; // BLOCKERS, escape cases ex ROOM=Room=room are same
  try {
    const properties = await propertyStorage.filter( properties => properties.type === type);
  }catch (error){
    res.status(500).send({'status': 'error', 'error': error});
  }
  if(properties.length ===0) return res.status(404).json({'status':'error', 'error': `Properties with type ${type} Not Found`});
  res.status(200).json({
    'status': 'success',
    'data': properties
  });
};

// View details of specified property
const viewPropertyDetails = async (req, res) =>{
	const id = req.params.propertyId;
  try{
    const property = await propertyStorage.filter( property => property.id ===id);
  }catch (error){
    const properties = await propertyStorage.filter( properties => properties.type === type);
  }
  if(property.length === 0) noPropertyError(id, res);
  res.status(200).json({
    'status': 'success',
    'data': property[0] //index 0 indicates the first element to be found, so it is at index 0
  });
}

export default {postProperty, updateProperty, markSold, deleteProperty, getAllProperty, getAllSpecificTypesProperty, viewPropertyDetails};