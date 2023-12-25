import mongoose from "mongoose";
const { Schema } = mongoose;

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  details: {
    type: String,
  },
  category:{
    type:String,
    required:true,
  }
  ,
  photo: [
    {
      type: String,
      required: true,
    },
  ],
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
