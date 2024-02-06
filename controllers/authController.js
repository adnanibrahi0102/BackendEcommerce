import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import UserModel from "../models/UserModel.js";
import JWT from "jsonwebtoken";
import orderModel from "../models/orderModel.js";

export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;
    //validation
    if (!name || !email || !password || !phone || !address) {
      return res.status(403).send({
        success: false,
        message: "Please fill all the fields",
      });
    }

    //checking users
    const existingUser = await UserModel.findOne({ email });
    //checking existing users
    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: "User already exists ! Please Login",
      });
    }

    //hashing password
    const hashedPassword = await hashPassword(password);
    const user = await new UserModel({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
    }).save();
    res.status(201).send({
      success: true,
      message: "user registered successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error in registration",
      error,
    });
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid email or password",
      });
    }
    const user = await UserModel.findOne({ email });
    if (!user)
      return res
        .status(404)
        .send({ success: false, message: "email is not registered" });
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(404).send({
        success: false,
        message: "invalid password",
      });
    }

    // creating JWT token
    const token = await JWT.sign(
      { _id: user._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );
    res.status(200).send({
        success:true,
        message:"Login successful",
        user:{                      
            name:user.name,
            email:user.email,
            phone:user.phone,
            address:user.address,
            role:user.role
            
        },
        token,
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error in login",
      error,
    });
  }
};

// testController
export const testController=(req,res)=>{
  res.send({
    message:"Protected Route"
  })
}

//orders controller
export const getOrdersController = async (req, res) => {
  try {
      const orders = await orderModel.find({ buyer: req.user._id }).populate('products', '-photo').populate("buyer", "name");
      res.status(200).send({
          success: true,
          orders,
      });
  } catch (error) {
      console.error("Error in getting orders:", error);
      res.status(500).send({
          success: false,
          message: "Error in getting orders",
          error: error.message, 
      });
  }
};

//all orders cotroller
export const getAllOrdersController = async (req, res) => {
  try {
      const orders = await orderModel.find({}).populate('products', '-photo').populate("buyer", "name").sort({createdAt:-1});
      res.status(200).send({
          success: true,
          orders,
      });
  } catch (error) {
      console.error("Error in getting orders:", error);
      res.status(500).send({
          success: false,
          message: "Error in getting all orders",
          error: error.message, 
      });
  }
};

//change order status controller
export const changeOrderStatusController=async(req,res)=>{
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    console.log('Received request to update order status. Order ID:', orderId, 'New Status:', status);
    const updatedOrder = await orderModel.findByIdAndUpdate(orderId, { status }, { new: true });

    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error in changing order status",
      error: error.message,
    });
  }
};
