const blogController= require('../controllers/blogController');
const authController= require('../controllers/authController')
const express=require('express');

const router= express.Router();

router.use(authController.protect);

router.route('/')
    .post(blogController.setBlogUserId,blogController.createBlog).get(blogController.getAllOthersBlogs)

router.get('/Myblogs', blogController.getAllMyBlogs);

router.route('/:id').get(blogController.getBlog)
     .patch(blogController.uploadImage,blogController.resizeImage, blogController.updateBlog)
     .delete(blogController.deleteBlog)


module.exports= router;