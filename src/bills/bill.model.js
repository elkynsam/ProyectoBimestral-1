import mongoose from "mongoose";

const BillSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
        required: true
    },
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                min: 1
            },
            price: {
                type: Number,
                required: false
            }
        }
    ],
    total: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "paid", "canceled"],
        default: "pending"
    },
    shippingAddress: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

BillSchema.methods.toJSON = function() {
    const { __v, ...bill } = this.toObject();
    return bill;
};

export default mongoose.model("Bill", BillSchema);
