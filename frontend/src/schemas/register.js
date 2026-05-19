import { z } from "zod";

const imageSchema = z
  .any()
  .optional()
  .refine(
    (file) =>
      !file ||
      (file instanceof FileList &&
        ["image/jpeg", "image/png", "image/jpg"].includes(file[0]?.type)),
    "Only JPEG/PNG images are allowed"
  );

const baseSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6),
});

const passwordMatch = (data) => data.password === data.confirmPassword;
const passwordMatchError = { message: "Passwords do not match", path: ["confirmPassword"] };

// ✅ Patient
export const registerSchema = baseSchema
  .extend({
    address: z.string().min(3, "Address is required"),
    image: imageSchema,
  })
  .refine(passwordMatch, passwordMatchError);

// ✅ Doctor
export const doctorRegisterSchema = baseSchema
  .extend({
    address: z.string().min(3, "Address is required"),
    image: imageSchema,
    specialization: z.string().min(2, "Specialization is required"),
    experience: z.coerce.number().min(0, "Experience is required"),
    fees: z.coerce.number().min(1, "Fees are required"),
    qualifications: z.string().min(2, "Qualifications are required"),
    hospital: z.string().min(2, "Hospital is required"),
  })
  .refine(passwordMatch, passwordMatchError);

// ✅ Admin
export const adminRegisterSchema = baseSchema
  .refine(passwordMatch, passwordMatchError);


// ✅ Updated createDoctorSchema
export const createDoctorSchema = z.object({
  name:       z.string().min(3, "Name must be at least 3 characters"),
  email:      z.string().email("Invalid email address"),
  password:   z.string().min(6, "Password must be at least 6 characters"),
  speciality: z.string().min(1, "Please select a speciality"),
  degree:     z.string().min(2, "Degree is required"),
  experience: z.coerce.number().min(0, "Experience can't be negative").max(60, "Enter a valid experience"),
  fees:       z.coerce.number().min(1, "Fees must be greater than 0"),
  hospital:   z.string().min(2, "Hospital name is required"),
  city:       z.string().min(2, "City is required"),
});