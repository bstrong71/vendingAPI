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
      items = {"status": "success", items: items};
      res.setHeader("Content-Type", "application/json");
      res.status(200).json(items);
    } else{
      res.send("No items found.");
    }
  })
  .catch(function(err) {
    err = {"status": "fail", error: err};
    res.status(500).send(err);
  })
});

//purchase an item
router.post("/api/customer/items/:itemId/purchases", function(req, res) {
  models.Item.findOne({
    where: {id: req.params.itemId}
  })
  .then(function(item) {
    if(req.body.amtPaid < item.cost) {
      err = {"status": "fail", error: {"amount paid": req.body.amtPaid, "amount required": item.cost}};
      res.status(400).send(err);
    } else if(item.qty < 1) {
        err = {"status": "fail", error: "This item is out of stock."}
        res.status(400).send(err);
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
            data = {"status": "success", data: data};
            res.setHeader("Content-Type", "application/json");
            res.status(201).json(data);
          })
          .catch(function(err) {
            err = {"status": "fail", error: err};
            res.status(500).send(err);
          })
        })
      }
    })
    .catch(function(err) {
      err = {"status": "fail", error: err};
      res.status(500).send(err);
  })
});

//get a list of all purchases with their item and date/time
router.get("/api/vendor/purchases", function(req, res) {
  models.Purchase.findAll({
    include: [
      {model: models.Item, as: "Items"}
    ]
  })
  .then(function(purchases) {
    if(purchases) {
      purchases = {"status": "success", purchases: purchases};
      res.setHeader("Content-Type", "application/json");
      res.status(200).json(purchases);
    } else{
      res.send("No purchases found.");
    }
  })
  .catch(function(err) {
    err = {"status": "fail", error: err};
    res.status(500).send(err);
  })
});

//get a total amount of money accepted by the machine
router.get("/api/vendor/money", function(req, res) {
  models.Purchase.sum("amtPaid")
  .then(function(paid){
    models.Purchase.sum("change")
    .then(function(extra) {
      let total = paid - extra;
      data = {"status": "success", data: {total}};
      res.setHeader("Content-Type", "application/json");
      res.status(200).json(data);
    })
    .catch(function(err) {
      err = {"status": "fail", error: err};
      res.status(500).send(err);
    })
  })
  .catch(function(err) {
    err = {"status": "fail", error: err};
    res.status(500).send(err);
  })
});

//add a new item to the machine
router.post("/api/vendor/items", function(req, res) {
  models.Item.create({
    description: req.body.description,
    cost: req.body.cost,
    qty: req.body.qty
  })
  .then(function(data) {
    data = {"status": "success", data: data};
    res.setHeader("Content-Type", "application/json");
    res.status(201).json(data);
  })
  .catch(function(err) {
    err = {"status": "fail", error: err};
    res.status(500).send(err);
  })
});

//update item quantity, description, and cost
router.put("/api/vendor/items/:itemId", function(req, res) {
  models.Item.update({
    description: req.body.description,
    cost: req.body.cost,
    qty: req.body.qty}, {
      where: {id: req.params.itemId}
    })
    .then(function(data) {
      data = {"status": "success", data: data};
      res.setHeader("Content-Type", "application/json");
      res.status(201).json(data);
    })
    .catch(function(err) {
      err = {"status": "fail", error: err};
      res.status(500).send(err);
    })
});


module.exports = router;
