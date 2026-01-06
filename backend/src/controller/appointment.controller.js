import { DoctorProfile } from "../model/doctor.model.js";
import { Appointment } from "../model/appointment.model.js";
import AppError from "../utils/appError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Helper to get logged-in user
const getCurrentUser = (req) => req.user;

/**
 * 1️⃣ Book Appointment (Patient only)
 */
export const bookAppointment = asyncHandler(async (req, res, next) => {
    const currentUser = getCurrentUser(req);
    if (!currentUser || currentUser.role !== "Patient") {
        return next(new AppError(403, "Only patients can book appointments"));
    }

    const { doctorId, weekday, time, reason } = req.body;
    if (!doctorId || !weekday || !time) {
        return next(new AppError(400, "Doctor ID, weekday, and time are required"));
    }

    // Find doctor profile
    const doctor = await DoctorProfile.findById(doctorId).populate("user", "-password");
    if (!doctor) return next(new AppError(404, "Doctor not found"));
    if (doctor.user.role !== "Doctor") return next(new AppError(400, "Not a doctor"));

    // Capitalize weekday
    const capitalizedWeekday = weekday.charAt(0).toUpperCase() + weekday.slice(1).toLowerCase();

    // Check available slots
    const availableSlots = doctor.availability.get(capitalizedWeekday) || [];
    if (!availableSlots.includes(time)) {
        return next(new AppError(400, `This time slot is not available on ${capitalizedWeekday}`));
    }

    // Find next date matching weekday
    const today = new Date();
    let appointmentDate = new Date(today);
    const weekdayIndex = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].indexOf(capitalizedWeekday);
    while (appointmentDate.getDay() !== weekdayIndex) {
        appointmentDate.setDate(appointmentDate.getDate() + 1);
    }

    const [hours, minutes] = time.split(":").map(Number);
    appointmentDate.setHours(hours, minutes, 0, 0);

    // Check if slot already booked
    const existingAppointment = await Appointment.findOne({
        doctor: doctor._id,
        appointmentDateTime: appointmentDate,
    });
    if (existingAppointment) {
        return next(new AppError(400, "This time slot is already booked"));
    }

    // Create appointment
    const appointment = await Appointment.create({
        patient: currentUser.id,
        doctor: doctor._id,
        date: appointmentDate.toISOString().split("T")[0],
        time,
        appointmentDateTime: appointmentDate,
        fees: doctor.fees,
        reason,
        status: "Pending",
    });

    // Save booked slot
    doctor.slot_booked.push(appointmentDate.toISOString());
    await doctor.save();

    // Populate response
    const populatedAppointment = await Appointment.findById(appointment._id)
        .populate("patient", "name email image")
        .populate({
            path: "doctor",
            populate: { path: "user", select: "name email image role" },
        });

    res.status(201).json({
        success: true,
        message: "Appointment booked successfully",
        data: populatedAppointment,
    });
});

/**
 * 2️⃣ Get Appointments of current patient
 */
export const getMyAppointments = asyncHandler(async (req, res, next) => {
    const currentUser = getCurrentUser(req);
    if (!currentUser) return next(new AppError(401, "Login required"));

    const appointments = await Appointment.find({ patient: currentUser.id })
        .populate("patient", "name email image")
        .populate({
            path: "doctor",
            populate: { path: "user", select: "name email image role" },
        })
        .sort({ appointmentDateTime: -1 });

    res.status(200).json({
        success: true,
        count: appointments.length,
        data: appointments,
    });
});

/**
 * 3️⃣ Get Appointments for Doctor (Doctor dashboard)
 */
export const getDoctorAppointments = asyncHandler(async (req, res, next) => {
    const currentUser = getCurrentUser(req);
    if (!currentUser || currentUser.role !== "Doctor") {
        return next(new AppError(403, "Only doctors can view their appointments"));
    }

    const doctorProfile = await DoctorProfile.findOne({ user: currentUser._id });
    if (!doctorProfile) return next(new AppError(404, "Doctor profile not found"));

    const appointments = await Appointment.find({ doctor: doctorProfile._id })
        .populate("patient", "name email image address")
        .sort({ appointmentDateTime: 1 });

    res.status(200).json({
        success: true,
        count: appointments.length,
        data: appointments,
    });
});

/**
 * 4️⃣ Update Appointment Status (Doctor only)
 */
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

    const doctorProfile = await DoctorProfile.findOne({ user: currentUser._id });
    if (!doctorProfile) return next(new AppError(404, "Doctor profile not found"));

    const appointment = await Appointment.findOne({ _id: appointmentId, doctor: doctorProfile._id });
    if (!appointment) return next(new AppError(404, "Appointment not found"));

    if (appointment.status !== "Pending" && status !== "Completed") {
        return next(new AppError(400, "Only pending appointments can be approved/cancelled"));
    }

    appointment.status = status;
    if (notes) appointment.notes = notes;
    await appointment.save();

    // Free slot if cancelled
    if (status === "Cancelled") {
        doctorProfile.slot_booked = doctorProfile.slot_booked.filter(
            slot => slot !== `${appointment.date}-${appointment.time}`
        );
        await doctorProfile.save();
    }

    res.status(200).json({
        success: true,
        message: `Appointment ${status.toLowerCase()} successfully`,
        data: appointment,
    });
});

/**
 * 5️⃣ Cancel Appointment (Patient only)
 */
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
    if (!appointment) return next(new AppError(404, "Pending appointment not found"));

    appointment.status = "Cancelled";
    await appointment.save();

    // Free slot
    const doctorProfile = await DoctorProfile.findOne({ user: appointment.doctor });
    if (doctorProfile) {
        doctorProfile.slot_booked = doctorProfile.slot_booked.filter(
            slot => slot !== `${appointment.date}-${appointment.time}`
        );
        await doctorProfile.save();
    }

    res.status(200).json({
        success: true,
        message: "Appointment cancelled successfully",
    });
});
