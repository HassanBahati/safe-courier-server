const express = require("express");

const Order = require("../models/orderModel.js");

const orderRouter = express.Router();

//Get api/orders
//gets all order
//public
orderRouter.get("/", (req, res) => {
  Order.find()
    .sort({ date: -1 })
    .then((orders) => res.json(orders));
});

//Get api/orders
//create order
//public
//post submits an order
orderRouter.post('/', async (req, res) => {
  const order = new Order({
    name: req.body.name,
    pickUp: req.body.pickUp,
    delivery: req.body.delivery,
    weight: req.body.weight,
  });
  try {
    const savedOrder = await order.save();
    res.json(savedOrder);
  } catch (err) {
    console.log(err)
    res.json({ message: err });
  }
});

//delete api/orders
//deletes order
//public
orderRouter.delete("/:id", (req, res) => {
 Order.findById(req.params.id)
 .then(order => order.remove().then(() => res.json({msg:'deleted successfully'})))
 .catch(err => res.status(404).json({msg: "failed to delete order"}))
}); 


module.exports = orderRouter;
