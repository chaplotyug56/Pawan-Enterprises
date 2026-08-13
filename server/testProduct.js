const mongoose = require("mongoose");
const Product = require("./models/Product");
require("dotenv").config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const p = await Product.findOne({ hasVariants: true });
  console.log(JSON.stringify(p, null, 2));
  process.exit(0);
});
