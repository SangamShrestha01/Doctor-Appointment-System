import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./database.js";
import postRoutes from './routes/post.router.js'
import { ErrorHandler } from "./middleware/error.js";
import authRoutes from './routes/user.routes.js'
import doctorRoutes from './routes/doctor.route.js'
import appointmentRoutes from './routes/appointment.routes.js'
import paymentRoutes from './routes/paymet.routes.js'
dotenv.config();
const app = express();
connectDB();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api/posts", postRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/doctor", doctorRoutes)
app.use("/api/appointment", appointmentRoutes);
app.use("/api/payment", paymentRoutes);

app.use(ErrorHandler)



app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});








