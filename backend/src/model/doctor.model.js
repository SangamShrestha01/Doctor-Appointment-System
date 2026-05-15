import mongoose from "mongoose";

const doctorProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    speciality: {
      type: String,
      required: true,
    },
    degree: {
      type: String,
      required: true,
    },
    experience: {
      type: Number,
      default: 0,
    },
    fees: {
      type: Number,
      required: true,
    },
    address: {
      type: Object, // you can convert this to sub-schema later
      required: true,
    },
    availability: {
      type: Map,
      of: [String],
      default: {},
    },
    slot_booked: {
      type: [String], // "YYYY-MM-DD-HH:mm"
      default: [],
    },
  },
  { timestamps: true }
);

export const DoctorProfile = mongoose.model(
  "DoctorProfile",
  doctorProfileSchema
);
