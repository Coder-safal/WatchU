const router = require("express").Router();
const invoiceController = require("../controllers/invoice.controller");

router.route("/:userId/user").get(invoiceController.getMounthlyInvoice);


module.exports = router;