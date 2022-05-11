const BookMark= require('../models/bookMarkModel');


// exports.setBlogUserId = (req, res, next) => {
//     // Allow nested routes
//     if (!req.body.user || !req.body.blog) {
//         {
//             req.body.user = req.user.id;
//             req.body.blog= req.params.id;
        
//         }

//     }
//     next();
//   };


exports.createBookMark=async (req, res)=>{

    try{
        const bookMark = await BookMark.create({
            user: req.user.id,
            blog: req.params.id
        })
      
        res.status(201).json({
            status:'success',
            message: 'BookMarked'
                
            
        })

    }catch(err){
        res.status(400).json({
            status:'fail',
            message: 'failed'
                      
        })

    }
  
}

exports.getAllBookMarks=async (req, res)=>{

    try{
        const bookMarks= await BookMark.find({user: req.user.id})
        .populate({path: 'blog'});
        res.status(200).json({
            status:'success',
            data:{
                bookMarks
            }    
        })

    }catch(err){
        res.status(400).json({
            status:'fail',
            message: 'failed'
                      
        })
    }

}


exports.deleteBook= async (req, res)=>{
   await BookMark.findOne({_id:req.param.id, user: req.user.id,});

   res.status(400).json({
    status:'success',           
})
}