import express, { Router } from "express";
import { authenticateJwt, SECRET } from "../middleware/auth";
import { User, Course} from "../db";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { Types } from "mongoose";

const router: Router = express.Router();


router.get("/me", authenticateJwt, async (req, res) => {
  const userId = req.headers["user"];
  const user = await User.findById(userId);
  if (!user) {
    res.json({msg: "User doesn't exist"})
    return
  }
  res.json({
      username: user.username
  })
});

router.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (user) {
      res.status(403).json({ message: 'User already exists' });
    } else {
      const newUser = new User({ username, password });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id, role: 'user' }, SECRET, { expiresIn: '1h' });
      res.json({ message: 'User created successfully', token });
    }
  });
  
  router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password });
    if (user) {
      const token = jwt.sign({ id: user._id, role: 'user' }, SECRET, { expiresIn: '1h' });
      res.json({ message: 'Logged in successfully', token });
    } else {
      res.status(403).json({ message: 'Invalid username or password' });
    }
  });
  
  router.get('/courses', authenticateJwt, async (req, res) => {
    const courses = await Course.find({ published: true }).populate('creator', 'username');
    res.json({ courses });
  });
  
  router.post('/courses/:courseId', authenticateJwt, async (req: Request, res: Response) => {
    try {
        const userId = req.headers["user"];
        const course = await Course.findById(req.params.courseId);
        if (course && course.published) {
            const user = await User.findById(userId)
            if (user) {
                if (!user.purchasedCourses.includes(course._id as Types.ObjectId)) {
                    user.purchasedCourses.push(course._id as Types.ObjectId);
                    await user.save();
                    res.json({ message: 'Course purchased successfully' });
                } else {
                    res.status(400).json({ message: 'Course already purchased' });
                }
            } else {
                res.status(403).json({ message: 'User not found' });
            }
        } else {
            res.status(404).json({ message: 'Course not found or not available for purchase' });
        }
    } catch (error) {
        res.status(500).json({ message: 'An error occurred', error });
    }
});

router.get('/courses/:id', async (req, res) => {
  const courseId = req.params.id;
  try {
      const course = await Course.findById(courseId).populate('creator', 'username'); 
      if (course) {
          res.json(course);
      } else {
          res.status(404).json({ message: 'Course not found' });
      }
  } catch (error) {
      res.status(500).json({ message: 'Error fetching course details', error });
  }
});

  
  router.get('/purchasedCourses', authenticateJwt, async (req, res) => {
    const userId = req.headers["user"];      
    const user = await User.findById(userId);

    if (user) {
      res.json({ purchasedCourses: user.purchasedCourses || [] });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  });
  
  export default router