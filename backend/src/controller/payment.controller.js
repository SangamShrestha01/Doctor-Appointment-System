import { generateRandomString, generateEsewaForm } from "../utils/esewa.js";
import { DoctorProfile } from "../model/doctor.model.js";
import { Payment } from "../model/payment.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Appointment } from "../model/appointment.model.js";

// Initiate eSewa payment
export const initiatePayment = asyncHandler(async (req, res) => {
    const { appointmentId } = req.body;

    const appointment = await Appointment.findById(appointmentId).populate("doctor");
    if (!appointment) return res.status(404).json({ success: false, message: "Appointment not found" });

    const transactionId = generateRandomString();

    const payment = await Payment.create({
        appointment: appointment._id,
        patient: appointment.patient,
        amount: appointment.fees,
        status: "Pending",
        transactionId,
    });

    const formHtml = generateEsewaForm({
        amount: appointment.fees,
        transactionId: payment._id,
        successUrl: `http://localhost:3000/api/payments/esewa/success?pid=${payment._id}`,
        failureUrl: `http://localhost:3000/api/payments/esewa/failure?pid=${payment._id}`
    });

    res.send(formHtml); // Browser will open this form
});


// Success callback
export const esewaSuccess = asyncHandler(async (req, res) => {
    const { pid } = req.query; // Payment ID from eSewa

    // Find the payment and populate appointment
    const payment = await Payment.findById(pid).populate({
        path: "appointment",
        populate: { path: "doctor" }
    });

    if (!payment)
        return res.status(404).json({ success: false, message: "Payment not found" });

    console.log("payment", payment);

    // Mark payment as paid
    payment.status = "Paid";
    payment.paidAt = new Date();
    await payment.save();

    const appointmentData = payment.appointment;
    if (!appointmentData || !appointmentData.doctor) {
        return res.status(400).json({
            success: false,
            message: "Incomplete appointment info",
        });
    }

    // Update appointment status
    appointmentData.status = "Completed";
    await appointmentData.save();

    // Mark doctor's slot as booked
    const doctor = appointmentData.doctor;
    if (!doctor.slot_booked) doctor.slot_booked = [];
    doctor.slot_booked.push(`${appointmentData.date}-${appointmentData.time}`);
    await doctor.save();

    res.status(201).json({
        success: true,
        message: "Payment successful & appointment confirmed",
        data: appointmentData,
    });
});



// Failure callback
export const esewaFailure = asyncHandler(async (req, res) => {
    res.status(400).json({ success: false, message: "Payment failed" });
});
