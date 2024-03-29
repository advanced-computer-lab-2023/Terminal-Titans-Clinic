import jwt from 'jsonwebtoken';
import User from '../Models/userModel.js';

const protect=(async(req,res,next)=>{

    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try{
            token=req.headers.authorization.split(' ')[1];
            const decoded=jwt.verify(token,process.env.JWT_SECRET);
            req.user=await User.findById(decoded.id).select('-ID -License -Degree -HealthHistory -password');
            next();
        }catch(error){
            console.error(error);
           return res.status(401).json({message:"Not Authorized" , success: false});
        }
    }
    if(!token){
        return res.status(401).json({message:"Not Authorized" , success: false});
    }
});

export default protect;
