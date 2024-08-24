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
const auth_1 = require("../middleware/auth");
const db_1 = require("../db");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = express_1.default.Router();
router.get("/me", auth_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.headers["user"];
    const user = yield db_1.User.findById(userId);
    if (!user) {
        res.json({ msg: "User doesn't exist" });
        return;
    }
    res.json({
        username: user.username
    });
}));
router.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const user = yield db_1.User.findOne({ username });
    if (user) {
        res.status(403).json({ message: 'User already exists' });
    }
    else {
        const newUser = new db_1.User({ username, password });
        yield newUser.save();
        const token = jsonwebtoken_1.default.sign({ id: newUser._id, role: 'user' }, auth_1.SECRET, { expiresIn: '1h' });
        res.json({ message: 'User created successfully', token });
    }
}));
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const user = yield db_1.User.findOne({ username, password });
    if (user) {
        const token = jsonwebtoken_1.default.sign({ id: user._id, role: 'user' }, auth_1.SECRET, { expiresIn: '1h' });
        res.json({ message: 'Logged in successfully', token });
    }
    else {
        res.status(403).json({ message: 'Invalid username or password' });
    }
}));
router.get('/courses', auth_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const courses = yield db_1.Course.find({ published: true }).populate('creator', 'username');
    res.json({ courses });
}));
router.post('/courses/:courseId', auth_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.headers["user"];
        const course = yield db_1.Course.findById(req.params.courseId);
        if (course && course.published) {
            const user = yield db_1.User.findById(userId);
            if (user) {
                if (!user.purchasedCourses.includes(course._id)) {
                    user.purchasedCourses.push(course._id);
                    yield user.save();
                    res.json({ message: 'Course purchased successfully' });
                }
                else {
                    res.status(400).json({ message: 'Course already purchased' });
                }
            }
            else {
                res.status(403).json({ message: 'User not found' });
            }
        }
        else {
            res.status(404).json({ message: 'Course not found or not available for purchase' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'An error occurred', error });
    }
}));
router.get('/courses/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const courseId = req.params.id;
    try {
        const course = yield db_1.Course.findById(courseId).populate('creator', 'username');
        if (course) {
            res.json(course);
        }
        else {
            res.status(404).json({ message: 'Course not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching course details', error });
    }
}));
router.get('/purchasedCourses', auth_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.headers["user"];
    const user = yield db_1.User.findById(userId);
    if (user) {
        res.json({ purchasedCourses: user.purchasedCourses || [] });
    }
    else {
        res.status(404).json({ message: 'User not found' });
    }
}));
exports.default = router;
