const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    name: { type: String,  },
    pickUp: { type: String, },
    delivery: { type: String },
    weight: { type: Number,  },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);


module.exports = Order;
