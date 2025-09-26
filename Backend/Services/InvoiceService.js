const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

class InvoiceService {
  static generateInvoice(order, userDetails) {
    return new Promise((resolve, reject) => {
      try {
        // Create a new PDF document
        const doc = new PDFDocument({ margin: 50 });
        
        // Buffer to store PDF data
        const buffers = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
          const pdfData = Buffer.concat(buffers);
          resolve(pdfData);
        });

        // Header
        this.generateHeader(doc);
        
        // Customer and order information
        this.generateCustomerInformation(doc, order, userDetails);
        
        // Invoice table
        this.generateInvoiceTable(doc, order);
        
        // Footer
        this.generateFooter(doc);
        
        // Finalize the PDF
        doc.end();
        
      } catch (error) {
        reject(error);
      }
    });
  }

  static generateHeader(doc) {
    doc
      .fillColor('#1dbf73')
      .fontSize(20)
      .text('LEEYA HERBALS', 50, 45)
      .fillColor('#444444')
      .fontSize(10)
      .text('Natural Skincare Products', 50, 70)
      .text('Email: kpherbals300@gmail.com', 50, 85)
      .text('Phone: +91 9254473593', 50, 100)
      .moveDown();

    // Invoice title
    doc
      .fillColor('#1dbf73')
      .fontSize(20)
      .text('INVOICE', 400, 45, { align: 'right' })
      .fillColor('#444444')
      .fontSize(10)
      .text(`Date: ${new Date().toLocaleDateString('en-IN')}`, 400, 70, { align: 'right' })
      .moveDown();

    // Line separator
    doc
      .strokeColor('#aaaaaa')
      .lineWidth(1)
      .moveTo(50, 130)
      .lineTo(550, 130)
      .stroke();
  }

  static generateCustomerInformation(doc, order, userDetails) {
    doc
      .fillColor('#444444')
      .fontSize(12)
      .text('Bill To:', 50, 150)
      .fontSize(10)
      .text(`${order.address.fullName}`, 50, 170)
      .text(`${order.address.addressLine1}`, 50, 185)
      .text(`${order.address.addressLine2 || ''}`, 50, 200)
      .text(`${order.address.city}, ${order.address.state} - ${order.address.pincode}`, 50, 215)
      .text(`Phone: ${order.address.phone}`, 50, 230)
      .text(`Email: ${userDetails?.email || 'N/A'}`, 50, 245);

    // Order details
    doc
      .fontSize(12)
      .text('Order Details:', 300, 150)
      .fontSize(10)
      .text(`Order ID: ${order.orderId}`, 300, 170)
      .text(`Order Date: ${new Date(order.placedAt || order.createdAt).toLocaleDateString('en-IN')}`, 300, 185)
      .text(`Payment Method: ${order.paymentMethod.toUpperCase()}`, 300, 200)
      .text(`Payment Status: ${order.paymentMethod === 'cod' ? 'PENDING' : 'PREPAID'}`, 300, 215)
      .text(`Order Status: ${order.status.toUpperCase()}`, 300, 230);

    doc.moveDown();
  }

  static generateInvoiceTable(doc, order) {
    let i;
    const invoiceTableTop = 280;

    // Table header
    doc.page.margins.bottom = 0;
    
    // Header background
    doc
      .fillColor('#f8f9fa')
      .rect(50, invoiceTableTop, 500, 25)
      .fill();

    // Header text
    doc
      .fillColor('#444444')
      .fontSize(10)
      .text('Item', 60, invoiceTableTop + 8)
      .text('Qty', 280, invoiceTableTop + 8)
      .text('Rate', 350, invoiceTableTop + 8)
      .text('Amount', 450, invoiceTableTop + 8, { align: 'right' });

    // Table rows
    let position = invoiceTableTop + 35;
    
    for (i = 0; i < order.items.length; i++) {
      const item = order.items[i];
      
      // Alternate row colors
      if (i % 2 === 0) {
        doc
          .fillColor('#f8f9fa')
          .rect(50, position - 5, 500, 25)
          .fill();
      }
      
      doc
        .fillColor('#444444')
        .fontSize(9)
        .text(item.name, 60, position)
        .text(`${item.weight || 'N/A'}`, 60, position + 12, { fontSize: 8, color: '#666666' })
        .text(item.qty.toString(), 280, position)
        .text(`Rs ${Math.round(item.price)}`, 350, position)
        .text(`Rs ${Math.round(item.subtotal)}`, 450, position, { align: 'right' });
      
      position += 35;
    }

    // Summary section
    const summaryTop = position + 20;
    
    // Line separator
    doc
      .strokeColor('#aaaaaa')
      .lineWidth(1)
      .moveTo(300, summaryTop)
      .lineTo(550, summaryTop)
      .stroke();

    // Summary rows
    doc
      .fontSize(10)
      .text('Subtotal:', 350, summaryTop + 15)
      .text(`Rs ${Math.round(order.subtotal)}`, 450, summaryTop + 15, { align: 'right' })
      .text('Shipping:', 350, summaryTop + 35)
      .text(order.shipping > 0 ? `Rs ${Math.round(order.shipping)}` : 'FREE', 450, summaryTop + 35, { align: 'right' });

    // Total
    doc
      .fillColor('#1dbf73')
      .fontSize(12)
      .text('Total:', 350, summaryTop + 60)
      .text(`Rs ${Math.round(order.total)}`, 450, summaryTop + 60, { align: 'right' });
  }

  static generateFooter(doc) {
    doc
      .fontSize(8)
      .fillColor('#666666')
      .text('Thank you for choosing Leeya Herbals!', 50, 700, { align: 'center' })
      .text('For any queries, please contact us at kpherbals300@gmail.com', 50, 715, { align: 'center' })
      .text('This is a computer generated invoice and does not require signature.', 50, 730, { align: 'center' });
  }
}

module.exports = InvoiceService;
