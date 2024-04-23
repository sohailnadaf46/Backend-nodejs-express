//read the documentation to understandt on cloudinary its easy  

import {v2 as cloudinary} from "cloudinary";
import fs from "fs" // file system for node js
          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET  
});


const uploadOnCloudinary = async (localFilePath) => {
  try {
    if(!localFilePath) return null
    //upload files on cloudinary
     const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type:"auto"
    })
    //file has been uploaded successfully
    console.log("the file has been uploaded successfully", response.url);
    fs.unlinkSync(localFilePath)
    return response
    
  } catch (error) {
    fs.unlink(localFilePath)//remove the locally saved temporary file as the upload operation got failed
    return null
  }
}

export { uploadOnCloudinary }