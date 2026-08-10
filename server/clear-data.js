require("dotenv").config();
const mongoose = require("mongoose");
const Order = require("./models/Order");
const Notification = require("./models/Notification");

async function clearData() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB.");

    console.log("Clearing all orders...");
    const orderResult = await Order.deleteMany({});
    console.log(`Deleted ${orderResult.deletedCount} orders.`);

    console.log("Clearing all notifications...");
    const notifResult = await Notification.deleteMany({});
    console.log(`Deleted ${notifResult.deletedCount} notifications.`);

    console.log("Done.");
  } catch (error) {
    console.error("Error clearing data:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
    process.exit(0);
  }
}

clearData();
