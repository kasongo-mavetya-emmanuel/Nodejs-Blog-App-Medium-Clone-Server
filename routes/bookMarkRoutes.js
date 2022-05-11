const express= require('express')
const bookMarkController= require('../controllers/bookMarkController')
const autController= require('../controllers/authController')

const router= express.Router()

router.use(autController.protect)
router.get('/', bookMarkController.getAllBookMarks );
router.post('/:id', bookMarkController.createBookMark );


module.exports= router;