const app = require('express')
const router = app.Router()
const { getProducts, postProducts, deleteProducts, ProductbyCategory, ProductbyId } = require('./controller')

router.get('/get-all-products', getProducts)
router.get('/get-product-by-id/:_id', ProductbyId)
router.get('/get-product-by-category/:category', ProductbyCategory)

router.post('/add-products', postProducts)
router.delete('/delete-products', deleteProducts)


module.exports = router