const mongoose = require("mongoose");
const Product = require("./models/Product");
require("dotenv").config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const product = await Product.findOne({ hasVariants: true });
  const productObj = product.toObject();

  if (productObj.variants && productObj.variants.length > 0) {
    productObj.variants = productObj.variants.map((variant) => {
      console.log("variant.image is:", variant.image, typeof variant.image);
      if (
        variant.image &&
        !variant.image.startsWith("http") &&
        !variant.image.startsWith("data:image") &&
        !variant.image.startsWith("//")
      ) {
        variant.image = `//localhost:8000/api/images/${variant.image}`;
      }
      return variant;
    });
  }

  console.log(JSON.stringify(productObj.variants, null, 2));
  process.exit(0);
});
