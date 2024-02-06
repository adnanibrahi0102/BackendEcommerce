import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoute.js";
import categoryRoute from './routes/categoryRoute.js'
import productRoute from './routes/productRoute.js';

dotenv.config();
//database config
connectDB();
const app = express();

//middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

//routes
app.use('/api/v1/auth',authRoutes);
app.use('/api/v1/category',categoryRoute)
app.use('/api/v1/products',productRoute)
app.get("/", (req, res) => {
  res.send("<h1>welcome to ecommerce MERN STACK</h1>");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
