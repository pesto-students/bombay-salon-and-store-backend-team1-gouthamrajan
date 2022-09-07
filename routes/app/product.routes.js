const ProductController = require('../../controllers/product.controller')

const router = require('express').Router()

// get all products
router.get('/products', ProductController.getProducts)
router.get('/services', ProductController.getServices)




module.exports = router