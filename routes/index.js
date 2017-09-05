const express = require("express");
const models = require("../models/index");
const router = express.Router();

router.get("/", function(req, res) {
  res.redirect("/api");
});

router.get("/api", function(req, res) {
  res.send("This is where I would have my API documentation.");
});

//get list of items
router.get("/api/customer/items", function(req, res) {
  models.Item.findAll({})
  .then(function(items) {
    if(items) {
      res.setHeader("Content-Type", "application/json");
      res.status(200).json(items);
    } else{
      res.send("No items found.");
    }
  })
  .catch(function(err) {
    res.status(500).send("Bad Request");
  })
});

//purchase an item
router.post("/api/customer/items/:itemId/purchases", function(req, res) {
  models.Item.findOne({
    where: {id: req.params.itemId}
  })
  .then(function(item) {
    if(req.body.amtPaid < item.cost) {
      res.status(400).send("You didn't add enough money.");
    } else if(item.qty < 1) {
        res.status(400).send("This item is out of stock.");
      } else {
        let overpaid = req.body.amtPaid - item.cost;
        models.Item.update({qty: item.qty - 1}, {
          where: {id: req.params.itemId}
        })
        .then(function(data) {
          models.Purchase.create({
            itemId: item.id,
            amtPaid: req.body.amtPaid,
            change: overpaid
          })
          .then(function(data) {
            res.setHeader("Content-Type", "application/json");
            res.status(201).json(data);
          })
          .catch(function(err) {
            res.status(500).send("There was an error with the purchase")
          })
        })
      }
    })
    .catch(function(err) {
      res.status(500).send("Error finding the item")
  })
});

//get a list of all purchases with their item and date/time
router.get("/api/vendor/purchases", function(req, res) {

});

//get a total amount of money accepted by the machine
router.get("/api/vendor/money", function(req, res) {

});

//add a new item not previously existing in the machine
router.post("/api/vendor/items", function(req, res) {
  models.Item.create({
    description: req.body.description,
    cost: req.body.cost,
    qty: req.body.qty
  })
  .then(function(data) {
    res.setHeader("Content-Type", "application/json");
    res.status(201).json(items);
  })
  .catch(function(err) {
    res.status(500).send("Bad Request")
  });
});

//update item quantity, description, and cost
router.put("/api/vendor/items/:itemId", function(req, res) {

});


module.exports = router;
