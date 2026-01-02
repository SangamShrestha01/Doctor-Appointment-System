import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "./model/user.model.js";
import { DoctorProfile } from "./model/doctor.model.js";

dotenv.config();

/* ---------- DB CONNECTION ---------- */
export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected");
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};
const specialities = [
    "Cardiologist",
    "Dermatologist",
    "Neurologist",
    "Orthopedic",
    "Pediatrician",
    "Psychiatrist",
    "Gynecologist",
    "ENT Specialist",
    "Urologist",
    "Gastroenterologist",
];


/* ---------- SEED DATA ---------- */
// const seedDoctors = async () => {
//     try {
//         await connectDB();

//         // Clean previous data (optional but recommended)
//         await User.deleteMany({ role: "Doctor" });
//         await DoctorProfile.deleteMany();

//         const doctors = [];

//         for (let i = 0; i < 10; i++) {
//             /* ---- Create User ---- */
//             const user = await User.create({
//                 name: `Dr. Doctor ${i + 1}`,
//                 email: `doctor${i + 1}@mail.com`,
//                 password: "password123",
//                 address: "Kathmandu, Nepal",
//                 role: "Doctor",
//                 image: `https://i.pravatar.cc/150?img=${i + 10}`,
//             });

//             /* ---- Create Doctor Profile ---- */
//             const profile = await DoctorProfile.create({
//                 user: user._id,
//                 speciality: specialities[i],
//                 degree: "MBBS, MD",
//                 experience: Math.floor(Math.random() * 15) + 1,
//                 fees: Math.floor(Math.random() * 500) + 300,
//                 address: {
//                     city: "Kathmandu",
//                     hospital: "City Care Hospital",
//                 },
//                 availability: {
//                     Monday: ["10:00", "12:00", "15:00"],
//                     Wednesday: ["11:00", "14:00"],
//                     Friday: ["09:00", "13:00"],
//                 },
//                 image: user.image,
//             });

//             doctors.push({ user, profile });
//         }

//         console.log("✅ Doctors seeded successfully:", doctors.length);
//         process.exit();
//     } catch (error) {
//         console.error("❌ Seeding failed:", error);
//         process.exit(1);
//     }
// };

// seedDoctors();
