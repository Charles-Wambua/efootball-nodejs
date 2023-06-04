const express = require("express");
const router = express.Router();

router.post("/mpesa/payments", (req, res) => {
  const phoneNumber = req.body.phoneNumber;
  const mpesaName=req.body.mpesaName
  const amount = req.body.amount;

  // Perform necessary operations with the phoneNumber and amount
  // e.g., send the payment to 0114652533

  // Send a response
  res.json({
    message: "Payment sent successfully!",
    phoneNumber,
    mpesaName,
    amount,
  });
});

module.exports = router;
