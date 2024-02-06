import mongoose from "mongoose";

const connectDB= async()=>{
     try {
        const connection=await mongoose.connect(process.env.MONGO_URL);
        console.log(`connected to MongoDB ${connection.connection.host}`)
     } catch (error) {
        console.log("error in MongoDB",error)
     }
}
export default connectDB;