const express= require('express');
const { route } = require('../app');
const authController= require('../controllers/authController');
const userController= require('../controllers/userController')
const router= express.Router();

router.post('/register',authController.register);
router.post('/login', authController.login);

router.use(authController.protect);
router.patch('/updateMyPassword', authController.updatePassword);
router.get('/me', userController.getUser);
router.patch('/updateMe',
userController.uploadUserImage, 
userController.resizeUserPhoto, 
userController.updateMe);
router.delete('/deleteMe', userController.deleteUser);

module.exports= router;


