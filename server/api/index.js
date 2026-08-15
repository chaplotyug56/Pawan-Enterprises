let app;
try {
  app = require("../server.js");
} catch (err) {
  app = (req, res) => {
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Initialization Error", message: err.message, stack: err.stack }));
  };
}

module.exports = app;
