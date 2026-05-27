import bcrypt from "bcryptjs";
import { User } from "../model/user.model.js";
import { DoctorProfile } from "../model/doctor.model.js";
import { Appointment } from "../model/appointment.model.js";
import AppError from "../utils/appError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getDataUri } from "../utils/dataUri.js";
import cloudinary from "../utils/cloudinary.js";

/* =========================================================
   CREATE DOCTOR
========================================================= */
export const createDoctor = asyncHandler(async (req, res, next) => {
  const { name, email, password, speciality, degree, experience, fees, availability } = req.body;

  // ✅ Parse address — frontend sends it as JSON string via FormData
  const address =
    typeof req.body.address === "string"
      ? JSON.parse(req.body.address)
      : req.body.address;

  if (!name || !email || !password || !speciality || !degree || !fees || !address?.hospital || !address?.city) {
    return next(new AppError(400, "Please provide all required fields"));
  }

  const existingUser = await User.findOne({ email });
  if (existingUser)
    return next(new AppError(400, "Doctor already exists with this email"));

  // ✅ Handle image upload via multer + cloudinary
  let imageUrl = "";
  if (req.file) {
    const fileUri = getDataUri(req.file);
    const result = await cloudinary.uploader.upload(fileUri.content, {
      folder: "doctors",
    });
    imageUrl = result.secure_url;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    image: imageUrl,
    role: "Doctor",
  });

  const doctorProfile = await DoctorProfile.create({
    user: user._id,
    speciality,
    degree,
    experience: experience || 0,
    fees,
    address: {
      hospital: address.hospital,
      city: address.city,
    },
    availability: availability || {
      Monday:    ["09:00", "11:00"],
      Tuesday:   ["10:00", "13:00"],
      Wednesday: ["09:00", "12:00"],
      Thursday:  ["11:00", "14:00"],
      Friday:    ["09:00", "13:00"],
      Saturday:  ["10:00"],
    },
  });

  res.status(201).json({
    success: true,
    message: "Doctor created successfully",
    data: { user, doctorProfile },
  });
});

/* =========================================================
   GET ALL DOCTORS
========================================================= */
export const getAllDoctors = asyncHandler(async (req, res) => {
  const doctors = await DoctorProfile.find()
    .populate("user", "name email image role")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    totalDoctors: doctors.length,
    data: doctors,
  });
});

/* =========================================================
   GET SINGLE DOCTOR
========================================================= */
export const getDoctorById = asyncHandler(async (req, res, next) => {
  const doctor = await DoctorProfile.findById(req.params.id).populate(
    "user",
    "name email image role"
  );

  if (!doctor) return next(new AppError(404, "Doctor not found"));

  res.status(200).json({
    success: true,
    data: doctor,
  });
});

/* =========================================================
   UPDATE DOCTOR
========================================================= */
export const updateDoctor = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name, email, speciality, degree, experience, fees, availability } = req.body;

  // ✅ Parse address — frontend sends it as JSON string via FormData
  const address =
    typeof req.body.address === "string"
      ? JSON.parse(req.body.address)
      : req.body.address;

  const doctor = await DoctorProfile.findById(id);
  if (!doctor) return next(new AppError(404, "Doctor not found"));

  // ✅ Handle image upload via multer + cloudinary
  let imageUrl;
  if (req.file) {
    const fileUri = getDataUri(req.file);
    const result = await cloudinary.uploader.upload(fileUri.content, {
      folder: "doctors",
    });
    imageUrl = result.secure_url;
  }

  await User.findByIdAndUpdate(
    doctor.user,
    {
      ...(name     && { name }),
      ...(email    && { email }),
      ...(imageUrl && { image: imageUrl }), // only update if a new file was uploaded
    },
    { new: true }
  );

  const updatedDoctor = await DoctorProfile.findByIdAndUpdate(
    id,
    {
      ...(speciality               && { speciality }),
      ...(degree                   && { degree }),
      ...(experience !== undefined && { experience }),
      ...(fees !== undefined       && { fees }),
      ...(availability             && { availability }),
      ...(address?.hospital && address?.city && {
        address: {
          hospital: address.hospital,
          city: address.city,
        },
      }),
    },
    { new: true }
  ).populate("user", "name email image role");

  res.status(200).json({
    success: true,
    message: "Doctor updated successfully",
    data: updatedDoctor,
  });
});

/* =========================================================
   DELETE DOCTOR
========================================================= */
export const deleteDoctor = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const doctor = await DoctorProfile.findById(id);
  if (!doctor) return next(new AppError(404, "Doctor not found"));

  await User.findByIdAndDelete(doctor.user);
  await DoctorProfile.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: "Doctor deleted successfully",
  });
});

/* =========================================================
   GET ALL APPOINTMENTS (ADMIN)
========================================================= */
export const getAllAppointments = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find()
    .populate("patient", "name email image")
    .populate({
      path: "doctor",
      populate: { path: "user", select: "name email image" },
    })
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    total: appointments.length,
    data: appointments,
  });
});

/* =========================================================
   DELETE APPOINTMENT (ADMIN)
========================================================= */
export const deleteAppointment = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const appointment = await Appointment.findById(id);
  if (!appointment) return next(new AppError(404, "Appointment not found"));

  await Appointment.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: "Appointment deleted successfully",
  });
});

/* =========================================================
   GET ALL PATIENTS (ADMIN)
========================================================= */
export const getAllPatients = asyncHandler(async (req, res) => {
  const patients = await User.find({ role: "Patient" }).select(
    "name email image address createdAt"
  );

  res.status(200).json({
    success: true,
    total: patients.length,
    data: patients,
  });
});