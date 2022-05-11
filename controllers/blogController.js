const Blog= require('../models/blogModel');
const multer= require('multer');
const sharp= require('sharp');

const storage= multer.memoryStorage();

const multerFilter= (req, file, cb)=>{
   // const ext = file.mimetype.split('/')[1].toLowerCase();
   console.log(`dkdgowwoo ${file.mimetype}`);
   if(file.mimetype.startsWith('image')){
       cb(null, true);
   }
   else{
       cb(new Error('Not an image'), false);
   }
}

const upload= multer({
    storage:storage,
    fileFilter:multerFilter
});


exports.uploadImage= upload.single('image');

exports.resizeImage= async(req, res, next)=>{
    if(!req.file) return next();

    req.file.filename= `blog-${req.user.id}-${req.params.id}-${Date.now()}.jpeg`;

    await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/blogs/${req.file.filename}`);

    next();
}

const filterObj= (obj, ...allowedField)=>{
    const newObj={};
    Object.keys(obj).forEach(el =>{
        if(allowedField.includes(el)) newObj[el]=obj[el]
    })
    return newObj;
}


exports.updateBlog = async (req, res)=>{
    const FilteredBody= filterObj(req.body, 'content', 'published');

    

    if(req.body.comments || req.body.likes ){
        return res.status(400).json({
            status:'fail',
        });
    }

    if(req.body.published===true) {FilteredBody.publishedAt = new Date().toUTCString()} ;
    console.log(req.body.published);
    console.log(FilteredBody);

    const blog= await Blog.findOneAndUpdate({_id:req.params.id, user: req.user.id}, FilteredBody,{
        new:true,
        runValidators:true
    });
    if(req.file){
        res.status(200).json({
            status:'success',
            data:{
                filename: req.file.filename,
            }
        });
    }

    else{
        res.status(200).json({
            status:'success',
            data:{
                blog
            }
        });
    }
    
}

exports.setBlogUserId = (req, res, next) => {
    // Allow nested routes
    if (!req.body.user) {
        req.body.user = req.user.id;

        console.log(req.body.user);

    }
    next();
  };


exports.createBlog= async(req, res)=>{
    const blog= await Blog.create({
        content: req.body.content,
        user:req.body.user
    });
   
    res.status(200).json({
        status:'success',
        data:{
            blog
        }
        
    });
}

exports.getBlog= async(req, res)=>{
    const blog=await  Blog.findById(req.params.id);

    res.status(200).json({
       status:'success',
       data:{
           blog
       }
    })
}

exports.getAllOthersBlogs= async(req, res)=>{
    const blogs= await Blog.find({user: {$ne: req.user.id}, published: true})
    .populate({path:'user', select:'name photo'});

    if(blogs){
        res.status(200).json({
            status:'success',
            data:{
                blogs
            }
        })
    }
}


exports.getAllMyBlogs= async(req, res)=>{
    const blogs= await Blog.find({user: req.user.id}).select('-user');

    if(blogs){
        res.status(200).json({
            status:'success',
            data:{
                blogs
            }
        })
    }
}


exports.deleteBlog= async(req, res)=>{
      await Blog.findOneAndDelete({_id: req.params.id, user: req.user.id}, {user: req.user.id});
     res.status(204).json({
     });

}


