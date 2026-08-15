const mongoose = require("mongoose");
require("dotenv").config();
mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const Order = require("./models/Order.js");
  const orders = await Order.find().sort({ createdAt: -1 }).limit(5);
  console.log(
    orders.map((o) => ({
      id: o.orderId,
      screenshot: o.paymentScreenshot,
      created: o.createdAt,
    })),
  );
  process.exit(0);
});
