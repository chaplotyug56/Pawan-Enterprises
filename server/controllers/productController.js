const Product = require("../models/Product");
const Image = require("../models/Image");

// =======================
// Add Product
// =======================
const addProduct = async (req, res) => {
  console.log("🔥 addProduct API called");

  try {
    let imagesIds = [];
    if (req.files?.length > 0) {
      for (const file of req.files) {
        const newImg = new Image({
          name: file.originalname,
          data: file.buffer,
          contentType: file.mimetype,
        });
        const savedImg = await newImg.save();
        imagesIds.push(savedImg._id.toString());
      }
    }

    let imageId = imagesIds.length > 0 ? imagesIds[0] : "";

    const product = new Product({
      ...req.body,
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
      query.stock = {
        $gt: 0,
      };
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
        if (!obj.image.startsWith("http") && !obj.image.startsWith("data:image")) {
          obj.image = `//${req.get("host")}/api/images/${obj.image}`;
        }
      }
      
      if (obj.images && obj.images.length > 0) {
        obj.images = obj.images.map((img) => {
          if (!img.startsWith("http") && !img.startsWith("data:image")) {
            return `//${req.get("host")}/api/images/${img}`;
          }
          return img;
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
      if (!productObj.image.startsWith("http") && !productObj.image.startsWith("data:image")) {
        productObj.image = `//${req.get("host")}/api/images/${productObj.image}`;
      }
    }
    if (
      productObj.images &&
      productObj.images.length > 0
    ) {
      productObj.images = productObj.images.map((img) => {
        if (!img.startsWith("http") && !img.startsWith("data:image")) {
          return `//${req.get("host")}/api/images/${img}`;
        }
        return img;
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

    // The req.body already contains the updated image and images strings (for old images)
    const updateData = {
      ...req.body,
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
        newImageIds.push(savedImg._id.toString());
      }
      updateData.images = newImageIds;
      updateData.image = newImageIds[0];
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
        if (!obj.image.startsWith("http") && !obj.image.startsWith("data:image")) {
          obj.image = `//${req.get("host")}/api/images/${obj.image}`;
        }
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
    const products = await Product.find()
      .sort({ salesCount: -1 })
      .limit(8);

    const updatedProducts = products.map((product) => {
      const obj = product.toObject();

      if (obj.image) {
        if (!obj.image.startsWith("http") && !obj.image.startsWith("data:image")) {
          obj.image = `//${req.get("host")}/api/images/${obj.image}`;
        }
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