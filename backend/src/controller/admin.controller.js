import bcrypt from "bcryptjs";
import { User } from "../model/user.model.js";
import { DoctorProfile } from "../model/doctor.model.js";
import AppError from "../utils/appError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/* =========================================================
   CREATE DOCTOR
========================================================= */
export const createDoctor = asyncHandler(async (req, res, next) => {
  const {
    name,
    email,
    password,
    address,
    image,
    speciality,
    degree,
    experience,
    fees,
    availability,
  } = req.body;

  /* ---------- VALIDATION ---------- */
  if (
    !name ||
    !email ||
    !password ||
    !speciality ||
    !degree ||
    !fees ||
    !address
  ) {
    return next(
      new AppError(400, "Please provide all required fields")
    );
  }

  /* ---------- CHECK EXISTING USER ---------- */
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return next(
      new AppError(400, "Doctor already exists with this email")
    );
  }

  /* ---------- HASH PASSWORD ---------- */
  const hashedPassword = await bcrypt.hash(password, 10);

  /* ---------- CREATE USER ---------- */
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    address:
      typeof address === "object"
        ? `${address.city}, ${address.hospital}`
        : address,
    image,
    role: "Doctor",
  });

  /* ---------- CREATE DOCTOR PROFILE ---------- */
  const doctorProfile = await DoctorProfile.create({
    user: user._id,
    speciality,
    degree,
    experience: experience || 0,
    fees,
    address,

    availability:
      availability || {
        Monday: ["09:00", "11:00"],
        Tuesday: ["10:00", "13:00"],
        Wednesday: ["09:00", "12:00"],
        Thursday: ["11:00", "14:00"],
        Friday: ["09:00", "13:00"],
        Saturday: ["10:00"],
      },
  });

  res.status(201).json({
    success: true,
    message: "Doctor created successfully",
    data: {
      user,
      doctorProfile,
    },
  });
});

/* =========================================================
   GET ALL DOCTORS
========================================================= */
export const getAllDoctors = asyncHandler(async (req, res) => {
  const doctors = await DoctorProfile.find()
    .populate("user", "name email image address role")
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
    "name email image address role"
  );

  if (!doctor) {
    return next(new AppError(404, "Doctor not found"));
  }

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

  const {
    name,
    email,
    address,
    image,
    speciality,
    degree,
    experience,
    fees,
    availability,
  } = req.body;

  /* ---------- FIND DOCTOR ---------- */
  const doctor = await DoctorProfile.findById(id);

  if (!doctor) {
    return next(new AppError(404, "Doctor not found"));
  }

  /* ---------- UPDATE USER ---------- */
  await User.findByIdAndUpdate(
    doctor.user,
    {
      ...(name && { name }),
      ...(email && { email }),
      ...(image && { image }),
      ...(address && {
        address:
          typeof address === "object"
            ? `${address.city}, ${address.hospital}`
            : address,
      }),
    },
    { new: true }
  );

  /* ---------- UPDATE DOCTOR PROFILE ---------- */
  const updatedDoctor = await DoctorProfile.findByIdAndUpdate(
    id,
    {
      ...(speciality && { speciality }),
      ...(degree && { degree }),
      ...(experience !== undefined && { experience }),
      ...(fees !== undefined && { fees }),
      ...(address && { address }),
      ...(availability && { availability }),
    },
    { new: true }
  ).populate("user", "name email image address role");

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

  /* ---------- FIND DOCTOR ---------- */
  const doctor = await DoctorProfile.findById(id);

  if (!doctor) {
    return next(new AppError(404, "Doctor not found"));
  }

  /* ---------- DELETE USER ---------- */
  await User.findByIdAndDelete(doctor.user);

  /* ---------- DELETE DOCTOR PROFILE ---------- */
  await DoctorProfile.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: "Doctor deleted successfully",
  });
});