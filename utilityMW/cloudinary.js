const cloudinary= require('cloudinary').v2;
// const dotenv = require("dotenv")
          
// cloudinary.config({ 
//   cloud_name: process.env.cloud_name, 
//   api_key: process.env.api_key, 
//   api_secret: process.env.api_secret
// });

// import {v2 as cloudinary} from 'cloudinary';
          
cloudinary.config({ 
  cloud_name: 'dqu8amxqp', 
  api_key: '196378786982543', 
  api_secret: 'H_GqRCRHExsFHy2AMlpL-6I59i8' 
});

module.exports = cloudinary