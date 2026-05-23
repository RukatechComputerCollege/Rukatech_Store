const mongoose = require('mongoose');

const flashSaleSchema = new mongoose.Schema({
  title: { type: String, default: 'Flash Sale' },
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      productName: { type: String, required: true },
      productImage: { type: String, default: '' },
    }
  ],
  description: { type: String, default: '' },
  discount: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  isActive: { type: Boolean, default: false },
  status: { type: String, enum: ['upcoming', 'active', 'expired'], default: 'upcoming' }
}, {
  timestamps: true
});

module.exports = mongoose.model('FlashSale', flashSaleSchema);
