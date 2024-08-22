const express = require('express');
const { authenticateJwt, SECRET } = require("../middleware/auth");
const { User, Course, Admin } = require("../db");
const router = express.Router();
const jwt = require('jsonwebtoken');

router.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (user) {
      res.status(403).json({ message: 'User already exists' });
    } else {
      const newUser = new User({ username, password });
      await newUser.save();
      const token = jwt.sign({ username, role: 'user' }, SECRET, { expiresIn: '1h' });
      res.json({ message: 'User created successfully', token });
    }
  });
  
  router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password });
    if (user) {
      const token = jwt.sign({ username, role: 'user' }, SECRET, { expiresIn: '1h' });
      res.json({ message: 'Logged in successfully', token });
    } else {
      res.status(403).json({ message: 'Invalid username or password' });
    }
  });
  
  router.get('/courses', authenticateJwt, async (req, res) => {
    const courses = await Course.find({ published: true }).populate('creator', 'username');
    res.json({ courses });
  });
  
  router.post('/courses/:courseId', authenticateJwt, async (req, res) => {
    const course = await Course.findById(req.params.courseId);
    if (course && course.published) {
        const user = await User.findOne({username: req.user.username});
        if (user) {
            if (!user.purchasedCourses.includes(course._id)) {
                user.purchasedCourses.push(course);
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
  });

router.get('/courses/:id', async (req, res) => {
  const courseId = req.params.id;
  try {
      const course = await Course.findById(courseId); 
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
    console.log('Authenticated user:', req.user);
    
    const user = await User.findOne({ username: req.user.username });
    if (user) {
      res.json({ purchasedCourses: user.purchasedCourses || [] });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  });
  
  module.exports = router