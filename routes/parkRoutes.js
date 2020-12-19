const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { parkSchema } = require('../schemas.js');
const {isLoggedIn, isParkAuthor} = require('../utils/auth');
const ExpressError = require('../utils/ExpressError');
const parks = require('../controllers/parks');
const multer  = require('multer');
const {storage} = require('../cloudinary'); // does not have to specify index.js because node automatically looks for it
const upload = multer({ storage });

const validatePark = (req, res, next) => {
    const {error} = parkSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join()
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

router.route('/')
     .get(catchAsync(parks.index))
     .post(isLoggedIn, upload.array('image'), validatePark, catchAsync(parks.postPark))
    
/* req.file (from multer middleware)
    {
        fieldname: 'image',
        originalname: 'pingpong.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        destination: 'uploads/',
        filename: '418ed959c5d4a10c2c87cc086d2bdb01',
        path: 'uploads\\418ed959c5d4a10c2c87cc086d2bdb01',
        size: 27094
      } */
      

router.get('/new', isLoggedIn, parks.newParkForm);

router.route('/:id')
      .get(catchAsync(parks.showPark))
      .put(isLoggedIn, isParkAuthor, upload.array('image'), validatePark, catchAsync(parks.editPark))
      .delete(isParkAuthor, catchAsync(parks.deletePark));
    
router.get('/:id/edit', isLoggedIn, catchAsync(parks.editParkForm));

module.exports = router;