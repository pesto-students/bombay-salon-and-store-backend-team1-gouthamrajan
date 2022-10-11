const dotenv = require('dotenv');
const { default: mongoose } = require('mongoose');
const CartModel = require('./models/Cart/schema');
const ProductModel = require('./models/Product/schema');
const UserModel = require('./models/User/schema');
dotenv.config();
const Services = [
	{
		"name": "Hair Trim",
		"description": "Cutting, tapering, texturizing and thinning using any hair type",
		"type": "service",
		"image_url": "https://cdn2.iconfinder.com/data/icons/barber-services-in-glyph-style/32/man-haircut-512.png",
		"category": "Hair",
		"duration": "60 minutes",
		"price": 300
	},
	{
		"name": "Shaving",
		"description": "Cutting, tapering, texturizing and thinning using any hair type",
		"type": "service",
		"image_url": "https://static.thenounproject.com/png/5829-200.png",
		"category": "Beard",
		"duration": "30 minutes",
		"price": 150
	},
	{
		"name": "Face wash",
		"description": "Cutting, tapering, texturizing and thinning using any hair type",
		"type": "service",
		"image_url": "https://cdn-icons-png.flaticon.com/512/4652/4652198.png",
		"category": "Skin",
		"duration": "30 minutes",
		"price": 300
	},
	{
		"name": "Hair Wash",
		"description": "Cutting, tapering, texturizing and thinning using any hair type",
		"type": "service",
		"image_url": "https://cdn-icons-png.flaticon.com/512/1190/1190677.png",
		"category": "Hair",
		"duration": "60 minutes",
		"price": 300
	},
	{
		"name": "Hair Color",
		"description": "Cutting, tapering, texturizing and thinning using any hair type",
		"type": "service",
		"image_url": "https://static.thenounproject.com/png/1303315-200.png",
		"category": "Hair",
		"duration": "60 minutes",
		"price": 300
	}
]

const Products = [
	{
		"name": "Hair Oil",
		"description": "Cutting, tapering, texturizing and thinning using any hair type",
		"type": "product",
		"image_url": "https://cdn2.iconfinder.com/data/icons/barber-services-in-glyph-style/32/man-haircut-512.png",
		"category": "Hair",
		"price": 200
	},
	{
		"name": "Hair Shampoo",
		"description": "Cutting, tapering, texturizing and thinning using any hair type",
		"type": "product",
		"image_url": "https://cdn2.iconfinder.com/data/icons/barber-services-in-glyph-style/32/man-haircut-512.png",
		"category": "Hair",
		"price": 300
	},
	{
		"name": "Face wash gel",
		"description": "Cutting, tapering, texturizing and thinning using any hair type",
		"type": "product",
		"image_url": "https://cdn2.iconfinder.com/data/icons/barber-services-in-glyph-style/32/man-haircut-512.png",
		"category": "Skin",
		"price": 250
	},
]

const deleteDatabase = async () => {
	console.log('Deleting DB');
	await UserModel.remove({});
	console.log('User collection deleted');
	await ProductModel.remove({});
	console.log('Product collection deleted');
	await CartModel.remove({})
	console.log('Cart collection deleted');
	console.log('---DONE---')
}

const createServices = async () => {
	for (const Service of Services) {
		const service = new ProductModel(Service);
		await service.save()
	}
}

const createProducts = async () => {
	for (const Product of Products) {
		const product = new ProductModel(Product);
		await product.save()
	}
}

const setupDatabase = async () => {
	const MONGO_CONNECTION = process.env.MONGO_CONNECTION
	await mongoose.connect(MONGO_CONNECTION, {
		useNewUrlParser: true,
	});
	console.log('DB connected')
	await deleteDatabase()
	const adminUser = new UserModel({ name: 'Admin', role: 'ADMIN', mobile: 9999999999, email: 'admin@tbss.com', gender: 'other', 'password': '123456789' });
	await adminUser.save();
	console.log('Adding services')
	await createServices();
	console.log('Adding products')
	await createProducts();
	console.log('---DONE---')
	process.exit()
}

setupDatabase();