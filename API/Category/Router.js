const app = require('express')
const router = app.Router()
const {  getAllCategories, createCategory, getCategoryByID, deleteCategory, updateCategory } = require('./controller')

router.get('/get-all-categories', getAllCategories)
router.get('/get-category-by-id', getCategoryByID)
router.post('/create-category', createCategory)
router.put('/update-category', updateCategory)
router.delete('/delete-category', deleteCategory)

module.exports = router

//