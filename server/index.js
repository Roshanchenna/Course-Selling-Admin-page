const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const adminRouter = require("./routes/admin");
const userRouter = require("./routes/user");
const { authenticateJwt, SECRET } = require("./middleware/auth");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/admin", adminRouter)
app.use("/user", userRouter)

// Connect to MongoDB
// DONT MISUSE THIS THANKYOU!!
mongoose.connect('mongodb://localhost:27017/courses', { useNewUrlParser: true, useUnifiedTopology: true, dbName: "courses" }).then(() => {
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
        res.status(500).json({ message: "Error fetching courses", error: error.message });
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));