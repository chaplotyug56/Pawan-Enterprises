console.log("✅ Loaded orderController.js");
const Order = require("../models/Order");
const Product = require("../models/Product");
const Notification = require("../models/Notification");
const Counter = require("../models/Counter");
const { sendWhatsAppMessage } = require("../services/whatsappService");
const generateInvoice = require("../utils/invoiceGenerator");
// ========================================
// Create Order
// ========================================
const createOrder = async (req, res) => {
    console.log("🚀 createOrder() called");
  try {
    let {
        items,
        shippingAddress,
        location,
        paymentMethod,
        paymentTime,
      } = req.body;
      
      // FormData sends JSON as strings
      if (typeof items === "string") {
        items = JSON.parse(items);
      }
      
      if (typeof shippingAddress === "string") {
        shippingAddress = JSON.parse(shippingAddress);
      }
      
      if (typeof location === "string") {
        location = JSON.parse(location);
      }
      
      // Uploaded screenshot (optional)
      const paymentScreenshot = req.file
        ? `/uploads/${req.file.filename}`
        : "";
    // Validate Items
    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No order items",
      });
    }

    // Validate Shipping Address
    if (!shippingAddress) {
      return res.status(400).json({
        success: false,
        message: "Shipping address is required",
      });
    }

    let calculatedTotal = 0;

    // Check stock and calculate total
    for (const item of items) {
      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `${item.name} not found`,
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `${product.name} is out of stock`,
        });
      }

      calculatedTotal += product.price * item.quantity;

      item.name = product.name;
      item.price = product.price;
      item.image = product.image;

      product.stock -= item.quantity;

// Increase total sold quantity
if (product.salesCount == null || isNaN(product.salesCount)) {
  product.salesCount = 0;
}
product.salesCount += item.quantity;

await product.save();
    }
    
    // Add shipping charge if applicable (waived for in-store purchases)
    const isInStore = shippingAddress.houseNo === "In-Store";
    const shippingPrice = (isInStore || calculatedTotal >= 1000) ? 0 : 20;
    calculatedTotal += shippingPrice;

    // ========================================
// Generate Custom Order ID
// Format: PE YY MM DD MonthlyCount 
// ========================================

const now = new Date();

const year = String(now.getFullYear()).slice(-2);
const month = String(now.getMonth() + 1).padStart(2, "0");
const day = String(now.getDate()).padStart(2, "0");

const monthKey = `${now.getFullYear()}-${month}`;

// Find current month's counter
let counter = await Counter.findOne({ month: monthKey });

if (!counter) {
  counter = await Counter.create({
    month: monthKey,
    sequence: 1,
  });
} else {
  counter.sequence += 1;
  await counter.save();
}

const sequence = String(counter.sequence).padStart(4, "0");

const customOrderId = `PE${year}${month}${day}${sequence}`;

    // Create Order
    const order = await Order.create({
        user: req.user._id,
        orderId: customOrderId,
        items,
        totalPrice: calculatedTotal,
        shippingAddress,
        location,
        paymentMethod,
      
        paymentTime,
      
        paymentScreenshot,
      
        paymentStatus:
          paymentMethod === "upi"
            ? "Pending Verification"
            : "Pending",
      });

    // Create Notification
    await Notification.create({
      title: "🛒 New Order",
      message: `${shippingAddress.fullName} placed an order worth ₹${calculatedTotal}`,
      type: "order",
      referenceId: order._id,
      metadata: {
        orderNumber: customOrderId,
        customer: shippingAddress.fullName,
        amount: calculatedTotal,
      },
    });
    console.log("✅ Notification saved in database");

    // Send WhatsApp (Don't stop order if it fails)
    try {
        console.log("📲 About to send WhatsApp...");
        
        await sendWhatsAppMessage({
            customerName: shippingAddress.fullName,
          
            phone: shippingAddress.phone,
          
            amount: calculatedTotal,
          
            paymentMethod,
          
            paymentTime,
          
            paymentScreenshot,
          
            address: `${shippingAddress.houseNo ? shippingAddress.houseNo + ', ' : ''}${shippingAddress.building ? shippingAddress.building + ', ' : ''}${shippingAddress.street}${shippingAddress.landmark ? `, ${shippingAddress.landmark}` : ''}, ${shippingAddress.city}, ${shippingAddress.state || 'Rajasthan'} - ${shippingAddress.pincode}`,
          
            orderId: customOrderId,

            paymentStatus: order.paymentStatus,
          });
          console.log("✅ WhatsApp function completed");
          
    } catch (whatsappError) {
      console.error("WhatsApp Error:");
      console.error(
        whatsappError.response?.data || whatsappError.message
      );
    }

    return res.status(201).json({
      success: true,
      message: "Order Placed Successfully",
      order,
    });

  } catch (error) {
    console.error("Create Order Error:");
    console.error(error);

    if (res.headersSent) return;

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ========================================
// Get Logged-in User Orders
// ========================================
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({
  user: req.user._id,
})
.sort({ createdAt: -1 })
.populate("items.product")
.populate("user", "name email");

    return res.status(200).json({
      success: true,
      data: orders,
    });

  } catch (error) {
    console.error(error);

    if (res.headersSent) return;

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ========================================
// Get All Orders (Admin)
// ========================================
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .sort({ createdAt: -1 })
      .populate("user", "name email")
      .populate("items.product");
    return res.json({
      success: true,
      data: orders,
    });

  } catch (error) {
    console.error(error);

    if (res.headersSent) return;

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ========================================
// Download Invoice
// ========================================
const downloadInvoice = async (req, res) => {
    try {
      const order = await Order.findById(req.params.id).populate("items.product");
  
      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }
  
      generateInvoice(res, order);
  
    } catch (error) {
      console.error(error);
  
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

// ========================================
// Update Order Status / Payment Status
// ========================================
const updateOrderStatus = async (req, res) => {
    try {
      const order = await Order.findById(req.params.id);
  
      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }
  
      // -----------------------------
      // Update Order Status
      // -----------------------------
      if (req.body.status) {
        const allowedStatus = [
          "Pending",
          "Processing",
          "Shipped",
          "Delivered",
          "Cancelled",
        ];
  
        if (!allowedStatus.includes(req.body.status)) {
          return res.status(400).json({
            success: false,
            message: "Invalid order status",
          });
        }
  
        order.status = req.body.status;
  
        // COD payment becomes paid after delivery
        if (
          order.paymentMethod === "cod" &&
          req.body.status === "Delivered"
        ) {
          order.paymentStatus = "Paid";
          order.paidAt = new Date();
        }
      }
  
      // -----------------------------
      // Update UPI Payment Status
      // -----------------------------
      if (req.body.paymentStatus) {
        const allowedPaymentStatus = [
          "Pending",
          "Pending Verification",
          "Paid",
          "Rejected",
        ];
  
        if (
          !allowedPaymentStatus.includes(req.body.paymentStatus)
        ) {
          return res.status(400).json({
            success: false,
            message: "Invalid payment status",
          });
        }
  
        order.paymentStatus = req.body.paymentStatus;
  
        if (req.body.paymentStatus === "Paid") {
          order.paidAt = new Date();
        } else {
          order.paidAt = null;
        }
      }
  
      await order.save();
  
      return res.status(200).json({
        success: true,
        message: "Order Updated Successfully",
        order,
      });
  
    } catch (error) {
      console.error("Update Order Error:", error);
  
      if (res.headersSent) return;
  
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
  module.exports = {
    createOrder,
    getOrders,
    getAllOrders,
    updateOrderStatus,
    downloadInvoice,
  };