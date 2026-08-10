const Product = require("../models/Product");
const Order = require("../models/Order");
const User = require("../models/User");

const getDashboardStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments();

    const revenue = await Order.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$totalPrice" },
        },
      },
    ]);

    // Orders by Status
    const orderStatus = await Order.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    // Revenue by Payment Method
    const revenueByPayment = await Order.aggregate([
      {
        $group: {
          _id: "$paymentMethod",
          total: { $sum: "$totalPrice" },
        },
      },
    ]);

    // Revenue by Month
    const monthlyRevenue = await Order.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          revenue: { $sum: "$totalPrice" },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const monthNames = [
      "",
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const formattedRevenue = monthlyRevenue.map((item) => ({
      month: monthNames[item._id],
      revenue: item.revenue,
    }));

    // Sales by Category
    const salesByCategory = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          sales: { $sum: "$salesCount" },
        },
      },
    ]);

    // Top Selling Products
    const topProductsRaw = await Product.find()
      .sort({ salesCount: -1 })
      .limit(5)
      .select("name category price salesCount stock image");

    const topProducts = topProductsRaw.map((product) => {
      const obj = product.toObject();
      if (obj.image) {
        if (!obj.image.startsWith("http") && !obj.image.startsWith("data:image")) {
          obj.image = `//${req.get("host")}/api/images/${obj.image}`;
        }
      }
      return obj;
    });

    // Recent Customers
    const recentCustomers = await User.find({ role: "user" })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name email createdAt");

    res.json({
      success: true,
      data: {
        totalProducts,
        totalOrders,
        totalUsers,
        totalRevenue: revenue[0]?.total || 0,
        orderStatus,
        monthlyRevenue: formattedRevenue,
        salesByCategory,
        topProducts,
        recentCustomers,
        revenueByPayment,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  getDashboardStats,
};