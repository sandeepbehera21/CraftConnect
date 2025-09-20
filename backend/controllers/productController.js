import { generateAIContent, generateAIContentFromImage } from "../utils/aiHelper.js";
import Product from "../models/productModel.js";
import { protect } from "../middleware/authMiddleware.js";

// Add new product with all fields (image, artisan, AI content)
export const addProduct = async (req, res) => {
  try {
    let { name, description, story, caption, category, region } = req.body;
    if (!req.file) return res.status(400).json({ message: "Image is required" });

    // If name is not provided, derive it from the image filename (before extension)
    if (!name || String(name).trim().length === 0) {
      const original = req.file.originalname || req.file.filename || "Untitled";
      const base = original.replace(/\.[^/.]+$/, "");
      // Normalize to title case words
      name = base
        .replace(/[\-_]+/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .replace(/\b\w/g, (c) => c.toUpperCase());
      if (!name) name = "Untitled";
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    const price = req.body.price !== undefined ? Number(req.body.price) : undefined;
    const stock = req.body.stock !== undefined ? Number(req.body.stock) : undefined;

    // If description/story/caption provided by client (from previous generate), use them directly.
    // Otherwise call AI utility for content based on name, with safe fallback.
    let aiData;
    if (description || story || caption) {
      aiData = {
        description: description || `Beautiful handcrafted ${name}.`,
        story: story || `Lovingly crafted with heritage techniques.`,
        caption: caption || `Discover ${name}. #ArtisanMade #Handcrafted`,
      };
    } else {
      try {
        aiData = await generateAIContent(name);
      } catch (e) {
        const safeTag = String(name).replace(/\s+/g, "");
        aiData = {
          description: `Beautiful handcrafted ${name}. Thoughtfully made by skilled artisans.`,
          story: `Each ${name} reflects cultural heritage and careful craftsmanship, bringing a unique touch to your space.`,
          caption: `Handmade ${name} you will love. #ArtisanMade #Handcrafted #${safeTag}`,
        };
      }
    }

    // Save product to DB
    const product = await Product.create({
      name,
      image: imageUrl,
      description: aiData.description,
      story: aiData.story,
      caption: aiData.caption,
      category: category || undefined,
      region: region || undefined,
      price: typeof price === 'number' && !Number.isNaN(price) ? price : undefined,
      stock: typeof stock === 'number' && !Number.isNaN(stock) ? stock : undefined,
      artisan: req.user._id,           // Set from JWT middleware
    });

    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// AI Content Generation Only
export const generateProductContent = async (req, res) => {
  try {
    const { productName, name } = req.body;
    let requestedName = productName || name;
    if (!requestedName && req.file) {
      const original = req.file.originalname || req.file.filename || "Untitled";
      requestedName = original.replace(/\.[^/.]+$/, "").replace(/[\-_]+/g, " ").replace(/\s+/g, " ").trim();
      if (!requestedName) requestedName = "Untitled";
    }
    
    if (!requestedName) {
      return res.status(400).json({ error: 'Product name is required' });
    }

    // Generate using image first, then name; if both fail, respond with safe fallback
    try {
      let aiContent;
      if (req.file) {
        try {
          aiContent = await generateAIContentFromImage(req.file.path, requestedName || "");
        } catch (e1) {
          aiContent = await generateAIContent(requestedName || "");
        }
      } else {
        aiContent = await generateAIContent(requestedName || "");
      }

      return res.json({
        description: aiContent.description,
        story: aiContent.story,
        caption: aiContent.caption
      });
    } catch (finalErr) {
      const hint = requestedName || "product";
      const safeTag = String(hint).replace(/\s+/g, "");
      return res.json({
        description: `Beautiful handcrafted ${hint}. Thoughtfully made by skilled artisans.`,
        story: `Each ${hint} reflects cultural heritage and careful craftsmanship, bringing a unique touch to your space.`,
        caption: `Handmade ${hint} you will love. #ArtisanMade #Handcrafted #${safeTag}`,
      });
    }
  } catch (error) {
    console.error('Product content generation error:', error);
    const message = error?.message || 'Failed to generate product content';
    res.status(200).json({
      description: `Beautiful handcrafted product. Thoughtfully made by skilled artisans.`,
      story: `Lovingly crafted, reflecting cultural heritage and skill.`,
      caption: `Discover artisan craft. #ArtisanMade #Handcrafted`,
      warning: message,
    });
  }
};

// Get all products
export const getProducts = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page || '1', 10));
    const pageSize = Math.min(48, Math.max(1, parseInt(req.query.pageSize || '12', 10)));
    const sort = String(req.query.sort || 'newest');
    const category = req.query.category ? String(req.query.category).toLowerCase() : undefined;
    const region = req.query.region ? String(req.query.region) : undefined;
    const search = req.query.search ? String(req.query.search) : undefined;

    const filter = {};
    if (category && category !== 'all') filter.category = category;
    if (region) filter.region = new RegExp(`^${region}$`, 'i');
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { story: { $regex: search, $options: 'i' } },
      ];
    }

    const sortSpec = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      name: { name: 1 },
    }[sort] || { createdAt: -1 };

    const [items, total] = await Promise.all([
      Product.find(filter)
        .populate('artisan', 'name email')
        .sort(sortSpec)
        .skip((page - 1) * pageSize)
        .limit(pageSize),
      Product.countDocuments(filter),
    ]);

    res.json({ items, total, page, pageSize });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get single product
export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('artisan', 'name email');
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get products for the logged-in artisan
export const getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ artisan: req.user._id }).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a product (owner only)
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (String(product.artisan) !== String(req.user._id)) {
      return res.status(403).json({ message: "Not authorized to delete this product" });
    }
    await product.deleteOne();
    res.json({ message: "Product deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};