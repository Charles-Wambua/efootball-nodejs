const express = require("express");
const router=express.Router()
const {createToken, postStk}= require("./mpesaPayments.js")

router.post("/mpesa/payments",createToken,postStk)
module.exports=router