const User= require('../models/userModel')
const multer= require('multer');
const sharp= require('sharp');

const storage= multer.memoryStorage();
const multerFilter= (req, file, cb)=>{
    if(file.mimetype.startsWith('image')){
        cb(null, true);
    }
    else{
        cb(res.status(400).json({status:'fail',message:'Not an image'}), false);
    }
}
const upload= multer({
    storage:storage,
    fileFilter:multerFilter,
}

)

exports.uploadUserImage= upload.single('photo');

exports.resizeUserPhoto= async(req, res, next)=>{
    if(!req.file)return next();
     
    req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

    next();
}


const filterObj= (obj, ...allowedField)=>{
    const newObj={};
    Object.keys(obj).forEach(el =>{
        if(allowedField.includes(el)) newObj[el]=obj[el]
    })
    return newObj;
}

exports.getUser= async (req, res)=>{
    const user= await User.findById(req.user.id);
    res.status(200).json({
        status:'success',
        data:{
            user
        }
    });
}



exports.updateMe = async (req, res)=>{
    const FilteredBody= filterObj(req.body, 'name', 'email','profession', 'dob', 'about', 'title');

    if(req.body.password || req.body.passwordConfirm){
        return res.status(400).json({
            status:'fail',
        });
    }

    if (req.file) {FilteredBody.photo = req.file.filename;}
    const user= await User.findByIdAndUpdate(req.user.id, FilteredBody,{
        new:true,
        runValidators:true
    });

    res.status(200).json({
        status:'success',
        data:{
            user
        }
    });
}

exports.deleteUser= async(req, res)=>{
    const user= await User.findByIdAndUpdate(req.user.id, {active:false});

    res.status(204).json({
        status: 'success',
        data: null
      });
   
}