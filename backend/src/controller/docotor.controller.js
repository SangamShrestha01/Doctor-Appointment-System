import { User } from "../model/user.model.js";
import { DoctorProfile } from "../model/doctor.model.js";
import AppError from "../utils/appError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getDataUri } from "../utils/dataUri.js";
import cloudinary from "../utils/cloudinary.js";

const getCurrentUser = (req) => req.user;

export const createDoctorProfile = asyncHandler(async (req, res, next) => {
    const currentUser = getCurrentUser(req);

    if (!currentUser || currentUser.role !== "Doctor") {
        return next(new AppError(403, "Only doctors can create a profile"));
    }

    const { speciality, degree, experience, fees, address, availability } = req.body;

    if (!speciality || !degree || !fees || !address || !availability) {
        return next(new AppError(400, "All required fields must be provided"));
    }

    const existingProfile = await DoctorProfile.findOne({ user: currentUser._id });
    if (existingProfile) {
        return next(new AppError(400, "Doctor profile already exists"));
    }

    let imageUrl = null;
    if (req.file) {
        const fileUri = getDataUri(req.file);
        const result = await cloudinary.uploader.upload(fileUri.content);
        imageUrl = result.secure_url;
    }

    const doctorProfile = await DoctorProfile.create({
        user: currentUser._id,
        speciality,
        degree,
        experience: experience || 0,
        fees,
        address,
        availability,
        image: imageUrl,
    });

    // Update user with profile info
    await User.findByIdAndUpdate(currentUser._id, {
        doctorProfile: doctorProfile._id,
        image: imageUrl || currentUser.image,
    });

    res.status(201).json({
        success: true,
        message: "Doctor profile created successfully",
        data: doctorProfile,
    });
});

// ------------------------------
// Get All Doctors
// ------------------------------
export const getDoctors = asyncHandler(async (req, res) => {
    const doctors = await DoctorProfile.find()
    res.status(200).json({
        success: true,
        count: doctors.length,
        data: doctors,
    });
});

// ------------------------------
// Get Doctor by ID
// ------------------------------
export const getDoctorById = asyncHandler(async (req, res, next) => {
    const doctor = await DoctorProfile.findById(req.params.id).populate("user", "-password");

    if (!doctor) {
        return next(new AppError(404, "Doctor not found"));
    }

    res.status(200).json({
        success: true,
        data: doctor,
    });
});

// ------------------------------
// Update Doctor Profile
// ------------------------------
export const updateDoctorProfile = asyncHandler(async (req, res, next) => {
    const currentUser = getCurrentUser(req);

    if (!currentUser || currentUser.role !== "Doctor") {
        return next(new AppError(403, "Access denied"));
    }

    const profile = await DoctorProfile.findOne({ user: currentUser._id });
    if (!profile) return next(new AppError(404, "Profile not found"));

    const { speciality, degree, experience, fees, address, availability } = req.body;

    // Update fields if provided
    if (speciality) profile.speciality = speciality;
    if (degree) profile.degree = degree;
    if (experience !== undefined) profile.experience = experience;
    if (fees) profile.fees = fees;
    if (address) profile.address = { ...profile.address, ...address };
    if (availability) profile.availability = availability;

    // Update image if uploaded
    if (req.file) {
        const fileUri = getDataUri(req.file);
        const result = await cloudinary.uploader.upload(fileUri.content);
        profile.image = result.secure_url;
        await User.findByIdAndUpdate(currentUser._id, { image: result.secure_url });
    }

    await profile.save();

    res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        data: profile,
    });
});

// ------------------------------
// Delete Doctor (Admin only)
// ------------------------------
export const deleteDoctor = asyncHandler(async (req, res, next) => {
    const currentUser = getCurrentUser(req);

    if (!currentUser || currentUser.role !== "Admin") {
        return next(new AppError(403, "Only admin can delete doctors"));
    }

    const doctorUser = await User.findById(req.params.id);
    if (!doctorUser || doctorUser.role !== "Doctor") {
        return next(new AppError(404, "Doctor not found"));
    }

    // Delete doctor profile
    await DoctorProfile.findOneAndDelete({ user: req.params.id });

    // Optionally, set role to Patient
    doctorUser.role = "Patient";
    doctorUser.doctorProfile = null;
    await doctorUser.save();

    res.status(200).json({
        success: true,
        message: "Doctor removed successfully",
    });
});
