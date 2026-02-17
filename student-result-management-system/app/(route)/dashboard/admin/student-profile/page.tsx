"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";

interface Student {
    id: number;
    name: string;
    email: string;
}

export default function StudentProfilePage() {
    const [students, setStudents] = useState<Student[]>([]);
    const [selectedStudent, setSelectedStudent] = useState("");
    const [rollNumber, setRollNumber] = useState("");
    const [department, setDepartment] = useState("");
    const [year, setYear] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        const res = await api.get("/admin/students/without-profile");
        setStudents(res?.data?.students);
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);

            await api.post("/admin/student-profile", {
                userId: selectedStudent,
                rollNumber,
                department,
                year,
            });

            alert("Profile Created Successfully");

            // Reset
            setSelectedStudent("");
            setRollNumber("");
            setDepartment("");
            setYear("");

            fetchStudents();

        } catch (err: any) {
            alert(err?.response?.data?.message || "Error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-xl">
            <h2 className="text-2xl font-bold mb-6">
                Student Profile Setup
            </h2>

            {/* Student Dropdown */}
            <select
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                className="border p-2 w-full mb-4"
            >
                <option value="">Select Student</option>
                {students.map((student) => (
                    <option key={student.id} value={student.id}>
                        {student.name} ({student.email})
                    </option>
                ))}
            </select>

            {/* Roll Number */}
            <input
                type="text"
                placeholder="Roll Number"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                className="border p-2 w-full mb-4"
            />

            {/* Department */}
            <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="border p-2 w-full mb-4"
            >
                <option value="">Select Department</option>
                <option value="COMP">COMP</option>
                <option value="IT">IT</option>
                <option value="EXTC">EXTC</option>
            </select>

            {/* Year */}
            <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="border p-2 w-full mb-4"
            >
                <option value="">Select Year</option>
                <option value="1">First Year</option>
                <option value="2">Second Year</option>
                <option value="3">Third Year</option>
                <option value="4">Fourth Year</option>
            </select>

            <button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2"
            >
                {loading ? "Creating..." : "Create Profile"}
            </button>
        </div>
    );
}
