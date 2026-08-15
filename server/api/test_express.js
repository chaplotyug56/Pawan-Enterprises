const express = require("express");
const app = express();
app.all("*", (req, res) => {
  res.status(200).json({ success: true, message: "Express is working inside Vercel!" });
});
module.exports = app;
