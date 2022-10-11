const router = require('express').Router()
const ProductController = require('../../controllers/product.controller')

// get all products
router.get('/', ProductController.getProducts)


router.post('/add', ProductController.addProduct)


module.exports = router