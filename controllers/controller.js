const express = require("express");
const router = express.Router();

console.log("222");

router.get("/", (request, response) => {
  console.log("bar");
  response.render("index", {});
});

module.exports = router;
