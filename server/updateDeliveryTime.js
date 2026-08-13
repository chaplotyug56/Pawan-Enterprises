require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
    console.log("Connected to MongoDB");
    const result = await Product.updateMany(
        {}, 
        { $set: { estimatedDeliveryTime: "1 Business Day" } }
    );
    console.log("Migration complete:", result);
    process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
});
