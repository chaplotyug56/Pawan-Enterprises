const app = require("../server.js");

// Export the Express app directly. Vercel automatically handles the req/res lifecycle correctly when given an Express app.
module.exports = app;
