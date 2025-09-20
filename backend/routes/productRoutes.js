import express from "express";
import { 
  addProduct, 
  generateProductContent, 
  getProducts, 
  getProduct,
  getMyProducts,
  deleteProduct
} from "../controllers/productController.js";
import { protect } from "../middleware/authMiddleware.js";
import { body } from "express-validator";
import upload from "../middleware/upload.js";

const router = express.Router();

// 1. AI Content Generation Only (supports optional image upload)
// POST /api/products/generate
router.post("/generate", upload.single("image"), generateProductContent);

// 2. Add New Product with all fields (image, artisan, AI content)
// POST /api/products
router.post(
  "/",
  protect,
  upload.single("image"),
  [
    body("name").optional().isString().isLength({ min: 2 }),
    body("category").optional().isString(),
    body("region").optional().isString(),
    body("price").optional().isFloat({ min: 0 }),
    body("stock").optional().isInt({ min: 0 })
  ],
  addProduct
);

// 3. Get all products
// GET /api/products
router.get("/", getProducts);

// 4. Get single product
// GET /api/products/:id
router.get("/:id", getProduct);

// 5. Get products for logged-in artisan
// GET /api/products/mine
router.get("/mine/list", protect, getMyProducts);

// 6. Delete a product (owner only)
// DELETE /api/products/:id
router.delete("/:id", protect, deleteProduct);

export default router;