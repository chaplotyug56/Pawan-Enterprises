const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const path = require("path");
const User = require("./models/User");

dotenv.config({ path: path.join(__dirname, ".env") });

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(async () => {
    console.log("MongoDB Connected");

    const email = "staff@gmail.com";
    const password = await bcrypt.hash("staff123", 10);

    const existingStaff = await User.findOne({ email });
    if (existingStaff) {
        console.log("Staff already exists, updating role/password...");
        existingStaff.role = "staff";
        existingStaff.password = password;
        await existingStaff.save();
    } else {
        console.log("Creating staff account...");
        await User.create({
            name: "Delivery Staff",
            email: email,
            password: password,
            role: "staff"
        });
    }

    console.log("Staff seeded successfully");
    process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
});
