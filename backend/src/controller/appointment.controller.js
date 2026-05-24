import { DoctorProfile } from "../model/doctor.model.js";
import { Appointment } from "../model/appointment.model.js";
import AppError from "../utils/appError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

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

  const doctor = await DoctorProfile.findById(doctorId).populate(
    "user", "name email image role"
  );

  if (!doctor) return next(new AppError(404, "Doctor not found"));
  if (!doctor.user || doctor.user.role !== "Doctor") {
    return next(new AppError(400, "Invalid doctor profile"));
  }

  const mapKey = Array.from(doctor.availability.keys()).find(
    (k) => k.toLowerCase() === weekday.toLowerCase()
  );
  const availableSlots = mapKey ? doctor.availability.get(mapKey) : [];

  if (!availableSlots.includes(time)) {
    return next(new AppError(400, `Time slot "${time}" not available on ${weekday}`));
  }

  const capitalizedWeekday = mapKey ||
    weekday.charAt(0).toUpperCase() + weekday.slice(1).toLowerCase();

  const today = new Date();
  let appointmentDate = new Date(today);

  const weekdayIndex = [
    "Sunday", "Monday", "Tuesday", "Wednesday",
    "Thursday", "Friday", "Saturday",
  ].indexOf(capitalizedWeekday);

  while (
    appointmentDate.getDay() !== weekdayIndex ||
    appointmentDate <= today
  ) {
    appointmentDate.setDate(appointmentDate.getDate() + 1);
  }

  const [hours, minutes] = time.split(":").map(Number);
  appointmentDate.setHours(hours, minutes, 0, 0);

  // ✅ Check both capitalized and lowercase cancelled
  const existingAppointment = await Appointment.findOne({
    doctor: doctor._id,
    appointmentDateTime: {
      $gte: appointmentDate,
      $lt: new Date(appointmentDate.getTime() + 30 * 60 * 1000),
    },
    status: { $nin: ["Cancelled", "cancelled"] },
  });

  if (existingAppointment) {
    return next(new AppError(400, "This time slot is already booked"));
  }

  const appointment = await Appointment.create({
    patient: currentUser.id,
    doctor: doctor._id,
    date: appointmentDate.toISOString().split("T")[0],
    time,
    appointmentDateTime: appointmentDate,
    fees: doctor.fees,
    reason: reason || "General consultation",
    status: "Pending",
  });

  const populatedAppointment = await Appointment.findById(appointment._id)
    .populate("patient", "name email image phone address")
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
 * 2️⃣ Get My Appointments (Patient)
 */
export const getMyAppointments = asyncHandler(async (req, res, next) => {
  const currentUser = getCurrentUser(req);
  if (!currentUser) return next(new AppError(401, "Login required"));

  const appointments = await Appointment.find({ patient: currentUser.id })
    .populate("patient", "name email image phone")
    .populate({
      path: "doctor",
      populate: { path: "user", select: "name email image role speciality" },
    })
    .sort({ appointmentDateTime: -1 });

  // ✅ Removed toLowerCase — keep original capitalized status
  const normalized = appointments.map((a) => ({
    ...a.toObject(),
    doctor: a.doctor
      ? {
          ...a.doctor.toObject(),
          user: a.doctor.user || { name: "Doctor not available", image: "" },
        }
      : null,
  }));

  res.status(200).json({
    success: true,
    count: normalized.length,
    data: normalized,
  });
});

/**
 * 3️⃣ Get Doctor Appointments
 */
export const getDoctorAppointments = asyncHandler(async (req, res, next) => {
  const currentUser = getCurrentUser(req);
  if (!currentUser || currentUser.role !== "Doctor") {
    return next(new AppError(403, "Only doctors can view appointments"));
  }

  const doctorProfile = await DoctorProfile.findOne({
    user: currentUser._id,
  }).populate("user", "name email image role");

  if (!doctorProfile) {
    return next(new AppError(404, "Doctor profile not found"));
  }

  const appointments = await Appointment.find({ doctor: doctorProfile._id })
    .populate("patient", "name email image phone address")
    .populate({
      path: "doctor",
      populate: { path: "user", select: "name email image role speciality" },
    })
    .sort({ appointmentDateTime: 1 });

  // ✅ Removed toLowerCase — keep original capitalized status
  const normalized = appointments.map((a) => ({
    ...a.toObject(),
    doctorName: a.doctor?.user?.name || doctorProfile.user?.name || "Doctor",
    doctorImage: a.doctor?.user?.image || doctorProfile.user?.image || "",
  }));

  res.status(200).json({
    success: true,
    count: normalized.length,
    data: normalized,
  });
});

/**
 * 4️⃣ Update Appointment Status (Doctor)
 */
export const updateAppointmentStatus = asyncHandler(async (req, res, next) => {
  const currentUser = getCurrentUser(req);
  if (!currentUser || currentUser.role !== "Doctor") {
    return next(new AppError(403, "Only doctors can update status"));
  }

  const { appointmentId } = req.params;
  const { status, notes } = req.body;

  const doctorProfile = await DoctorProfile.findOne({ user: currentUser._id });
  if (!doctorProfile) return next(new AppError(404, "Doctor profile not found"));

  const appointment = await Appointment.findOne({
    _id: appointmentId,
    doctor: doctorProfile._id,
  });

  if (!appointment) return next(new AppError(404, "Appointment not found"));

  appointment.status = status;
  if (notes) appointment.notes = notes;
  await appointment.save();

  const updated = await Appointment.findById(appointmentId)
    .populate("patient", "name email image")
    .populate({
      path: "doctor",
      populate: { path: "user", select: "name image" },
    });

  res.status(200).json({ success: true, data: updated });
});

/**
 * 5️⃣ Cancel Appointment (Patient)
 */
export const cancelAppointment = asyncHandler(async (req, res, next) => {
  const currentUser = getCurrentUser(req);
  if (!currentUser || currentUser.role !== "Patient") {
    return next(new AppError(403, "Only patients can cancel"));
  }

  const { appointmentId } = req.params;

  // ✅ Check both capitalized and lowercase Pending
  const appointment = await Appointment.findOne({
    _id: appointmentId,
    patient: currentUser._id,
    status: { $in: ["Pending", "pending"] },
  });

  if (!appointment) return next(new AppError(404, "Appointment not found"));

  appointment.status = "Cancelled";
  await appointment.save();

  res.status(200).json({
    success: true,
    message: "Appointment cancelled",
    data: appointment,
  });
});

/**
 * 6️⃣ Delete Appointment (Patient)
 */
export const deleteAppointment = asyncHandler(async (req, res, next) => {
  const { appointmentId } = req.params;

  const appointment = await Appointment.findById(appointmentId);
  if (!appointment) return next(new AppError(404, "Appointment not found"));

  if (appointment.patient.toString() !== req.user._id.toString()) {
    return next(new AppError(403, "Not authorized to delete this appointment"));
  }

  await Appointment.findByIdAndDelete(appointmentId);

  res.status(200).json({
    success: true,
    message: "Appointment deleted successfully",
  });
});