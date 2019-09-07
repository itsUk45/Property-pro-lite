//user verification helper function
const verifyUser = (tokens, res) => {
  try{
    const decoded = JWT.verify(tokens, "secretKeys");
    return decoded;
  }catch (error){
    res.status(401).send( {'status': 'error', 'error':error});
  }
};


export default verifyUser;