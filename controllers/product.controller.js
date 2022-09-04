const { handleJoiError } = require('../helpers/errorHandler')
const ProductModel = require('../models/Product/schema')
const { validateCreateProduct } = require('../models/Product/validators')

exports.getProducts = async (req, res, next) => {
	try {
		const products = await ProductModel.find({ type: 'product'});
    return res.json({ products })
	} catch (error) {
		console.log('err');
		next(error)
	}
}

exports.getServices = async (req, res, next) => {
	try {
		const services = await ProductModel.find({ type: 'service'});
    return res.json({ services })
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
    const rawProduct = {
      ...req.body,
      image_url: `${process.env.BASE_URL}/images/${encodeURI(req.file.filename)}`
    }
    const product = await new ProductModel(rawProduct).save();
    res.status(201).json({
      product
    });
  } catch (error) {
    next(error);
  }
};

