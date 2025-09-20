import Order from "../models/Order.js";

// Get orders for the logged-in artisan
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ artisan: req.user._id })
      .populate("product", "name image")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

