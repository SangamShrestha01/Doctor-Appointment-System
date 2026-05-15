import { generateEsewaForm, generateTransactionUUID } from "../utils/esewa.js";
import { Payment } from "../model/payment.js";
import { Appointment } from "../model/appointment.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Initiate eSewa payment
export const initiatePayment = asyncHandler(async (req, res) => {
    const { appointmentId } = req.body;
    if (!appointmentId) return res.status(400).json({ success: false, message: "appointmentId is required" });

    const appointment = await Appointment.findById(appointmentId)
        .populate("doctor", "fees")
        .populate("patient", "name email");

    if (!appointment) return res.status(404).json({ success: false, message: "Appointment not found" });

    const transaction_uuid = generateTransactionUUID();

    const payment = await Payment.create({
        appointment: appointment._id,
        patient: appointment.patient._id,
        amount: appointment.fees,
        status: "Pending",
        transaction_uuid,
    });

    const form = generateEsewaForm({
        amount: appointment.fees,
        transaction_uuid,
        success_url: `http://localhost:3000/api/payment/esewa/success?pid=${payment._id}`,
        failure_url: `http://localhost:3000/api/payment/esewa/failure?pid=${payment._id}`,
    });

    res.json({ success: true, data: form });
});

// Success callback
// export const esewaSuccess = asyncHandler(async (req, res) => {
//     const { pid } = req.query; // Payment ID
//     const payment = await Payment.findById(pid).populate("appointment");

//     if (!payment) return res.status(404).json({ success: false, message: "Payment not found" });

//     payment.status = "Paid";
//     payment.paidAt = new Date();
//     await payment.save();

//     // Update appointment
//     if (payment.appointment) {
//         payment.appointment.status = "Completed";
//         await payment.appointment.save();
//     }
//     return res.redirect(`http://localhost:5173/payment-success?pid=${payment._id}`);


// });

import mongoose from "mongoose";

export const esewaSuccess = asyncHandler(async (req, res) => {
    const rawPid = req.query.pid;
    const pid = rawPid?.split("?")[0];


    if (!mongoose.Types.ObjectId.isValid(pid)) {
        return res.status(400).json({
            success: false,
            message: "Invalid payment ID"
        });
    }

    const payment = await Payment.findById(pid).populate("appointment");
    if (!payment) {
        return res.status(404).json({ success: false, message: "Payment not found" });
    }

    payment.status = "Paid";
    payment.paidAt = new Date();
    await payment.save();

    if (payment.appointment) {
        payment.appointment.status = "Completed";
        await payment.appointment.save();
    }

    return res.redirect(
        `http://localhost:5173/payment-success?pid=${payment._id}`
    );
});


// Failure callback

export const esewaFailure = asyncHandler(async (req, res) => {
    res.status(400).json({ success: false, message: "Payment failed or cancelled" });
});