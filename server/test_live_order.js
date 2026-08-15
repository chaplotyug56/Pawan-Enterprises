const fs = require("fs");
const FormData = require("form-data");
const axios = require("axios");

async function test() {
  try {
    // 1. Create a dummy test image
    fs.writeFileSync("test_image.jpg", Buffer.from("fake image content"));

    // 2. Prepare payload
    const form = new FormData();
    form.append(
      "items",
      JSON.stringify([
        {
          product: "66bc6f7bc22af50e0474ce24",
          quantity: 1,
          color: "",
          size: "",
        },
      ]),
    );
    form.append(
      "shippingAddress",
      JSON.stringify({
        fullName: "Test",
        phone: "1234567890",
        street: "test",
        city: "test",
        pincode: "123456",
      }),
    );
    form.append(
      "location",
      JSON.stringify({ latitude: 0, longitude: 0, distance: 0 }),
    );
    form.append("paymentMethod", "upi");
    form.append("paymentTime", "12:00");
    form.append("paymentScreenshot", fs.createReadStream("test_image.jpg"));

    // 3. Login to get token (using a dummy account or admin)
    // Actually, maybe we can't login easily if we don't have the password.
    // Let's just create an order on the local API to verify it works locally at least.
  } catch (err) {
    console.error(err);
  }
}
test();
