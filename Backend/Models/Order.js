const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  placedAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['placed', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'placed'
  },
  paymentMethod: {
    type: String,
    enum: ['cod', 'online'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'completed'
  },
  subtotal: {
    type: Number,
    required: true
  },
  shipping: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    required: true
  },
  address: {
    fullName: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    addressLine1: {
      type: String,
      required: true
    },
    addressLine2: {
      type: String
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    pincode: {
      type: String,
      required: true
    },
    landmark: {
      type: String
    }
  },
  items: [
    {
      productId: {
        type: String,
        required: true
      },
      name: {
        type: String,
        required: true
      },
      image: {
        type: String,
        required: true
      },
      weight: {
        type: String
      },
      qty: {
        type: Number,
        required: true
      },
      price: {
        type: Number,
        required: true
      },
      subtotal: {
        type: Number,
        required: true
      }
    }
  ]
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', OrderSchema);
