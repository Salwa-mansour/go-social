
const cloudinary = require('cloudinary').v2;
import catchAsync from '../utils/catchAsyncError.js'; // 💡 Import your new async wrapper


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
export const  generateUploadSignture =catchAsync(async (req, res, next) => {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000);
    
    // Define parameters for the upload. 
    // Handing Cloudinary a folder name keeps your storage organized.
    const paramsToSign = {
      timestamp: timestamp,
      folder: 'mini-social-avatars', 
    };

    // Generate the signature using your API Secret hidden on the server
    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET
    );

    // Send the signature, timestamp, and your public API Key back to React
    res.json({
      signature,
      timestamp,
      apiKey: process.env.CLOUDINARY_API_KEY,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate upload signature' });
  }
})