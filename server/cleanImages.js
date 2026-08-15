const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: ".env" });

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const Product = require("./models/Product.js");
  const products = await Product.find({});
  let updated = 0;

  const extractId = (url) => {
    if (!url) return url;
    if (url.includes("/api/images/")) {
      const parts = url.split("/api/images/");
      // taking the last part in case it was prepended multiple times
      let id = parts[parts.length - 1];
      // strip any trailing slashes or junk
      id = id.replace(/[^a-zA-Z0-9]/g, "");
      return id;
    }
    return url;
  };

  for (const p of products) {
    let changed = false;

    if (p.image && p.image.includes("/api/images/")) {
      p.image = extractId(p.image);
      changed = true;
    }

    if (p.images && p.images.length > 0) {
      for (let i = 0; i < p.images.length; i++) {
        if (p.images[i] && p.images[i].includes("/api/images/")) {
          p.images[i] = extractId(p.images[i]);
          changed = true;
        }
      }
    }

    if (p.variants && p.variants.length > 0) {
      for (let i = 0; i < p.variants.length; i++) {
        if (
          p.variants[i].image &&
          p.variants[i].image.includes("/api/images/")
        ) {
          p.variants[i].image = extractId(p.variants[i].image);
          changed = true;
        }
      }
    }

    if (changed) {
      await p.save();
      updated++;
      console.log("Fixed product:", p.name);
    }
  }

  console.log(`Done! Fixed ${updated} products.`);
  process.exit(0);
});
