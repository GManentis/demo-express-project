const jwt = require('jsonwebtoken');
const config = require('config');

function auth(req,res,next){
    const token = req.header('x-auth-token');
    if(!token) return res.status(401).send({message: "No token is passed"});
    
    try{
        const decoded = jwt.verify(token,config.get('jwtPrivateKey'));
        req.user = decoded;
        next();
    }catch(ex){
        res.header(400).send({message: "Invalid Token"});
    }
   
}

module.exports = auth;