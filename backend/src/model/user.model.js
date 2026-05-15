import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // Hide password by default
    },

    address: {
      type: String,
      default: "",
      trim: true,
    },

    image: {
      type: String,
      default:
        "https://cdn-icons-png.flaticon.com/512/387/387561.png",
    },

    role: {
      type: String,
      enum: ["Admin", "Patient", "Doctor"],
      default: "Patient",
    },
  },
  {
    timestamps: true,
  }
);

/* ---------- PASSWORD COMPARE METHOD ---------- */
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

/* ---------- REMOVE PASSWORD FROM RESPONSE ---------- */
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

export const User = mongoose.model("User", userSchema);