const PDFDocument = require("pdfkit");

function generateInvoice(res, order) {
  const doc = new PDFDocument({ margin: 50 });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=Invoice-${order.orderId}.pdf`
  );

  doc.pipe(res);

  // Company
  doc
    .fontSize(24)
    .fillColor("#0d47a1")
    .text("PAWAN ENTERPRISES", {
      align: "center",
    });

  doc
    .moveDown(0.5)
    .fontSize(11)
    .fillColor("black")
    .text("Near Bus Stand, Akola")
    .text("Chittorgarh, Rajasthan")
    .text("Phone: +91 9929119290")
    .moveDown();

  doc.moveTo(50, 150).lineTo(550, 150).stroke();

  doc.moveDown();

  doc.fontSize(18).text("TAX INVOICE");

  doc.moveDown();

  doc.fontSize(12);

  doc.text(`Invoice No : ${order.orderId}`);
  doc.text(`Date : ${new Date(order.createdAt).toLocaleDateString("en-IN")}`);

  doc.moveDown();

  doc.text(`Customer : ${order.shippingAddress.fullName}`);
  doc.text(`Phone : ${order.shippingAddress.phone}`);

  doc.text(
    `Address : ${order.shippingAddress.address},
${order.shippingAddress.city},
${order.shippingAddress.state}
-${order.shippingAddress.pincode}`
  );

  doc.moveDown();

  doc.fontSize(14).text("Products");

  doc.moveDown(0.5);

  order.items.forEach((item) => {
    doc.text(
      `${item.name}  | Qty: ${item.quantity} | ₹${item.price} | ₹${
        item.quantity * item.price
      }`
    );
  });

  doc.moveDown();

  doc.fontSize(16);

  doc.text(`Total : ₹${order.totalPrice}`);

  doc.moveDown();

  doc.fontSize(12);

  doc.text(`Payment Method : ${order.paymentMethod.toUpperCase()}`);
  doc.text(`Payment Status : ${order.paymentStatus}`);
  doc.text(`Order Status : ${order.status}`);

  doc.moveDown(2);

  doc
    .fontSize(11)
    .fillColor("gray")
    .text("Thank you for shopping with Pawan Enterprises.", {
      align: "center",
    });

  doc.end();
}

module.exports = generateInvoice;