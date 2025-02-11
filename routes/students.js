const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

// Create a new student
router.post('/add', async (req, res) => {
    const { name, email, course } = req.body;
    const student = new Student({ name, email, course });

    try {
        await student.save();
        res.status(201).send('Student added successfully!');
    } catch (err) {
        res.status(400).send('Error adding student');
    }
});

// Get all students
router.get('/', async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (err) {
        res.status(400).send('Error fetching students');
    }
});

module.exports = router;
