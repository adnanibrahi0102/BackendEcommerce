import ProductModel from "../models/ProductModel.js";
import fs from "fs";
import slugify from "slugify";
import CategoryModel from '../models/CategoryModel.js'
import orderModel from "../models/orderModel.js";
import braintree from "braintree";
import dotenv from "dotenv";

dotenv.config();

//Payement Gateway Integration
let gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});








export const createProductController = async (req, res) => {
  try {
    const { name, slug, description, category, price, quantity, shipping } =
      req.fields;
    const { photo } = req.files;
    //validation
    if (!name || !description || !category || !price || !quantity || !photo) {
      return res.status(500).send({
        message: "All fields are required",
        success: false,
        error: "All fields are required",
      });
    }
    const product = new ProductModel({ ...req.fields, slug: slugify(name) });
    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }
    await product.save();
    res.status(201).send({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error creating product",
      success: false,
      error,
    });
  }
};

export const getProductsController = async (req, res) => {
  try {
    const products = await ProductModel.find({})
      .populate("category")
      .select("-photo")
      .limit(12)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      message: "Products fetched successfully",
      Total: products.length,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error getting products",
      success: false,
      error,
    });
  }
};

export const getProductController = async (req, res) => {
  try {
    const product = await ProductModel.findOne({ slug: req.params.slug })
    .select("name price quantity description shipping photo")
      .populate("category");
    res.status(200).send({
      message: "Product fetched successfully",
      success: true,
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error getting product",
      success: false,
      error,
    });
  } 
};

export const getProductPhotoController = async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.pid).select("photo");
    if (product.photo.data) {
      res.set("Content-Type", product.photo.contentType);
      return res.status(200).send(product.photo.data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error getting product photo",
      success: false,
      error,
    });
  }
};

export const deleteProductController = async (req, res) => {
  try {
    await ProductModel.findByIdAndDelete(req.params.pid).select("-photo");
    res.status(200).send({
      message: "Product deleted successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error deleting product",
      success: false,
      error,
    });
  }
};

export const updateProductController = async (req, res) => {
  try {
    const { name, slug, description, category, price, quantity, shipping } =
      req.fields;
    const { photo } = req.files;
    //validation
    if (!name || !description || !category || !price || !quantity || !photo) {
      return res.status(500).send({
        message: "All fields are required",
        success: false,
        error: "All fields are required",
      });
    }
    const product = await ProductModel.findByIdAndUpdate(req.params.pid,{...req.fields,slug:slugify(name)},{new:true})
    if (photo) {
        product.photo.data = fs.readFileSync(photo.path);
        product.photo.contentType = photo.type;
      }
      await product.save();
      res.status(201).send({
        message: "Product updated  successfully",
        success: true,
        product,
      });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error updating product",
      success: false,
      error,
    });
  }
};

export const filterProductController =async(req,res)=>{
  try {
    const {checked,radio}=req.body;
    let args={};
    if(checked.length>0)args.category=checked;
    if(radio.length)args.price={$gte:radio[0],$lte:radio[1]}
    const products =await ProductModel.find(args) 
    res.status(200).send({
      success: true,
      products
    })

  } catch (error) {
    console.log(error)
    res.status(500).send({
        message: "Error getting  filtered products",
        success: false,
        error,
        
    })
  }
}

export const ProductCountController=async(req,res)=>{
  try {
      const total=await ProductModel.find({}).estimatedDocumentCount()
      res.status(200).send({
          success: true,
          total
      })
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: "Error in product count",
        success: false,
        error,
    })
  }
}
export const productListController=async(req,res)=>{
  try {
    const perPage=6;
    const page=req.params.page?req.params.page:1
    const products=await ProductModel.find({}).select("-photo").skip((page-1)*perPage).limit(perPage).sort({createdAt:-1})
    res.status(200).send({
       success:true,
       products 
    })
  } catch (error) {
    console.log(error)
    res.status(400).send({
      message: "Error in product list controller",
          success: false,
          error,
    })
  }
}

export const searchController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const results = await ProductModel.find({
      $or: [
        { name: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } }
      ]
    }).select('-photo');
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error in search controller", success: false, error });
  }
};

export const productCategoryController=async(req,res)=>{
  try {
    const category=await CategoryModel.findOne({slug:req.params.slug})
    const products=await ProductModel.find({category}).populate('category')
    res.status(200).send({
        success:true,
        products,
        category
    }) 
  } catch (error) {
    console.log(error)
    res.status(400).send({
        message: "Error in product category controller",
          success: false,
          error,
    })
  }
}

// Payment gateway api's

export const braintreeTokenController=async(req,res)=>{
      try {
        gateway.clientToken.generate({},function(err,response){
          if(err){
            return res.status(500).send(err)
          }else{
            res.status(200).send(response)
          }
        })
      } catch (error) {
        console.log(error)
      }
}
export const braintreePaymentController = async (req, res) => {
  try {
      const { cart, nonce } = req.body;
      let total = 0;
      
      cart.map((i) => {
          total += i.price;
      });

      gateway.transaction.sale({
          amount: total,
          paymentMethodNonce: nonce,
          options: {
              submitForSettlement: true
          }
      }, (error, result) => {
          if (result) {
              const order = new orderModel({
                  products: cart,
                  payment: result,
                  buyer: req.user._id,
              });

              order.save();
              res.json({ ok: true });
          } else {
              res.status(500).send(error);
          }
      });
  } catch (error) {
      console.log(error);
  }
};
