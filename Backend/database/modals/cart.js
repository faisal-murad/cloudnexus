import mongoose from "mongoose";
const { Schema } = mongoose;

const cartSchema = new Schema({
  user_id: {
    type: String,
    unique: true, // Ensure user_id is unique 
  },
  
});

// Explicitly set user_id as the primary key
cartSchema.set("_id", "user_id");

export default mongoose.model('Cart', cartSchema);
