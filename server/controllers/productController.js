const Product = require("../models/Product");

// =======================
// Add Product
// =======================
const addProduct = async (req, res) => {
  console.log("🔥 addProduct API called");

  try {
    // Main Image
    const image =
      req.files?.image?.length > 0
        ? req.files.image[0].filename
        : "";

    // Gallery Images
    const images =
      req.files?.images?.length > 0
        ? req.files.images.map((file) => file.filename)
        : [];

    const product = new Product({
      ...req.body,
      image,
      images,
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
      query.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          brand: {
            $regex: search,
            $options: "i",
          },
        },
        {
          category: {
            $regex: search,
            $options: "i",
          },
        },
      ];
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
        obj.image = `${req.protocol}://${req.get("host")}/uploads/${obj.image}`;
      }
      
      if (obj.images && obj.images.length > 0) {
        obj.images = obj.images.map(
          (img) =>
            `${req.protocol}://${req.get("host")}/uploads/${img}`
        );
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
      productObj.image = `${req.protocol}://${req.get("host")}/uploads/${productObj.image}`;
    }
    if (
      productObj.images &&
      productObj.images.length > 0
    ) {
      productObj.images = productObj.images.map(
        (img) =>
          `${req.protocol}://${req.get("host")}/uploads/${img}`
      );
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

    const updateData = {
      ...req.body,
    };

    // Update main image only if new image uploaded
    if (req.files?.image?.length > 0) {
      updateData.image = req.files.image[0].filename;
    }

    // Update gallery only if new gallery images uploaded
    if (req.files?.images?.length > 0) {
      updateData.images = req.files.images.map(
        (file) => file.filename
      );
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
        obj.image = `${req.protocol}://${req.get("host")}/uploads/${obj.image}`;
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
        obj.image = `${req.protocol}://${req.get("host")}/uploads/${obj.image}`;
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