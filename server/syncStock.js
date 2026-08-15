const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const Product = require("./models/Product");

async function syncStock() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to DB");

    const products = await Product.find({});
    console.log(`Found ${products.length} products`);

    let updated = 0;
    for (const product of products) {
      const allowOutOfStock = product.allowOutOfStockPurchase === true;
      const isOutOfStock = product.stock <= 0 && !allowOutOfStock;

      const shouldBeActive = !isOutOfStock;

      if (product.active !== shouldBeActive) {
        product.active = shouldBeActive;
        await product.save();
        updated++;
        console.log(`Updated product: ${product.name} to active: ${shouldBeActive}`);
      }
    }

    console.log(`Successfully synced active status for ${updated} products.`);
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

syncStock();
