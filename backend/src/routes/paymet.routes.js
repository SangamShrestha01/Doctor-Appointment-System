import express from "express";
import { initiatePayment, esewaSuccess, esewaFailure } from "../controller/payment.controller.js";

const router = express.Router();

router.post("/initiate", initiatePayment);
router.get("/esewa/success", esewaSuccess);
router.get("/esewa/failure", esewaFailure);

export default router;
