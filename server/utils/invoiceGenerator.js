const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

function generateInvoice(res, order) {
  const doc = new PDFDocument({ margin: 50, size: "A4" });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=Invoice-${order.orderId}.pdf`
  );

  doc.pipe(res);

  // Generate Header
  const logoPath = path.join(__dirname, "../../client/public/logo.png");
  if (fs.existsSync(logoPath)) {
    doc.image(logoPath, 50, 45, { width: 50 });
  }

  doc
    .fillColor("#444444")
    .fontSize(20)
    .text("Pawan Enterprises", 110, 57)
    .fontSize(10)
    .text("Near Bus Stand, Akola", 200, 50, { align: "right" })
    .text("Chittorgarh, Rajasthan", 200, 65, { align: "right" })
    .text("Phone: +91 8209707984", 200, 80, { align: "right" })
    .moveDown();

  // Line Break
  doc.strokeColor("#aaaaaa").lineWidth(1).moveTo(50, 110).lineTo(550, 110).stroke();

  // Invoice details
  doc
    .fillColor("#000000")
    .fontSize(20)
    .text("INVOICE", 50, 130);

  doc
    .fontSize(10)
    .fillColor("#444444")
    .text(`Invoice No: ${order.orderId}`, 50, 160)
    .text(`Date: ${new Date(order.createdAt).toLocaleDateString("en-IN")}`, 50, 175)
    .text(`Payment Method: ${order.paymentMethod.toUpperCase()}`, 50, 190);

  // Customer Details
  doc
    .fontSize(10)
    .fillColor("#000000")
    .text("Billed To:", 300, 145)
    .fillColor("#444444")
    .text(order.shippingAddress.fullName, 300, 160)
    .text(`Phone: ${order.shippingAddress.phone}`, 300, 175)
    .text(order.shippingAddress.address, 300, 190)
    .text(`${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}`, 300, 205);

  // Table Setup
  const tableTop = 250;
  
  doc.font("Helvetica-Bold");
  doc.fontSize(10);
  doc.text("Item", 50, tableTop);
  doc.text("MRP", 250, tableTop, { width: 60, align: "right" });
  doc.text("Selling Price", 320, tableTop, { width: 70, align: "right" });
  doc.text("Discount", 400, tableTop, { width: 60, align: "right" });
  doc.text("Qty", 470, tableTop, { width: 30, align: "right" });
  doc.text("Total", 510, tableTop, { width: 40, align: "right" });

  doc.strokeColor("#dddddd").lineWidth(1).moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();
  
  doc.font("Helvetica");

  let y = tableTop + 25;

  let totalDiscount = 0;

  order.items.forEach((item) => {
    const mrp = item.product && item.product.mrp ? item.product.mrp : item.price;
    const price = item.price;
    const discount = mrp - price;
    const total = price * item.quantity;
    
    totalDiscount += (discount * item.quantity);

    doc.fontSize(10);
    // Allow item name to wrap, calculate height
    doc.text(item.name, 50, y, { width: 190 });
    
    // The other columns stay on the same starting y line
    doc.text(`Rs. ${mrp}`, 250, y, { width: 60, align: "right" });
    doc.text(`Rs. ${price}`, 320, y, { width: 70, align: "right" });
    doc.text(`Rs. ${discount}`, 400, y, { width: 60, align: "right" });
    doc.text(item.quantity.toString(), 470, y, { width: 30, align: "right" });
    doc.text(`Rs. ${total}`, 510, y, { width: 40, align: "right" });

    // Approximate height adjustment based on text wrapping
    const textHeight = doc.heightOfString(item.name, { width: 190 });
    y += textHeight + 10;
    
    doc.strokeColor("#eeeeee").lineWidth(1).moveTo(50, y - 5).lineTo(550, y - 5).stroke();
  });

  // Totals Section
  y += 10;
  
  const itemsTotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingCharge = order.totalPrice - itemsTotal;

  doc.font("Helvetica-Bold");
  doc.fontSize(12);
  
  // Left side: You Saved
  doc.fillColor("#2e7d32");
  doc.text(`You Saved: Rs. ${totalDiscount}`, 50, y);
  doc.fillColor("#000000");
  
  let rightY = y;
  
  if (shippingCharge > 0) {
    doc.text("Shipping:", 350, rightY, { width: 100, align: "right" });
    doc.text(`Rs. ${shippingCharge}`, 460, rightY, { width: 90, align: "right" });
    rightY += 15;
  }
  
  rightY += 5;
  
  doc.fontSize(14);
  doc.text("Grand Total:", 350, rightY, { width: 100, align: "right" });
  doc.text(`Rs. ${order.totalPrice}`, 460, rightY, { width: 90, align: "right" });

  doc.moveDown(3);
  doc.y = Math.max(doc.y, rightY + 40);

  doc
    .font("Helvetica")
    .fontSize(10)
    .fillColor("gray")
    .text("Thank you for shopping with Pawan Enterprises. Have a great day!", 50, doc.y, {
      align: "center",
      width: 500
    });

  doc.end();
}

module.exports = generateInvoice;