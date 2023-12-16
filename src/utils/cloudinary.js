import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs'


cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});


const cloudinaryFileUpload = async(localFilePath) => {
    try {
        //if local file does not found
        if(!localFilePath) return null;
        //upload on cloudinary
        const responce = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto',
        })
        //after file has been succesfully uploaded
        console.log("file has been successfully uploaded on cloudinary",responce.url);
        //fs.unlinkSync(localFilePath);
        return responce;
        

        
    } catch (error) {
        //when the upload operation is failed remove the locally saved file 
        //so save space and remove clutters
        fs.unlinkSync(localFilePath);
        return null;
    }
}


export {cloudinaryFileUpload};
