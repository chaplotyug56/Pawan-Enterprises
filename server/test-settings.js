const mongoose = require('mongoose');

const uri = "mongodb+srv://chaplotyug56_db_user:yugchaplot56@yug.zrwx7g2.mongodb.net/pawan-enterprises?retryWrites=true&w=majority&appName=Yug";

async function test() {
  try {
    await mongoose.connect(uri, { family: 4 });
    const settings = await mongoose.connection.db.collection('settings').findOne();
    console.log("Settings from DB:", settings);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
test();
