const jwt=require('jsonwebtoken');

const ensureAuthenticated = (req,res,next) =>{
    const auth = req.headers['authorization'];
    if(!auth){
        return res.status(403).json({message: "Unauthorized, jwt token is required"});
    }
    try{
        // Extract token from "Bearer <token>" format
        const token = auth.startsWith('Bearer ') ? auth.slice(7) : auth;
        const jwtSecret = process.env.JWT_SECRET || "secret123";
        const decoded = jwt.verify(token, jwtSecret);
        req.user = decoded;
        next();
    }catch(err){
        return res.status(403).json({message: "Unauthorized, jwt token wrong or expired"});
    }
}

module.exports = {
    ensureAuthenticated,
    verifyToken: ensureAuthenticated
};
