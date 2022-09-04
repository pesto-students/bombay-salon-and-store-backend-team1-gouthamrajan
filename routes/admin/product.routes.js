const router = require('express').Router()
const ProductController = require('../../controllers/product.controller')
const upload = require('../../middlewares/multer.middlerware')

// get all products
router.get('/', ProductController.getProducts)


router.post('/add', upload.single('product_image'), ProductController.addProduct)


module.exports = router