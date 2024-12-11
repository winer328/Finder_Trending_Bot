import mongoose from "mongoose";
import { MONGO_URL } from "../constant";

//mongo
export const createMongoConnection = (callback: Function) => {
    mongoose.connect(MONGO_URL)
        .then((connection) => {
            if (connection) {
                console.log(' ✅  Database Connected');
                callback();
            } else {
                console.log(' ❌  Mongodb Connection Error');
            }
        })
        .catch(() => {
            console.log(' ❌  Mongodb Connection Error');
        })
}