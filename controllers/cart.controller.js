const CartModel = require("../models/Cart/schema");

const getUserCart = async (user_id) => {
  try {
    const cart = await CartModel.findOne({ user_id }).populate(
      "products.details"
    );
    if (cart) return cart;
    return new CartModel({ user_id }).save();
  } catch (error) {
    return Promise.reject({
      message: `Failed to get user cart: ${error.message}`,
      status: 400,
    });
  }
};

const addToCart = async (product_id, user_id) => {
  try {
    const cart = await getUserCart(user_id);
    let products = [...cart.products] || [];
    const productCartIndex = products.findIndex(
      (product) => product.id?.toString() === product_id
    );
    console.log(productCartIndex);
    // means product is present in cart, so need to update quantity
    if (productCartIndex > -1) {
      return Promise.reject({
        message: "Product already added in cart",
        status: 400,
      });
    } else {
      products.push({
        id: product_id,
        cart_quantity: 1,
      });
    }
    cart.products = products;
    return cart.save();
  } catch (error) {
    return Promise.reject(`Failed to add product to card: ${error.message}`);
  }
};

const removeFromCart = async (product_id, user_id) => {
  try {
    const cart = await getUserCart(user_id);
    let products = [...cart.products] || [];
    const productIndexInCart = products.findIndex(
      (product) => product.id.toString() === product_id
    );
    if (productIndexInCart === -1)
      return Promise.reject({ message: "Product not in cart", status: 400 });
    products.splice(productIndexInCart, 1);
    cart.products = products;
    return cart.save();
  } catch (error) {
    return Promise.reject(`Failed to add product to card: ${error.message}`);
  }
};

const CART_OPERATIONS = {
  ADD_TO_CART: "ADD_TO_CART",
  REMOVE_FROM_CART: "REMOVE_FROM_CART",
};

exports.cartHandler = async (req, res, next) => {
  try {
    const { user, body } = req;
    const { operation, product_id } = body;
    let cart;
    if (operation === CART_OPERATIONS.ADD_TO_CART) {
      cart = await addToCart(product_id, user.id);
    } else if (operation === CART_OPERATIONS.REMOVE_FROM_CART) {
      cart = await removeFromCart(product_id, user.id);
    } else {
      return res.status(400).json({ message: "Invalid cart action" });
    }
    return res.json({ success: true, cart });
  } catch (error) {
    next(error);
  }
};

exports.getCart = async (req, res, next) => {
  try {
    const { user } = req;
    const cart = await getUserCart(user.id);
    return res.json({ cart });
  } catch (error) {
    next(error);
  }
};
