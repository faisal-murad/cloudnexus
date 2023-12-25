import mongoose from "mongoose";

//DB Connection
export const connect = () => {
    mongoose.set("strictQuery", true);
    mongoose.connect(process.env.USER_DB_URL, {
        useNewUrlParser: true,
    })
    .then(() => {
        console.log("Database is Connected");
    })
    .catch((err) => {
        console.log(`Database Connection error: ${err}`);
    });
};