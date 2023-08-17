const Category = require("./model");
const { connect } = require("mongoose");
require("dotenv").config();

const getAllCategories = async (req, res) => {
  //   res.send("Hello World!");
  try {
    await connect(process.env.MONGO_URI);
    const allCategories = await Category.find();
    res.json({
      category: allCategories,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

const getCategoryByID = async (req, res) => {
  const { _id } = req.query; //jo db k andr h wo wali id as a query recieve krenge

  try {
    await connect(process.env.MONGO_URI);
    const category = await Category.findOne({ _id });
    res.json({ category });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

const createCategory = async (req, res) => {
  const { CategoryName, CategoryImage } = req.body;
  //   try catch mongo ki error handling k lye lgyaya h
  //   if else se required feild agr empty hogi to error show hoga mongo meyn jane se pehle hi

  if (!CategoryName || !CategoryImage) {
    res.status(403).json({
      message: "Missing Required Field",
    });
  } else {
    try {
      await connect(process.env.MONGO_URI);
      const checkExisting = await Category.exists({ CategoryName });

      if (checkExisting) {
        res.status(400).json({
          message: "Category Already Exists",
        });
      } else {
        await Category.create({ CategoryName, CategoryImage });
        const allCategories = await Category.find();

        res.json({
          message: "DB Connected",
          category: allCategories,
        });
      }
    } catch (error) {
      res.status(400).json({
        message: error.message,
      });
    }
  }
};

const updateCategory = async (req, res) => {
  const { _id, CategoryName, CategoryImage } = req.body;

  const filter = { _id };
  const update = { CategoryName, CategoryImage };

  try {
    await connect(process.env.MONGO_URI);

    await Category.findOneAndUpdate(filter, update, {
      new: true,
    });

    const category = await Category.find();

    res.json({
      message: "Success",
      category,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

const deleteCategory = async (req, res) => {
  const { _id } = req.body;

  try {
    await connect(process.env.MONGO_URI);
    await Category.deleteOne({ _id });
    const category = await Category.find();
    res.status(200).json({
      message: "Deleted Successfully",
      category,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

module.exports = {
  getAllCategories,
  getCategoryByID,
  createCategory,
  updateCategory,
  deleteCategory,
};
