import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  artisan: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  customerName: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ["Pending", "Shipped", "Delivered", "Cancelled"], default: "Pending" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Order", orderSchema);

