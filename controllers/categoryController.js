import CategoryModel from "../models/CategoryModel.js";
import slugify from "slugify";

export const categoryController = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(401).send({
                success: false,
                message: 'name is required'
            });
        }

        const existingCategory = await CategoryModel.findOne({ name });
        if (existingCategory) {
            return res.status(200).send({
                success: true,
                message: 'category already exists',
            });
        }

        const category = await new CategoryModel({ name, slug: slugify(name) }).save();
        res.status(201).send({
            success: true,
            message: 'category created successfully',
            category,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'error in categoryController'
        });
    }
};

export const updateCategoryController =async(req,res)=>{
    try {
        const {name}=req.body;
        const{id}=req.params;
      const category=await CategoryModel.findByIdAndUpdate(id,{name,slug:slugify(name)},{new:true}) 
      res.status(200).send({
             success: true,
             message: 'category updated successfully',
              category
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
             success: false,
             message: 'error in updateCategoryController'
        })
    }
}

export const getAllCategoriesController =async(req,res)=>{
    try {
        const categories=await CategoryModel.find();
        res.status(200).send({
             success: true,
             message: 'categories fetched successfully',
             categories
        }) 
    } catch (error) {
        console.log(error)
        res.status(500).send({
             success: false,
             message: 'error in getAllCategoriesController'
        })
    }
}

export const getCategoryController=async(req,res)=>{
    try {
      const category=await CategoryModel.findById({slug:req.params.slug})   
      res.status(200).send({
        success: true,
        message: 'single category fetched successfully',
        category
      })
    } catch (error) {
        console.log(error)
        res.status(500).send({
             success: false,
             message: 'error in getCategoryController'
        })
    }
}

export const deleteCategoryController=async(req,res)=>{
    try {
        const {id}=req.params;
        await CategoryModel.findByIdAndDelete(id)
        res.status(200).send({
             success: true,
             message: 'category deleted successfully'
        })
    } catch (error) {
        console.log(error)
    }
}