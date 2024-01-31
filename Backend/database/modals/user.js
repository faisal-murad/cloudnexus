import mongoose from "mongoose";
const { Schema } = mongoose;
const userSchema = new Schema({
    googleId:{
        type: String,
        unique: true,
    },
    firstname: {
        type: String,
    },
    lastname: {
        type: String,
    },
    gender: {
        type: String,
    },
    dateOfBirth: {
        type: Date,
    },
    picture: {
        type: String, 
      },
    age: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    // password: {
    //     type: String,
    //     required: true,
    // }, 
    SID:{
        type: Number,
        default: 101,
    }, 
    servers: [{ type: Schema.Types.ObjectId, ref: 'Server' }],
    resetToken: String,
    resetTokenExpiration: Date,
});

export default mongoose.model('User', userSchema);