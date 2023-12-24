import mongoose, {Schema} from 'mongoose'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const userSchema = new Schema({
    userName:{
        type: String,
        require: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    email:{
        type: String,
        require: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    fullName:{
        type: String,
        require: true,
        trim: true,
        index: true,
    },
    avatar:{
        type: String, //cloudinary url storing
        require: true,
    },
    coverImage:{
        type: String,
        //require: true,
    },
    watchHistory:[ 
        {
        type: Schema.Types.ObjectId,
        ref:"Video",
        }
    ],
    password:{
        type: String,
        require: [true, "password is required"]
    },
    refreshToken:{
        type: String,
    }
},{timestamps: true})


//password encription logic before saving in db
userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next(); 

    this.password =  bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function (password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function (){
    return jwt.sign(
    {
        _id: this._id,
        userName: this.userName,
        fullName: this.fullName,
        email: this.email,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIARY
    }
    )
}
userSchema.methods.generateRefreshToken = function (){
    return jwt.sign(
        {
            _id: this._id,    
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIARY
        }
        )
}



export const User = mongoose.model("User",userSchema)