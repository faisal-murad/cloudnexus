import mongoose from "mongoose";
const { Schema } = mongoose;
const userSchema = new Schema({
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
    age: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    }, 
    SID:{
        type: Number,
        default: 101,
    }, 
    servers: [{ type: Schema.Types.ObjectId, ref: 'Server' }],
    resetToken: String,
    resetTokenExpiration: Date,
});

export default mongoose.model('User', userSchema);