import multer from 'multer';
import {sendResponse} from '../lib/helper/send_response.js'
const storage = multer.diskStorage({});

const fileFilter = (req, file, cb) => {
  // console.log(req);
  // console.log(file);
  
  if (!file.originalname || file.originalname === 'undefined') {
    return cb(null, false);
  }
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    // This error is caught by the wrapper below
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Internal multer instance
const uploadConfig = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, //5mb limit
});

// Proper Way: The Middleware Wrapper
export const uploadImages = (req, res, next) => {
  const upload = uploadConfig.fields([
    {name:"banner_image",maxCount:1},
    {name:"detail_images",maxCount:4},
  ]) 
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // if (err.code === "LIMIT_UNEXPECTED_FILE" && err.field === "detail_images") {
      //   return sendResponse(res, 400, true, { general: `Upload error: ${err.message}, Max 4 detailImages allowed` }, null)
        
      // }
      // else if (err.code === "LIMIT_UNEXPECTED_FILE" && err.field === "banner_image") {
      //   return sendResponse(res, 400, true, { general: `Upload error: ${err.message}, Max 1 bannerImage allowed` }, null)
        
      // }
      // else if (err.code === "LIMIT_FILE_SIZE") {
      //   // console.log(err);
      //   return sendResponse(res, 400, true, { general: `Upload error: ${err.message}, Max file size is 5MB` }, null)
      // } else {
      //   // console.log(err);
      
      //   // Handle Multer-specific errors (like file size limit)
      //   return sendResponse(res, 400, true, { general: `Upload error: ${err.message}` }, null)
      // }
      if (err.code === "LIMIT_UNEXPECTED_FILE") {
        return sendResponse(res, 400, true, { general: "Upload error: Max 1 banner_image and max 4 detail_images allowed" }, null);
      }
      if (err.code === "LIMIT_FILE_SIZE") {
        return sendResponse(res, 400, true, { general: "Upload error: Max file size is 5MB" }, null);
      }
      return sendResponse(res, 400, true, { general: `Multer error: ${err.message}` }, null);
    } else if (err) {
      // console.log(err);
      
      // Handle your custom "Only image files" error
      return sendResponse(res,400,true,{general:err.message},null)
    }
    const files = req.files
    if (!files || !files.banner_image || files.banner_image.length === 0){
            return sendResponse(res, 400, true, { bannerImage: 'Banner image is required' }, null);
    }
    if (!files.detail_images || files.detail_images.length < 4) {
                return sendResponse(res, 400, true, { detailImages: 'Exactly 4 detail images are required' }, null);
    }

    // Everything is fine, move to the next controller
    next();
  });
};