const { handleJoiError } = require('../helpers/errorHandler')
const ProductModel = require('../models/Product/schema')
const { validateCreateProduct } = require('../models/Product/validators')

exports.getProducts = async (req, res, next) => {
	try {
		return res.json({ products: [] })
	} catch (error) {
		console.log('err');
		next(error)
	}
}

exports.addProduct = async (req, res) => {
  try {
    const { error } = validateCreateProduct(req.body);
    if (error) {
      handleJoiError(error, res);
      return;
    }
    const product = await new ProductModel(req.body).save();
    res.status(201).json({
      product
    });
  } catch (error) {
    next(error);
  }
};

