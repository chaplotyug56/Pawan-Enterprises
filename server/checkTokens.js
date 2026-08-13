const mongoose = require("mongoose");
const NotificationToken = require("./models/NotificationToken");
require("dotenv").config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const tokens = await NotificationToken.find();
  console.log(JSON.stringify(tokens, null, 2));
  process.exit(0);
});
