import mongoose from "mongoose";
const { Schema } = mongoose;
const categorySchema = new Schema
    ({
        name:{
           type: String,
           required: true,
        }, 
        photo: {
            type: String,
            require: true
        },
    },
        { timestamps: true }
    );
export default mongoose.model('Category', categorySchema);