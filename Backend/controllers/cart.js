import user from "../database/modals/user";
 


export const createCart = async (req, res) => {
  try {
    const { user_id, product_id, quantity } = req.body;

    // Find the user's cart
    const cart = await Cart.findOne({ user_id });

    if (!cart) {
      // If the cart doesn't exist, you can handle this case as needed (e.g., create a new cart)
      // For this example, we'll create a new cart
      const newCart = new Cart({
        user_id,
        items: [{ product_id, quantity }], 
      });

      const savedCart = await newCart.save();
      res.json(savedCart);
    } else {
      // If the cart already exists, check if the product is already in the cart
      const existingItem = cart.items.find((item) => item.product_id === product_id);

      if (existingItem) {
        // If the product is in the cart, update the quantity
        existingItem.quantity = existingItem.quantity + quantity;
      } else {
        // If the product is not in the cart, add a new item
        cart.items.push({ product_id, quantity });
      }
 

      // Save the updated cart
      const savedCart = await cart.save();
      res.json(savedCart);
    }
  } catch (error) {
    console.error("Error adding item to cart:", error);
    res.status(500).json({ error: "Error adding item to cart" });
  }
};
