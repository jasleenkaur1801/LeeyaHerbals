const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        required: true,
        enum: [
            'serum', 'cleanser', 'toner', 'facewash', 'facemask', 'acneoilgel',
            'facialkit', 'moisturzinglotion', 'rosewater', 'scalpoil', 'scrub',
            'skinconditioner', 'sunscreenlotion', 'bleachcream', 'eyegel',
            'facewashgel', 'cream', 'cleansingmilk'
        ]
    },
    weight: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: '/placeholder-product.png'
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
        default: 5
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Create index on id for faster queries
ProductSchema.index({ id: 1 });
ProductSchema.index({ category: 1 });
ProductSchema.index({ isActive: 1 });

module.exports = mongoose.model('Product', ProductSchema);
