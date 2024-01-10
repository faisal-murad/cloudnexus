import mongoose from "mongoose";
import { Schema } from "mongoose";

const downTimeTroubleSchema = new Schema({
    duration: {
        type: Number,
        required: true,
    },
    timeStamp: {
        type: Date,
    }
})

export default mongoose.model('downTimeTrouble', downTimeTroubleSchema);