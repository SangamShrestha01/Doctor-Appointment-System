import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { User } from "./model/user.model.js";
import { DoctorProfile } from "./model/doctor.model.js";

dotenv.config();

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

const specialities = [
  "Cardiologist", "Dermatologist", "Neurologist", "Orthopedic Surgeon",
  "Pediatrician", "Psychiatrist", "Gynecologist", "ENT Specialist",
  "Urologist", "Gastroenterologist",
];

const nepaliDoctorNames = [
  "Ram Prasad Sharma", "Sita Kumari Thapa", "Bishnu Bahadur Gurung",
  "Laxmi Devi Shrestha", "Krishna Prasad Pokharel", "Maya Tamang",
  "Laxmi Khadka", "Sunita Magar", "Hari Kumar Basnet", "Parbati Dahal",
];

const doctorImages = [
  "https://www.nepalminute.com/uploads/posts/Dr%20Toshima%20Karki1665806173.JPG",
  "https://media.istockphoto.com/id/171296819/photo/african-american-female-doctor-holding-a-clipboard-isolated.jpg?s=612x612&w=0&k=20&c=hCJk-9gsOff8Fac04a11VMOwflMYiRXUVfAj3UTn67U=",
  "https://www.nepalmediciti.com/images/doctors/4243.jpg",
  "https://possiblehealth.org/wp-content/uploads/2015/02/021115_DrJha_headshot-1.jpg",
  "https://www.akronchildrens.org/images-general/1194080/image/medium/shrestha-sabin-md-web.png",
  "https://api.cmh.com.np/media/filer_public/ad/cf/adcf3176-472f-42d8-a991-8edbf5f738da/kovid_nepal.jpeg",
  "https://clinicone.com.np/wp-content/uploads/2019/09/Dr-Reena-Shrestha.jpg",
  "https://clinicone.com.np/wp-content/uploads/2020/05/Dr.-Mahesh-Dahal-350x300.jpg",
  "https://clinicone.com.np/wp-content/uploads/2023/12/Dr.-Nabin-Bdr-Basnet-350x300.jpg",
  "https://www.nepalmediciti.com/images/doctors/8790.jpg",
];

const seedDoctors = async () => {
  try {
    await connectDB();

    await User.deleteMany({ role: "Doctor" });
    await DoctorProfile.deleteMany({});

    console.log("✅ Cleared existing doctors. Seeding new doctors...\n");

    for (let i = 0; i < 10; i++) {
      const fullName = nepaliDoctorNames[i];

      const email =
        fullName.toLowerCase()
          .replace(/\s+/g, ".")
          .replace(/[^a-z.]/g, "") + "@hospital.np";

      const hashedPassword = await bcrypt.hash("password123", 10);

      // ✅ No address on User
      const user = await User.create({
        name: `Dr. ${fullName}`,
        email,
        password: hashedPassword,
        image: doctorImages[i],
        role: "Doctor",
      });

      // ✅ Address always saved as object on DoctorProfile
      await DoctorProfile.create({
        user: user._id,
        speciality: specialities[i],
        degree: i % 2 === 0 ? "MBBS, MD" : "MBBS, MS/MD",
        experience: Math.floor(Math.random() * 20) + 5,
        fees: Math.floor(Math.random() * 800) + 400,
        address: {
          city: "Kathmandu",
          hospital:
            i % 3 === 0 ? "Grande International Hospital"
            : i % 3 === 1 ? "Norvic International Hospital"
            : "Tribhuvan University Teaching Hospital",
        },
        availability: {
          Monday:    ["09:00", "11:00", "14:00", "16:00"],
          Tuesday:   ["10:00", "13:00", "15:00"],
          Wednesday: ["09:00", "12:00", "16:00"],
          Thursday:  ["11:00", "14:00"],
          Friday:    ["09:00", "13:00", "17:00"],
          Saturday:  ["10:00"],
        },
      });

      console.log(`Seeded: Dr. ${fullName} — ${specialities[i]}`);
    }

    console.log("\n🎉 Successfully seeded 10 Nepali doctors!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    process.exit(1);
  }
};

// ✅ Uncomment to run, comment back after seeding
// seedDoctors();