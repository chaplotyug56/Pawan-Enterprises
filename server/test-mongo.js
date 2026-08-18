const mongoose = require('mongoose');

const uri = "mongodb+srv://chaplotyug56_db_user:yugchaplot56@yug.zrwx7g2.mongodb.net/pawan-enterprises?retryWrites=true&w=majority&appName=Yug";

async function test() {
  try {
    console.log("Connecting...");
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      family: 4
    });
    console.log("Connected successfully!");
    const count = await mongoose.connection.db.collection('products').countDocuments();
    console.log("Products count:", count);
    process.exit(0);
  } catch (err) {
    console.error("Connection failed:", err.message);
    process.exit(1);
  }
}
test();
