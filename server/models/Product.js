const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true }, // e.g., 'Kameez', 'Saree', 'Fabric'
    price: { type: Number, required: true },
    image: { type: String, required: true }, // Main image URL
    images: [{ type: String }], // Array of image URLs/Base64

    description: { type: String },
    countInStock: { type: Number, required: true, default: 0 },
    isFeatured: { type: Boolean, default: false },
});

module.exports = mongoose.model('Product', productSchema);
