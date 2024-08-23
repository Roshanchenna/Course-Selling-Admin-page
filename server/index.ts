import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import adminRouter from "./routes/admin";
import userRouter from "./routes/user";
import { authenticateJwt, SECRET } from "./middleware/auth";
import { Course } from "./db";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/admin", adminRouter)
app.use("/user", userRouter)

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/courses', {dbName: "courses" }).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.log("Error connecting to MongoDB", err);
});

// Route to get all published courses
app.get('/courses', authenticateJwt, async (req, res) => {
    try {
        const courses = await Course.find({published: true}).populate('creator', 'username');
        res.json({ courses });
    } catch (error) {
        res.status(500).json({ message: "Error fetching courses"});
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));