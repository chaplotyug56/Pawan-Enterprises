const Product = require("../models/Product");
const Image = require("../models/Image");

// =======================
// Add Product
// =======================
const addProduct = async (req, res) => {
  console.log("🔥 addProduct API called");

  try {
    let variants = [];
    if (req.body.variants) {
      try { variants = typeof req.body.variants === "string" ? JSON.parse(req.body.variants) : req.body.variants; } catch (e) {}
    }
    const hasVariants = req.body.hasVariants === "true" || req.body.hasVariants === true;

    let imagesIds = [];
    if (req.files?.length > 0) {
      for (const file of req.files) {
        const newImg = new Image({
          name: file.originalname,
          data: file.buffer,
          contentType: file.mimetype,
        });
        const savedImg = await newImg.save();
        
        if (file.fieldname === "images") {
          imagesIds.push(savedImg._id.toString());
        } else if (file.fieldname.startsWith("variantImage_")) {
          const idx = parseInt(file.fieldname.split("_")[1], 10);
          if (variants[idx]) {
            variants[idx].image = savedImg._id.toString();
          }
        }
      }
    }

    let imageId = imagesIds.length > 0 ? imagesIds[0] : "";

    const product = new Product({
      ...req.body,
      hasVariants,
      allowOutOfStockPurchase: req.body.allowOutOfStockPurchase === "true" || req.body.allowOutOfStockPurchase === true,
      deliveryAvailable: req.body.deliveryAvailable === "true" || req.body.deliveryAvailable === true,
      featured: req.body.featured === "true" || req.body.featured === true,
      bestSeller: req.body.bestSeller === "true" || req.body.bestSeller === true,
      newArrival: req.body.newArrival === "true" || req.body.newArrival === true,
      showOnHomepage: req.body.showOnHomepage === "true" || req.body.showOnHomepage === true,
      active: req.body.active === "true" || req.body.active === true,
      variants,
      image: imageId,
      images: imagesIds,
    });

    await product.save();

    return res.status(201).json({
      success: true,
      message: "Product Added Successfully",
      data: product,
    });
  } catch (error) {
    console.error("Add Product Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================
// Get All Products
// =======================
const getProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      inStock,
      sort,
      admin,
    } = req.query;

    const query = {};

    // Search
    if (search) {
      const searchTerms = search.trim().split(/\s+/);
      query.$and = searchTerms.map(term => ({
        $or: [
          { name: { $regex: term, $options: "i" } },
          { brand: { $regex: term, $options: "i" } },
          { category: { $regex: term, $options: "i" } },
          { sku: { $regex: term, $options: "i" } },
          { "variants.size": { $regex: term, $options: "i" } },
          { "variants.color": { $regex: term, $options: "i" } },
          { "variants.sku": { $regex: term, $options: "i" } }
        ],
      }));
    }

    // Category Filter
    if (category && category !== "All") {
      query.category = category;
    }

    // Price Filter
    if (minPrice || maxPrice) {
      query.price = {};

      if (minPrice) {
        query.price.$gte = Number(minPrice);
      }

      if (maxPrice) {
        query.price.$lte = Number(maxPrice);
      }
    }

    // Stock Filter
    if (inStock === "true") {
      query.stock = { $gt: 0 };
    } else if (admin !== "true" && !search) {
      query.stock = { $gt: 0 };
    }

    let products = await Product.find(query);

    // Sorting
    switch (sort) {
      case "low":
        products.sort((a, b) => a.price - b.price);
        break;

      case "high":
        products.sort((a, b) => b.price - a.price);
        break;

      case "rating":
        products.sort(
          (a, b) => b.averageRating - a.averageRating
        );
        break;

      case "name":
        products.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        break;

      case "newest":
      default:
        products.sort(
          (a, b) =>
            new Date(b.createdAt) -
            new Date(a.createdAt)
        );
    }

    const updatedProducts = products.map((product) => {
      const obj = product.toObject();

      if (obj.image) {
        if (obj.image && !obj.image.startsWith("http") && !obj.image.startsWith("data:image") && !obj.image.startsWith("//")) {
          obj.image = `//${req.get("host")}/api/images/${obj.image}`;
        }
      }
      
      if (obj.images && obj.images.length > 0) {
        obj.images = obj.images.map((img) => {
          if (img && !img.startsWith("http") && !img.startsWith("data:image") && !img.startsWith("//")) {
            return `//${req.get("host")}/api/images/${img}`;
          }
          return img;
        });
      }

      if (obj.variants && obj.variants.length > 0) {
        obj.variants = obj.variants.map((variant) => {
          if (variant.image && !variant.image.startsWith("http") && !variant.image.startsWith("data:image") && !variant.image.startsWith("//")) {
            variant.image = `//${req.get("host")}/api/images/${variant.image}`;
          }
          return variant;
        });
      }

      return obj;
    });

    res.status(200).json({
      success: true,
      count: updatedProducts.length,
      data: updatedProducts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================
// Get Single Product
// =======================
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product Not Found",
      });
    }

    const productObj = product.toObject();

    if (productObj.image) {
      if (productObj.image && !productObj.image.startsWith("http") && !productObj.image.startsWith("data:image") && !productObj.image.startsWith("//")) {
        productObj.image = `//${req.get("host")}/api/images/${productObj.image}`;
      }
    }
    if (
      productObj.images &&
      productObj.images.length > 0
    ) {
      productObj.images = productObj.images.map((img) => {
        if (img && !img.startsWith("http") && !img.startsWith("data:image") && !img.startsWith("//")) {
          return `//${req.get("host")}/api/images/${img}`;
        }
        return img;
      });
    }

    console.log("PRODUCT VARIANTS LENGTH:", productObj.variants ? productObj.variants.length : "undefined");
    if (productObj.variants && productObj.variants.length > 0) {
      productObj.variants = productObj.variants.map((variant) => {
        console.log("Variant image before:", variant.image);
        if (variant.image && !variant.image.startsWith("http") && !variant.image.startsWith("data:image") && !variant.image.startsWith("//")) {
          variant.image = `//${req.get("host")}/api/images/${variant.image}`;
        }
        console.log("Variant image after:", variant.image);
        return variant;
      });
    }

    res.status(200).json({
      success: true,
      data: productObj,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================
// Update Product
// =======================
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product Not Found",
      });
    }

    let variants = [];
    if (req.body.variants) {
      try { variants = typeof req.body.variants === "string" ? JSON.parse(req.body.variants) : req.body.variants; } catch (e) {}
    }

    const updateData = {
      ...req.body,
      hasVariants: req.body.hasVariants === "true" || req.body.hasVariants === true,
      allowOutOfStockPurchase: req.body.allowOutOfStockPurchase === "true" || req.body.allowOutOfStockPurchase === true,
      deliveryAvailable: req.body.deliveryAvailable === "true" || req.body.deliveryAvailable === true,
      featured: req.body.featured === "true" || req.body.featured === true,
      bestSeller: req.body.bestSeller === "true" || req.body.bestSeller === true,
      newArrival: req.body.newArrival === "true" || req.body.newArrival === true,
      showOnHomepage: req.body.showOnHomepage === "true" || req.body.showOnHomepage === true,
      active: req.body.active === "true" || req.body.active === true,
      variants,
    };

    if (req.files?.length > 0) {
      const newImageIds = [];
      for (const file of req.files) {
        const newImg = new Image({
          name: file.originalname,
          data: file.buffer,
          contentType: file.mimetype,
        });
        const savedImg = await newImg.save();
        
        if (file.fieldname === "images") {
          newImageIds.push(savedImg._id.toString());
        } else if (file.fieldname.startsWith("variantImage_")) {
          const idx = parseInt(file.fieldname.split("_")[1], 10);
          if (updateData.variants[idx]) {
            updateData.variants[idx].image = savedImg._id.toString();
          }
        }
      }
      if (newImageIds.length > 0) {
        // Only override if new main images were actually uploaded
        updateData.images = newImageIds;
        updateData.image = newImageIds[0];
      }
    }

    const updatedProduct =
      await Product.findByIdAndUpdate(
        req.params.id,
        updateData,
        {
          new: true,
          runValidators: true,
        }
      );

    return res.status(200).json({
      success: true,
      message: "Product Updated Successfully",
      data: updatedProduct,
    });
  } catch (error) {
    console.error("Update Product Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================
// Delete Product
// =======================
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(
      req.params.id
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product Not Found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================
// Get Related Products
// =======================
const getRelatedProducts = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product Not Found",
      });
    }

    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
    })
      .limit(4);

    const updatedProducts = relatedProducts.map((item) => {
      const obj = item.toObject();

      if (obj.image) {
        if (obj.image && !obj.image.startsWith("http") && !obj.image.startsWith("data:image") && !obj.image.startsWith("//")) {
          obj.image = `//${req.get("host")}/api/images/${obj.image}`;
        }
      }

      if (obj.variants && obj.variants.length > 0) {
        obj.variants = obj.variants.map((variant) => {
          if (variant.image && !variant.image.startsWith("http") && !variant.image.startsWith("data:image") && !variant.image.startsWith("//")) {
            variant.image = `//${req.get("host")}/api/images/${variant.image}`;
          }
          return variant;
        });
      }

      return obj;
    });

    res.status(200).json({
      success: true,
      data: updatedProducts,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// =======================
// Get Best Selling Products
// =======================
const getBestSellingProducts = async (req, res) => {
  try {
    const products = await Product.find({ stock: { $gt: 0 } })
      .sort({ salesCount: -1 })
      .limit(8);

    const updatedProducts = products.map((product) => {
      const obj = product.toObject();

      if (obj.image) {
        if (obj.image && !obj.image.startsWith("http") && !obj.image.startsWith("data:image") && !obj.image.startsWith("//")) {
          obj.image = `//${req.get("host")}/api/images/${obj.image}`;
        }
      }

      if (obj.variants && obj.variants.length > 0) {
        obj.variants = obj.variants.map((variant) => {
          if (variant.image && !variant.image.startsWith("http") && !variant.image.startsWith("data:image") && !variant.image.startsWith("//")) {
            variant.image = `//${req.get("host")}/api/images/${variant.image}`;
          }
          return variant;
        });
      }

      return obj;
    });

    res.status(200).json({
      success: true,
      data: updatedProducts,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
module.exports = {
  addProduct,
  getProducts,
  getProductById,
  getRelatedProducts,
  getBestSellingProducts,
  updateProduct,
  deleteProduct,
};