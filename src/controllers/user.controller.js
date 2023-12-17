import { ApiError } from '../utils/ApiError.js';
import { asyncHandler} from '../utils/asyncHandler.js'
import {User} from "../models/user.models.js"
import {cloudinaryFileUpload} from "../utils/cloudinary.js"
import { ApiResponse } from '../utils/apiResponce.js';

const registerUser = asyncHandler( async (req, res) => {
        //get user detail from front end
        //validation -non empty feild
        //check if user is already exist or not
        //check for images ,check for avatar
        //upload them on clodinary, avatar
        //creatr user object, create user entry in DB
        //remove password and refrsh token from response
        //check for user creation
        //return responce

    //destructuring all the necessary credentials of user provided in user model
    //which is required for user registering...    
    const {userName, fullName, email, password} = req.body
    console.log("req.body: ",req.body);
   // console.log(`userName: ${userName}, \nfullName: ${fullName}, \nemail: ${email}`);


   //checking if all fields are present or not. if not then throw error
    if(
        [userName, fullName, email, password].some((field) => 
        field?.trim() === ""
        )
    ){
        throw new ApiError(400,"All fields are required")
    }


    //checking in mongoDB if user is already present or not 
    //by matching/checking userName or email
    const existingUser =await User.findOne({
        $or : [{userName} , {email}]
    })
    if(existingUser){
        throw new ApiError(409,"user already have an account/already registered")
    }


    //handeling images and avatar

    //const avatarLocalPath = req.files?.avatar[0]?.path;
    let avatarLocalPath ;
    if(req.files && Array.isArray(req.files.avatar) 
    && req.files.avatar.length > 0){
        avatarLocalPath = req.files.avatar[0].path ;
    }

      //checking for avatar, that avatar must be present
      
    
   // const coverImageLocalPath = req.files?.coverImage[0]?.path;
    //checking for cover image
    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
        coverImageLocalPath = req.files.coverImage[0].path ;
    }

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar image is required")
    }
   

    //upload avatar and other images to cloudinary which is preesent in multer
    //multer ->(localStorage:public/temp)
    const avatar = await cloudinaryFileUpload(avatarLocalPath);
    const coverImage = await cloudinaryFileUpload(coverImageLocalPath);

    //checking whethwe avatar is properly uploaded or not

    if(!avatar ){
        throw new ApiError( 400 ,"Avatar is not properly uploaded on Cloudinary")
    }

    //now create an Object and enter it on daraBase
    //user is the only thing which is talking to our DB
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        userName: userName.toLowerCase()
    })


    //after user created remove Password and RefreshToken from responce
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if(!createdUser){
        throw new ApiError(500, "user is not created something went wrong ")
    }

    //returning responce if user is registered/creared successfully
    return res.status(201).json(
        new ApiResponse(201, createdUser, "user has been succesfully registered/created")
    )
})

export {registerUser};