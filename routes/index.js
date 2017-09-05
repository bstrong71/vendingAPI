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

});

//purchase an item
router.post("/api/customer/items/:itemId/purchases", function(req, res) {

});

//get a list of all purchases with their item and date/time
router.get("/api/vendor/purchases", function(req, res) {

});

//get a total amount of money accepted by the machine
router.get("/api/vendor/money", function(req, res) {

});

//add a new item not previously existing in the machine
router.post("/api/vendor/items", function(req, res) {

});

//update item quantity, description, and cost
router.put("/api/vendor/items/:itemId", function(req, res) {

});


module.exports = router;
