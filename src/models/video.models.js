import mongoose,{Schema} from 'mongoose'
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2'

const videoSchema = new Schema({
    videoFile:{
        type:String,
        require: true,
    },
    thumbnail:{
        type: String,
        require: true,
    },
    owner:{
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    title:{
        type: String,
        require: true,
        unique: true,
    },
    description:{
        type: String,
        require: true,
        unique: true,
    },
    duration:{
        type: Number,
        require: true,
        unique: true,
    },
    views:{
        type: Number,
        default: 0,
    },
    isPublished:{
        type: Boolean,
        default: true,
        require: true,
    },
},{timestamps: true})

mongoose.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model("Video",videoSchema)