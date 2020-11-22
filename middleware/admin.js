module.exports = function(req,res,next){
    if(!req.user.isAdmin) return res.header(403).send({message:"Access denied"});//403 forbidden

    next();
}