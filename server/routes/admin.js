const mongoose = require("mongoose");
const express = require('express');
const { User, Course, Admin } = require("../db");
const jwt = require('jsonwebtoken');
const { SECRET } = require("../middleware/auth")
const { authenticateJwt } = require("../middleware/auth");

const router = express.Router();

router.get("/me", authenticateJwt, async (req, res) => {
    const admin = await Admin.findOne({ username: req.user.username });
    if (!admin) {
      res.status(403).json({msg: "Admin doesnt exist"})
      return
    }
    res.json({
        username: admin.username
    })
});

router.post('/signup', (req, res) => {
    const { username, password } = req.body;
    function callback(admin) {
      if (admin) {
        res.status(403).json({ message: 'Admin already exists' });
      } else {
        const obj = { username: username, password: password };
        const newAdmin = new Admin(obj);
        newAdmin.save();

        const token = jwt.sign({ username, role: 'admin' }, SECRET, { expiresIn: '1h' });
        res.json({ message: 'Admin created successfully', token });
      }
  
    }
    Admin.findOne({ username }).then(callback);
  });
  
  router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username, password });
    if (admin) {
      const token = jwt.sign({ username, role: 'admin' }, SECRET, { expiresIn: '1h' });
      res.json({ message: 'Logged in successfully', token });
    } else {
      res.status(403).json({ message: 'Invalid username or password' });
    }
  });
  
  router.post('/courses', authenticateJwt, async (req, res) => {
    try {
      const admin = await Admin.findOne({ username: req.user.username });
      if (!admin) {
        return res.status(403).json({ message: 'Admin not found' });
      }

      const course = new Course({
        ...req.body,
        creator: admin._id
      });
      await course.save();

      admin.createdCourses.push(course._id);
      await admin.save();

      res.json({ message: 'Course created successfully', courseId: course.id });
    } catch (error) {
      res.status(500).json({ message: 'Error creating course', error: error.message });
    }
  });
  
  router.put('/courses/:courseId', authenticateJwt, async (req, res) => {
    const course = await Course.findByIdAndUpdate(req.params.courseId, req.body, { new: true });
    if (course) {
      res.json({ message: 'Course updated successfully' });
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  });
  
  router.get('/courses', authenticateJwt, async (req, res) => {
    try {
      const admin = await Admin.findOne({ username: req.user.username });
      if (!admin) {
        return res.status(403).json({ message: 'Admin not found' });
      }

      const courses = await Course.find({ creator: admin._id });
      res.json({ courses });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching courses', error: error.message });
    }
  });
  
  router.get('/course/:courseId', authenticateJwt, async (req, res) => {
    const courseId = req.params.courseId;
    const course = await Course.findById(courseId);
    res.json({ course });
  });

  router.delete('/courses/:courseId', authenticateJwt, async (req, res) => {
    try {
      const admin = await Admin.findOne({ username: req.user.username });
      if (!admin) {
        return res.status(403).json({ message: 'Admin not found' });
      }

      const courseId = req.params.courseId;
      const course = await Course.findById(courseId);

      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }

      // Check if the course belongs to the admin
      if (course.creator.toString() !== admin._id.toString()) {
        return res.status(403).json({ message: 'You are not authorized to delete this course' });
      }

      // Remove the course from the admin's createdCourses array
      admin.createdCourses = admin.createdCourses.filter(id => id.toString() !== courseId);
      await admin.save();

      // Delete the course
      await Course.findByIdAndDelete(courseId);

      res.json({ message: 'Course deleted successfully' });
    } catch (error) {
      console.error('Error deleting course:', error);
      res.status(500).json({ message: 'Error deleting course', error: error.message });
    }
  });

  module.exports = router