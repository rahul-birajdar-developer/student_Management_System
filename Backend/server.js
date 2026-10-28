const dns = require("node:dns");

dns.setServers(["1.1.1.1", "8.8.8.8"]);

require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Student = require("./models/student.module");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Check whether the backend is running
app.get("/", (req, res) => {
    res.send("Student Management System API is running!");
});

// Get all students, with optional search
app.get("/api/students", async (req, res) => {
    try {
        const search = req.query.search;

        const filter = search
            ? {
                $or: [
                    { name: { $regex: search, $options: "i" } },
                    { rollNo: { $regex: search, $options: "i" } },
                    { course: { $regex: search, $options: "i" } },
                ],
            }
            : {};

        const students = await Student.find(filter).sort({ createdAt: -1 });
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: "Could not fetch students." });
    }
});

// Add a student
app.post("/api/students", async (req, res) => {
    try {
        const student = await Student.create(req.body);
        res.status(201).json(student);
    } catch (error) {
        const status = error.code === 11000 ? 409 : 400;
        res.status(status).json({
            message:
                error.code === 11000
                    ? "That roll number already exists."
                    : error.message,
        });
    }
});

// Edit a student
app.put("/api/students/:id", async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!student) {
            return res.status(404).json({ message: "Student not found." });
        }

        res.json(student);
    } catch (error) {
        res.status(400).json({ message: "Could not update student." });
    }
});

// Delete a student
app.delete("/api/students/:id", async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);

        if (!student) {
            return res.status(404).json({ message: "Student not found." });
        }

        res.json({ message: "Student deleted successfully." });
    } catch (error) {
        res.status(400).json({ message: "Could not delete student." });
    }
});

// Start the server after connecting to MongoDB
async function startServer() {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is missing from the .env file.");
        }

        await mongoose
            .connect(process.env.MONGO_URI)
            .then(() => {
                console.log("MongoDB connected successfully");

                app.listen(process.env.PORT || 5000, () => {
                    console.log("Server is running");
                });
            })
            .catch((error) => {
                console.error("MongoDB connection error:", error.message);
                process.exit(1);
            });
    } catch (error) {
        console.error("Startup error:", error.message);
        process.exit(1);
    }
}

startServer();
