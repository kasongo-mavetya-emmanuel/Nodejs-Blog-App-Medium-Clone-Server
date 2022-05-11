const User= require('../models/userModel');
const {Promisify, promisify}= require('util');
const jwt= require('jsonwebtoken');


const signToken= id =>{
    return jwt.sign({id}, process.env.JWT_SECRET,{
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

const createSendToken=(user, statusCode, res)=>{
  const token = signToken(user._id);
  //remove password from client
  user.password=undefined; 

  res.status(statusCode).json({
    status:'success',
    token,
    data:{
      user
    }
  })

}

exports.register= async(req, res, next)=>{

    try{
  const newUser= await User.create({
      name: req.body.name,
      email:req.body.email,
      password: req.body.password,
      passwordConfirm:req.body.passwordConfirm,
  },);
  createSendToken(newUser, 201, res);
}catch(err){
  console.log(err)
   return res.status(400).json({
      status:"fail",
      message:err
    });
};

};

//LOGIN
exports.login= async (req, res, next)=>{
  const {email, password}= req.body;
  //check if email and password arent empty
  if(!email || !password){
     return res.status(404).json({
       status:'fail',
       message:'email password required',
     });
    };
  //check if user exist 
  const user= await User.findOne({email}).select("+password");
  if(!user)
    return res.status(404).json({
      status:'fail',
      message:'user does not exist',
    })
  //check password is correct
  if(!user||!(await user.correctPassword(password, user.password))){
    return res.status(401).json({
      status:'fail',
      message:'incorrect password',
    });
  }

    //Send token to client
    createSendToken(user, 200,res);
  
}

exports.protect=async(req, res, next)=>{
   let token;
   if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {     
    token = req.headers.authorization.split(' ')[1];
     }

   if(!token){
     return res.status(404).json({
       status: "fail",
       message: "Please login to get access",
     })
    };

     const decoded =await promisify(jwt.verify)(token, process.env.JWT_SECRET);

     const currentuser= await User.findById(decoded.id);
     if(!currentuser){
      return res.status(404).json({
        status: "fail",
        message: "Please login to get access",
      });
     }

     if (currentuser.changedPasswordAfter(decoded.iat)) {
      
        return res.status(400).json({
          status: "fail",
          message: "Please login",
        });
    
    }

     req.user= currentuser;

     next();

   }



   

exports.updatePassword= async(req, res, next)=>{
  //get user from collection //TODO 

  const user= await User.findById(req.user.id).select('+password');
  //check if the current password is correct
  if(!(await user.correctPassword(req.body.passwordCurrent, user.password))){
    return res.status(401).json({
      status:'fail',
      message:'incorrect password',
    });
  }
  //update password
  user.password= req.body.password;
  user.passwordConfirm=req.body.passwordConfirm;

  await user.save();

  //login user
  createSendToken(user, 200, res);

}
