const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: 'server/.env' });

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const Product = require('./server/models/Product.js');
  const products = await Product.find({ hasVariants: { $ne: true } });
  console.log(`Found ${products.length} products to migrate`);
  
  for (const product of products) {
    if (product.hasColors || product.hasSizes || product.hasRates) {
      console.log(`Migrating ${product.name}...`);
      const variants = [];
      
      const colors = (product.hasColors && product.colors?.length > 0) ? product.colors : [{ name: "", image: "" }];
      const sizes = (product.hasSizes && product.sizes?.length > 0) ? product.sizes : [""];
      const rates = (product.hasRates && product.rates?.length > 0) ? product.rates : [product.price];
      
      for (const color of colors) {
        for (const size of sizes) {
          for (const rate of rates) {
            variants.push({
              color: color.name || "",
              size: size || "",
              mrp: product.mrp,
              price: rate || product.price,
              image: color.image || ""
            });
          }
        }
      }
      
      product.hasVariants = true;
      product.variants = variants;
      await product.save();
      console.log(`Migrated ${product.name} with ${variants.length} variants.`);
    }
  }
  console.log("Done!");
  process.exit(0);
});
