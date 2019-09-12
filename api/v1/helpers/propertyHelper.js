
// Operation on property successful message
const operationSucess = (res) => {
  return res.status(200).json({
    'status':'success',
    'message': 'Operation successful'
    });
};

//NO Property found Error message, 404 not found
const noPropertyError = (propertyId, res) => {
  return res.status(404).json({
        'status':'error',
        'error': `Property with id ${propertyId} Not Found`
      });
};

//NO Permission Error message ie 401 unauthorized, 400 bad request(syntax),
// 403 fobidden(legal request but server refusing to respond), 409 conflicting request
const noPermissionError = (propertyID, res) => {
   return res.status(401).json({
  	'status': 'error',
  	'error': `Operation denied, You don't own the Property with id ${propertyID}`
  });
};

export {operationSucess, noPropertyError, noPermissionError};