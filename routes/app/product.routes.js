const ProductController = require('../../controllers/product.controller')

const router = require('express').Router()

// get all products
router.get('/', ProductController.getProducts)




module.exports = router