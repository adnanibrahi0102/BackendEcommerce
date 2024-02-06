import express from 'express';
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js';
import { categoryController, deleteCategoryController, getAllCategoriesController, getCategoryController, updateCategoryController } from '../controllers/categoryController.js';
const router=express.Router();

///routes 
//create category
router.post('/create-category',requireSignIn,isAdmin,categoryController)

//update category
router.put('/update-category/:id',requireSignIn,isAdmin,updateCategoryController)
export default router;

//getAll categories
router.get('/getall-categories',getAllCategoriesController);

//get single category
router.get('/getCategory/:slug',getCategoryController);

//delete single category
router.delete('/deleteCategory/:id',requireSignIn , isAdmin,deleteCategoryController);