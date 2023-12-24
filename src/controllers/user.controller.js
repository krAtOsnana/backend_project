import { ApiError } from '../utils/ApiError.js';
import { asyncHandler} from '../utils/asyncHandler.js'
import {User} from "../models/user.models.js"
import {cloudinaryFileUpload} from "../utils/cloudinary.js"
import { ApiResponse } from '../utils/apiResponce.js';


//creating a fun. for generating acc. and ref. token bcoz we need to create tokens soo many times
const generateAccessAndRefreshTokens = async (userID) => {
    try {
        const user = await User.findById(userID)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        //adding newely generated ref. token in our DB
        user.refreshToken = refreshToken
        await user.save({validateBeforeSave: false})

        return {accessToken, refreshToken};

    } catch (error) {
        throw new ApiError(500,"something went wrong while generating tokens")
    }
}


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

const loginUser = asyncHandler( async (req, res)=> {
    //take mail, userName, password from i/p
    //checking for any empty field
    //checking format of email( email: kush@mail.com )and userName
    //checking,user of that userName and email is present in our DB or not
    //checking password
    //generating refresh and session token
    //sending tokens in cookies
    //logging in user
    //sending res
    

    //taking data from req.body
    const {email, userName, password} = req.body;

    //checking, atleast user give username or email
    if(!userName  ||  !email ){
        new ApiError(400, "plz enter UserName and email")
    }
    //checking if user enter password or not
    if(!password){
        throw new ApiError(400,"plz enter vaalid password")
    }
    //checking if user of that userName or email is present in our Db or not
    const user = await User.findOne({
        $or: [{userName}, {email}]
    })
    //if not, then ask user to create an account first
    if(!user){
        throw new ApiError(404, "user does not exist-> plz create an Account")
    }
    //if user of that email or username if found, then check for valid password
    const isPasswordValid = await user.isPasswordCorrect(password)

    //if password is wrong
    if(!isPasswordValid){
        throw new ApiError(401, "wrong password:: plz enter valid password")
    }

    //if password is correct, then generate access and ref. tokens
    const {accessToken, refreshToken} = await
     generateAccessAndRefreshTokens(user._id);

    //this loggedInUser have all the fields acccept password and refresh token
    const loggedInUser = await User.findById(user._id).
    select("-password -refreshToken")

    //sending tokens in cookies
    //by default coockie is modifiable by any (server,frontend)
    //by making httpOnly and secure this cookie is modifiable by only from server
    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                user: loginUser, accessToken, refreshToken
            },
            "User logged in successfully"
        )
        
    )



})

const logoutUser = asyncHandler(async (req, res) => {


})

export {
    registerUser,
    loginUser,
};