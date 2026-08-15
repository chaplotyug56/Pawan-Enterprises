const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: "Admin access only",
  });
};

const adminOrStaff = (req, res, next) => {
  if (req.user && (req.user.role === "admin" || req.user.role === "staff")) {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: "Admin or Staff access only",
  });
};

module.exports = { admin, adminOrStaff };
