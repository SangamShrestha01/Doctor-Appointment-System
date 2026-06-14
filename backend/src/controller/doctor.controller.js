import { User } from "../model/user.model.js";
import { DoctorProfile } from "../model/doctor.model.js";
import AppError from "../utils/appError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getDataUri } from "../utils/dataUri.js";
import cloudinary from "../utils/cloudinary.js";
import ApiFeatures from "../utils/apiFeatures.js";

// ✅ DEFAULT IMAGE
const DEFAULT_DOCTOR_IMAGE =
  "https://cdn-icons-png.flaticon.com/512/387/387561.png";

// ================= GET CURRENT USER =================
const getCurrentUser = (req) => req.user;

// ================= CREATE DOCTOR PROFILE =================
export const createDoctorProfile = asyncHandler(async (req, res, next) => {
  const currentUser = getCurrentUser(req);

  if (!currentUser || currentUser.role !== "Doctor") {
    return next(new AppError(403, "Only doctors can create a profile"));
  }

  const { speciality, degree, experience, fees, address, availability } =
    req.body;

  if (!speciality || !degree || !fees || !address || !availability) {
    return next(new AppError(400, "All required fields must be provided"));
  }

  const existingProfile = await DoctorProfile.findOne({
    user: currentUser._id,
  });

  if (existingProfile) {
    return next(new AppError(400, "Doctor profile already exists"));
  }

  let imageUrl = currentUser.image;

  if (req.file) {
    const fileUri = getDataUri(req.file);
    const result = await cloudinary.uploader.upload(fileUri.content);
    imageUrl = result.secure_url;

    await User.findByIdAndUpdate(currentUser._id, { image: imageUrl });
  }

  const doctorProfile = await DoctorProfile.create({
    user: currentUser._id,
    speciality,
    degree,
    experience: experience || 0,
    fees,
    address,
    availability,
  });

  await User.findByIdAndUpdate(currentUser._id, {
    doctorProfile: doctorProfile._id,
  });

  res.status(201).json({
    success: true,
    message: "Doctor profile created successfully",
    data: doctorProfile,
  });
});

// ================= DOCTOR DASHBOARD =================
export const doctorDashboard = asyncHandler(async (req, res) => {
  const doctorId = req.user._id;

  const profile = await DoctorProfile.findOne({ user: doctorId }).populate(
    "user",
    "name email image address"
  );

  if (!profile) {
    return res.status(404).json({
      success: false,
      message: "Doctor profile not found",
    });
  }

  res.status(200).json({
    success: true,
    data: {
      doctor: profile,
    },
  });
});

// ================= GET ALL DOCTORS =================
export const getDoctors = asyncHandler(async (req, res) => {
  const totalFeatures = new ApiFeatures(
    DoctorProfile.find().populate("user", "name image"),
    req.query
  )
    .filter()
    .sort();

  const totalCount = await totalFeatures.query.countDocuments();

  const features = new ApiFeatures(
    DoctorProfile.find()
      .populate("user", "name image")
      .select("speciality degree fees"),
    req.query
  )
    .filter()
    .sort()
    .paginate();

  const doctors = await features.query;

  const formattedDoctors = doctors.map((doc) => ({
    id: doc._id,
    name: doc.user?.name || "Unknown Doctor",
    image: doc.user?.image || DEFAULT_DOCTOR_IMAGE,
    speciality: doc.speciality,
    degree: doc.degree,
    fees: doc.fees,
  }));

  res.status(200).json({
    success: true,
    count: formattedDoctors.length,
    totalCount,
    data: formattedDoctors,
  });
});

// ================= GET DOCTOR BY ID =================
export const getDoctorById = asyncHandler(async (req, res, next) => {
  const doctor = await DoctorProfile.findById(req.params.id).populate(
    "user",
    "-password"
  );

  if (!doctor) {
    return next(new AppError(404, "Doctor not found"));
  }

  res.status(200).json({
    success: true,
    data: doctor,
  });
});

// ================= UPDATE DOCTOR PROFILE (FIXED) =================
export const updateDoctorProfile = asyncHandler(async (req, res, next) => {
  const currentUser = getCurrentUser(req);

  const { name, address, speciality, experience, fees } = req.body;

  // ================= UPDATE USER =================
  let updatedUser = await User.findById(currentUser._id);

  if (name || address) {
    updatedUser = await User.findByIdAndUpdate(
      currentUser._id,
      {
        ...(name && { name }),
        ...(address && { address }),
      },
      { new: true }
    );
  }

  // ================= IMAGE UPDATE =================
  if (req.file) {
    const fileUri = getDataUri(req.file);
    const result = await cloudinary.uploader.upload(fileUri.content);

    updatedUser = await User.findByIdAndUpdate(
      currentUser._id,
      { image: result.secure_url },
      { new: true }
    );
  }

  // ================= UPDATE DOCTOR PROFILE =================
  const doctorFields = {
    ...(speciality && { speciality }),
    ...(experience !== undefined && { experience }),
    ...(fees !== undefined && { fees }),
  };

  const profile = await DoctorProfile.findOneAndUpdate(
    { user: currentUser._id },
    { $set: doctorFields },
    { new: true, upsert: true }
  );

  // ================= FINAL RESPONSE =================
  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    data: {
      user: updatedUser,   // 🔥 CRITICAL FIX
      doctor: profile,
    },
  });
});