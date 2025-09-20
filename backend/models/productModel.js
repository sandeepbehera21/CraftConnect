import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String },
  description: { type: String },
  story: { type: String },
  caption: { type: String },
  category: { type: String, enum: ["pottery", "textiles", "woodwork", "jewelry", "metalwork", "basketry", "other"], default: "other" },
  region: { type: String },
  price: { type: Number, default: 0 },
  stock: { type: Number, default: 0 },
  rating: { type: Number, default: 4.5, min: 0, max: 5 },
  ratingCount: { type: Number, default: 12 },
  artisan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Product", productSchema);
