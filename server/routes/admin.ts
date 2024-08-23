import mongoose from "mongoose";
import express from "express";
import {Course, Admin } from "../db";
import jwt from "jsonwebtoken";
import { SECRET, authenticateJwt } from "../middleware/auth";

const router = express.Router();

router.get("/me", authenticateJwt, async (req, res) => {
  const adminId = req.headers["user"];
    const admin = await Admin.findById(adminId);
    if (!admin) {
      res.json({msg: "Admin doesn't exist"})
      return
    }
    res.json({
        username: admin.username
    })
});

router.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    const admin = await Admin.findOne({username});
      if (admin) {
        res.status(403).json({ message: 'Admin already exists' });
      } else {
        const obj = { username: username, password: password };
        const newAdmin = new Admin(obj);
        newAdmin.save();

        const token = jwt.sign({ id: newAdmin._id, role: 'admin' }, SECRET, { expiresIn: '1h' });
        res.json({ message: 'Admin created successfully', token });
      }
  
  });
  
  router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username, password });
    if (admin) {
      const token = jwt.sign({ id: admin._id, username: admin.username }, SECRET, { expiresIn: '1h' });
      res.json({ message: 'Logged in successfully', token });
    } else {
      res.status(403).json({ message: 'Invalid username or password' });
    }
  });
  
  router.get('/courses', authenticateJwt, async (req, res) => {
    const adminId = req.headers["user"];
    try {
      const admin = await Admin.findById(adminId)
      const courses = await Course.find({ creator:admin});
      res.json({ courses });
    } catch (error) {
      const errorMessage = (error as Error).message
      res.status(500).json({ message: 'Error fetching courses', error: errorMessage });
    }
  });
  
  router.post('/courses', authenticateJwt, async (req, res) => {
    try {

        const { title, description, price, imageLink, published } = req.body;
        const adminId = req.headers["user"];
        const admin = await Admin.findById(adminId);
        
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

        const course = new Course({
            title,
            description,
            price,
            imageLink,
            published,
            creator: admin._id
        });

        const savedCourse = await course.save();

        res.json({ message: 'Course created successfully', courseId: savedCourse.id });
    } catch (error) {
      const errorMessage = (error as Error).message
        res.status(500).json({ message: 'Error creating course', error: errorMessage});
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
    const adminId = req.headers["user"];
    try {
      const admin = await Admin.findById(adminId);
      if (!admin) {
        return res.status(403).json({ message: 'Admin not found' });
      }

      const courses = await Course.find({ creator: admin._id });
      res.json({ courses });
    } catch (error) {
      const errorMessage = (error as Error).message
      res.status(500).json({ message: 'Error fetching courses', error: errorMessage });
    }
  });
  
  router.get('/course/:courseId', authenticateJwt, async (req, res) => {
    const courseId = req.params.courseId;
    const course = await Course.findById(courseId);
    res.json({ course });
  });

  router.delete('/courses/:courseId', authenticateJwt, async (req, res) => {
    const adminId = req.headers["user"];
    try {
      const admin = await Admin.findById(adminId)
      if (!admin) {
        return res.status(403).json({ message: 'Admin not found' });
      }

      const courseId = req.params.courseId;
      const course = await Course.findById(courseId);

      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }

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
      const errorMessage = (error as Error).message
      res.status(500).json({ message: 'Error deleting course', error: errorMessage });
    }
  });

export default router