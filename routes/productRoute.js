import express from 'express';
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js';
import { ProductCountController, braintreePaymentController, braintreeTokenController, createProductController, deleteProductController, filterProductController, getProductController, getProductPhotoController, getProductsController, productCategoryController, productListController, searchController, updateProductController } from '../controllers/productController.js';
import formidable from 'express-formidable'

const router=express.Router();

//routes
router.post('/create-product',requireSignIn,isAdmin,formidable(),createProductController)
//get all products
router.get('/get-Allproducts',getProductsController)
// get product
router.get('/get-product/:slug',getProductController)

//get route for photo
router.get('/product-photo/:pid',getProductPhotoController)
//delete product
router.delete('/delete-product/:pid',deleteProductController)
// update route for product
router.put('/update-product/:pid',requireSignIn,isAdmin,formidable(),updateProductController)

// filter product
router.post('/product-filter',filterProductController)
//producr count for pagination
router.get('/product-count',ProductCountController)
//prouduct per page for pagination
router.get('/product-list/:page', productListController)
//search route
router.get('/search/:keyword',searchController)
//category wise product
router.get('/product-category/:slug',productCategoryController)

//PAYMENT routes
router.get('/braintree-token',braintreeTokenController)
router.post('/braintree-payment',requireSignIn,braintreePaymentController)
export default router;