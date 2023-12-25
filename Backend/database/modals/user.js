import mongoose from "mongoose";
 const { Schema } = mongoose;
 const userSchema = new Schema({
    name:{
        type: String,
        required: true,},
    firstname:{
        type:String,
    },
    lastName:{
        type:String,
    },
    gender:{
        type:String,
    }, 
    dateOfBirth:{
        type:Date,
    },
    age:{
        type:String,
    }, 
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type :String ,
        required: true,
    },  
    resetToken: String,
    resetTokenExpiration: Date,
 });

 export default mongoose.model('User', userSchema);