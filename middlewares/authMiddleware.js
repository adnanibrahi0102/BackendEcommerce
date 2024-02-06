import JWT from 'jsonwebtoken';
import UserModel from '../models/UserModel.js';
//protected routes token based || middleware
export const requireSignIn= async (req,res,next)=>{
        
        try {
            const decode=JWT.verify(req.headers.authorization,process.env.JWT_SECRET_KEY); 
            req.user=decode
            next();
        } catch (error) {
            console.log(error)
        }
}

//protected middleware for admin

export const isAdmin=async(req,res,next)=>{
    try {
        const user=await UserModel.findById(req.user._id);
        if(user.role!==1){
          return res.status(401).send({
            success:false,
            message:"unauthorized access"
          })
        }else{
            next()
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:"error in Isadmin"
        })
    }
}