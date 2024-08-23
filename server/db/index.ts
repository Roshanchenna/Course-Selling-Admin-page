import mongoose from "mongoose";
// Define mongoose schemas
const userSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    purchasedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course', default:[] }]
});

const adminSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    createdCourses : [{type: mongoose.Schema.Types.ObjectId, ref:'Course'}]
});

const courseSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    price: {type: Number, required: true},
    imageLink: {type: String, required: true},
    published: {type: Boolean, default: false},
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true }
});

export const User = mongoose.model('User', userSchema);
export const Admin = mongoose.model('Admin', adminSchema);
export const Course = mongoose.model('Course', courseSchema);