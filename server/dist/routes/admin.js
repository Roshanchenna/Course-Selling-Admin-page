"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = require("../db");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.get("/me", auth_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const adminId = req.headers["user"];
    const admin = yield db_1.Admin.findById(adminId);
    if (!admin) {
        res.json({ msg: "Admin doesn't exist" });
        return;
    }
    res.json({
        username: admin.username
    });
}));
router.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const admin = yield db_1.Admin.findOne({ username });
    if (admin) {
        res.status(403).json({ message: 'Admin already exists' });
    }
    else {
        const obj = { username: username, password: password };
        const newAdmin = new db_1.Admin(obj);
        newAdmin.save();
        const token = jsonwebtoken_1.default.sign({ id: newAdmin._id, role: 'admin' }, auth_1.SECRET, { expiresIn: '1h' });
        res.json({ message: 'Admin created successfully', token });
    }
}));
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const admin = yield db_1.Admin.findOne({ username, password });
    if (admin) {
        const token = jsonwebtoken_1.default.sign({ id: admin._id, username: admin.username }, auth_1.SECRET, { expiresIn: '1h' });
        res.json({ message: 'Logged in successfully', token });
    }
    else {
        res.status(403).json({ message: 'Invalid username or password' });
    }
}));
router.get('/courses', auth_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const adminId = req.headers["user"];
    try {
        const admin = yield db_1.Admin.findById(adminId);
        const courses = yield db_1.Course.find({ creator: admin });
        res.json({ courses });
    }
    catch (error) {
        const errorMessage = error.message;
        res.status(500).json({ message: 'Error fetching courses', error: errorMessage });
    }
}));
router.post('/courses', auth_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description, price, imageLink, published } = req.body;
        const adminId = req.headers["user"];
        const admin = yield db_1.Admin.findById(adminId);
        if (!admin) {
            console.log("req.user is undefined");
            return res.status(400).json({ message: 'User information is missing' });
        }
        if (!admin.id) {
            console.log("req.user.id is undefined. req.user:", admin);
            return res.status(400).json({ message: 'User ID is missing' });
        }
        if (!title || !description || !price || !imageLink) {
            console.log("Missing required fields");
            return res.status(400).json({ message: 'Missing required fields', missingFields: { title: !title, description: !description, price: !price, imageLink: !imageLink } });
        }
        const course = new db_1.Course({
            title,
            description,
            price,
            imageLink,
            published,
            creator: admin._id
        });
        const savedCourse = yield course.save();
        res.json({ message: 'Course created successfully', courseId: savedCourse.id });
    }
    catch (error) {
        const errorMessage = error.message;
        res.status(500).json({ message: 'Error creating course', error: errorMessage });
    }
}));
router.put('/courses/:courseId', auth_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const course = yield db_1.Course.findByIdAndUpdate(req.params.courseId, req.body, { new: true });
    if (course) {
        res.json({ message: 'Course updated successfully' });
    }
    else {
        res.status(404).json({ message: 'Course not found' });
    }
}));
router.get('/courses', auth_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const adminId = req.headers["user"];
    try {
        const admin = yield db_1.Admin.findById(adminId);
        if (!admin) {
            return res.status(403).json({ message: 'Admin not found' });
        }
        const courses = yield db_1.Course.find({ creator: admin._id });
        res.json({ courses });
    }
    catch (error) {
        const errorMessage = error.message;
        res.status(500).json({ message: 'Error fetching courses', error: errorMessage });
    }
}));
router.get('/course/:courseId', auth_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const courseId = req.params.courseId;
    const course = yield db_1.Course.findById(courseId);
    res.json({ course });
}));
router.delete('/courses/:courseId', auth_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const adminId = req.headers["user"];
    try {
        const admin = yield db_1.Admin.findById(adminId);
        if (!admin) {
            return res.status(403).json({ message: 'Admin not found' });
        }
        const courseId = req.params.courseId;
        const course = yield db_1.Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        if (course.creator.toString() !== admin._id.toString()) {
            return res.status(403).json({ message: 'You are not authorized to delete this course' });
        }
        // Remove the course from the admin's createdCourses array
        admin.createdCourses = admin.createdCourses.filter(id => id.toString() !== courseId);
        yield admin.save();
        // Delete the course
        yield db_1.Course.findByIdAndDelete(courseId);
        res.json({ message: 'Course deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting course:', error);
        const errorMessage = error.message;
        res.status(500).json({ message: 'Error deleting course', error: errorMessage });
    }
}));
exports.default = router;
