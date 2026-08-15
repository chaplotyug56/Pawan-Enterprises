const axios = require("axios");

const sendWhatsAppMessage = async ({
  customerName,
  phone,
  amount,
  paymentMethod,
  paymentTime,
  paymentScreenshot,
  address,
  orderId,
  paymentStatus,
}) => {
  console.log("📲 sendWhatsAppMessage() called");
  try {
    if (
      !process.env.PHONE_NUMBER_ID ||
      !process.env.WHATSAPP_TOKEN ||
      !process.env.ADMIN_WHATSAPP
    ) {
      console.warn("⚠️ WhatsApp credentials missing. Skipping message.");
      return;
    }

    const adminPhone = process.env.ADMIN_WHATSAPP.replace(/\\D/g, ""); // Remove + and spaces

    const message = `🛒 *NEW ORDER*

━━━━━━━━━━━━━━

👤 *Customer*
${customerName}

📞 *Phone*
${phone}

💰 *Amount*
₹${amount}

💳 *Payment*
${paymentMethod.toUpperCase()}

🕒 *Payment Time*
${paymentTime || "Not Provided"}

📷 *Screenshot*
${paymentScreenshot ? "Uploaded ✅" : "Not Uploaded ❌"}

📍 *Address*
${address}

━━━━━━━━━━━━━━

🆔 *Order ID*
${orderId}

💵 *Payment Status*
${paymentStatus}`;
    console.log("PHONE_NUMBER_ID:", process.env.PHONE_NUMBER_ID);
    console.log("ADMIN_WHATSAPP:", process.env.ADMIN_WHATSAPP);
    console.log("TOKEN EXISTS:", !!process.env.WHATSAPP_TOKEN);
    const response = await axios.post(
      `https://graph.facebook.com/v20.0/${process.env.PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to: adminPhone,
        type: "text",
        text: {
          body: message,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
          "Content-Type": "application/json",
        },
      },
    );

    console.log("✅ WhatsApp Sent");
    console.log(response.data);
  } catch (error) {
    console.log("Meta Error:");
    console.log(error.response?.status);
    console.log(error.response?.data);
    console.log(error.message);
    console.log("WhatsApp Error:", error.response?.data || error.message);
  }
};

module.exports = {
  sendWhatsAppMessage,
};
