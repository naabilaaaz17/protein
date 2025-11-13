const axios = require("axios");

exports.sendWhatsAppMessage = async (to, message) => {
  try {
    const response = await axios.post(
      "https://api.fonnte.com/send",
      {
        target: to,
        message,
      },
      {
        headers: {
          Authorization: process.env.FONNTE_TOKEN, // Token dari Fonnte dashboard
        },
      }
    );
    console.log("✅ WhatsApp message sent:", response.data);
  } catch (error) {
    console.error("❌ Failed to send WhatsApp message:", error.message);
  }
};
