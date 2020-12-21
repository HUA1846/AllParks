const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// specify my cloudinary credential (from .env)
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
  });

// create a new instance of Cloudinary Storage and pass it to multer instead of local storage
  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: 'SocalParks',
      allowedFormats: ['jpeg', 'jpg', 'png']
    },
  });
  module.exports = {
      cloudinary,
      storage
  }
   
