import { DoctorProfile } from "../model/doctor.model.js";
import AppError from "../utils/appError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Appointment } from "../model/appointment.model.js";

// Helper to get current logged-in user
const getCurrentUser = (req) => req.user;

// 1. Book Appointment (Patient only)
export const bookAppointment = asyncHandler(async (req, res, next) => {
    const currentUser = getCurrentUser(req);
    console.log("currentUser", currentUser);
    if (!currentUser || currentUser.role !== "Patient") {
        return next(new AppError(403, "Only patients can book appointments"));
    }

    const { doctorId, date, time, reason } = req.body;
    if (!doctorId || !date || !time) {
        return next(new AppError(400, "Doctor ID, date, and time are required"));
    }

    const doctor = await DoctorProfile.findById(doctorId)
        .populate("user", "-password");

    if (!doctor) return next(new AppError(404, "Doctor not found"));
    if (doctor.user.role !== "Doctor") return next(new AppError(400, "Not a doctor"));

    const dateObj = new Date(date);
    const dayIndex = dateObj.getDay();
    const weekdays = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    const weekday = weekdays[dayIndex];

    const availableSlots = doctor.availability.get(weekday) || [];
    if (!availableSlots.includes(time)) {
        return next(new AppError(400, "This time slot is not available for this weekday"));
    }

    const slotKey = `${date}-${time}`;
    if (doctor.slot_booked.includes(slotKey)) {
        return next(new AppError(400, "This time slot is already booked"));
    }

    const appointmentDateTime = new Date(`${date}T${time}:00`);
    if (isNaN(appointmentDateTime.getTime())) {
        return next(new AppError(400, "Invalid date or time format"));
    }
    console.log("jajajjaj", currentUser._id);

    const appointment = await Appointment.create({
        patient: currentUser.id,
        doctor: doctor._id,
        date,
        time,
        appointmentDateTime,
        fees: doctor.fees,
        reason,
        status: "Pending",
    });

    doctor.slot_booked.push(slotKey);
    await doctor.save();

    const populatedAppointment = await Appointment.findById(appointment._id)
        .populate("patient", "name email image")
        .populate("doctor", "user");

    res.status(201).json({
        success: true,
        message: "Appointment booked successfully",
        data: populatedAppointment,
    });
});

export const getMyAppointments = asyncHandler(async (req, res, next) => {
    const currentUser = getCurrentUser(req);
    if (!currentUser) return next(new AppError(401, "Login required"));

    const appointments = await Appointment.find({
        patient: currentUser.id,
    })
        .populate("doctor", "name image")
        .populate({
            path: "doctor",
            populate: { path: "doctorProfile", select: "speciality fees" },
        })
        .sort({ appointmentDateTime: -1 });

    res.status(200).json({
        success: true,
        count: appointments.length,
        data: appointments,
    });
});

// 3. Get Appointments for Doctor (Doctor's dashboard)
export const getDoctorAppointments = asyncHandler(async (req, res, next) => {
    const currentUser = getCurrentUser(req);
    if (!currentUser || currentUser.role !== "Doctor") {
        return next(new AppError(403, "Only doctors can view their appointments"));
    }

    const appointments = await Appointment.find({
        doctor: currentUser._id,
    })
        .populate("patient", "name email image address")
        .sort({ appointmentDateTime: 1 });

    res.status(200).json({
        success: true,
        count: appointments.length,
        data: appointments,
    });
});

// 4. Update Appointment Status (Doctor only: Approve/Cancel/Complete)
export const updateAppointmentStatus = asyncHandler(async (req, res, next) => {
    const currentUser = getCurrentUser(req);
    if (!currentUser || currentUser.role !== "Doctor") {
        return next(new AppError(403, "Only doctors can update appointment status"));
    }

    const { appointmentId } = req.params;
    const { status, notes } = req.body;

    if (!["Approved", "Cancelled", "Completed"].includes(status)) {
        return next(new AppError(400, "Invalid status"));
    }

    const appointment = await Appointment.findOne({
        _id: appointmentId,
        doctor: currentUser._id,
    });

    if (!appointment) {
        return next(new AppError(404, "Appointment not found"));
    }

    if (appointment.status !== "Pending" && status !== "Completed") {
        return next(new AppError(400, "Only pending appointments can be approved/cancelled"));
    }

    appointment.status = status;
    if (notes) appointment.notes = notes;

    await appointment.save();

    // If cancelled, free up the slot
    if (status === "Cancelled") {
        const doctorProfile = await DoctorProfile.findOne({ user: currentUser._id });
        if (doctorProfile) {
            const slotKey = `${appointment.date}-${appointment.time}`;
            doctorProfile.slot_booked = doctorProfile.slot_booked.filter(
                (slot) => slot !== slotKey
            );
            await doctorProfile.save();
        }
    }

    res.status(200).json({
        success: true,
        message: `Appointment ${status.toLowerCase()} successfully`,
        data: appointment,
    });
});

// 5. Cancel Appointment (Patient only)
export const cancelAppointment = asyncHandler(async (req, res, next) => {
    const currentUser = getCurrentUser(req);
    if (!currentUser || currentUser.role !== "Patient") {
        return next(new AppError(403, "Only patients can cancel appointments"));
    }

    const appointment = await Appointment.findOne({
        _id: req.params.appointmentId,
        patient: currentUser._id,
        status: "Pending",
    });

    if (!appointment) {
        return next(new AppError(404, "Pending appointment not found"));
    }

    appointment.status = "Cancelled";
    await appointment.save();

    // Free up slot
    const doctorProfile = await DoctorProfile.findOne({ user: appointment.doctor });
    if (doctorProfile) {
        const slotKey = `${appointment.date}-${appointment.time}`;
        doctorProfile.slot_booked = doctorProfile.slot_booked.filter(
            (slot) => slot !== slotKey
        );
        await doctorProfile.save();
    }

    res.status(200).json({
        success: true,
        message: "Appointment cancelled successfully",
    });
});