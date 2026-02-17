"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";

interface Student {
    id: number;
    name: string;
    department: string;
}

interface Course {
    id: number;
    name: string;
    code: string;
    credit: number;
}

export default function EnrollmentsPage() {
    const [students, setStudents] = useState<Student[]>([]);
    const [selectedStudent, setSelectedStudent] = useState<number | null>(null);
    const [selectedYear, setSelectedYear] = useState<number | null>(null);

    const [assignedCourses, setAssignedCourses] = useState<Course[]>([]);
    const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
    const [selectedCourses, setSelectedCourses] = useState<number[]>([]);

    const [loading, setLoading] = useState(false);

    /* ===================== FETCH STUDENTS ===================== */
    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const res = await api.get("/admin/students/details");
                setStudents(res?.data?.student || []);
            } catch (error) {
                console.error("Failed to load students", error);
            }
        };

        fetchStudents();
    }, []);

    /* ===================== FETCH ENROLLMENTS ===================== */
    useEffect(() => {
        if (!selectedStudent || !selectedYear) return;

        const fetchEnrollments = async () => {
            try {
                setLoading(true);
                const res = await api.get(
                    `/admin/enrollments/${selectedStudent}?year=${selectedYear}`
                );

                setAssignedCourses(res?.data?.assignedCourses || []);
                setAvailableCourses(res?.data?.availableCourses || []);
            } catch (error) {
                console.error("Failed to load enrollments", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEnrollments();
    }, [selectedStudent, selectedYear]);

    /* ===================== ASSIGN COURSES ===================== */
    const handleAssign = async () => {
        if (!selectedStudent || !selectedYear || selectedCourses.length === 0)
            return;

        try {
            await api.post("/admin/enrollments", {
                studentProfileId: selectedStudent,
                year: selectedYear,
                courseIds: selectedCourses,
            });

            const res = await api.get(
                `/admin/enrollments/${selectedStudent}?year=${selectedYear}`
            );

            setAssignedCourses(res?.data?.assignedCourses || []);
            setAvailableCourses(res?.data?.availableCourses || []);
            setSelectedCourses([]);
        } catch (error) {
            console.error("Failed to assign courses", error);
        }
    };

    /* ===================== REMOVE COURSE ===================== */
    const handleRemove = async (courseId: number) => {
        if (!selectedStudent || !selectedYear) return;

        try {
            await api.delete("/admin/enrollments", {
                data: {
                    studentProfileId: selectedStudent,
                    courseId,
                    year: selectedYear,
                },
            });

            const res = await api.get(
                `/admin/enrollments/${selectedStudent}?year=${selectedYear}`
            );

            setAssignedCourses(res?.data?.assignedCourses || []);
            setAvailableCourses(res?.data?.availableCourses || []);
        } catch (error) {
            console.error("Failed to remove course", error);
        }
    };

    return (
        <div className="p-8 space-y-8">
            {/* ===================== HEADER ===================== */}
            <div>
                <h1 className="text-3xl font-bold text-white">
                    Enrollment Management
                </h1>
                <p className="text-gray-400 mt-1">
                    Assign and manage student course enrollments
                </p>
            </div>

            {/* ===================== FILTERS ===================== */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl flex flex-wrap gap-4">
                <select
                    className="bg-gray-950 border border-gray-700 text-white rounded-xl px-4 py-2 w-64"
                    value={selectedStudent ?? ""}
                    onChange={(e) =>
                        setSelectedStudent(
                            e.target.value ? Number(e.target.value) : null
                        )
                    }
                >
                    <option value="">Select Student</option>
                    {students.map((student) => (
                        <option key={student.id} value={student.id}>
                            {student.name}
                        </option>
                    ))}
                </select>

                <select
                    className="bg-gray-950 border border-gray-700 text-white rounded-xl px-4 py-2 w-40"
                    value={selectedYear ?? ""}
                    onChange={(e) =>
                        setSelectedYear(
                            e.target.value ? Number(e.target.value) : null
                        )
                    }
                >
                    <option value="">Select Year</option>
                    {[1, 2, 3, 4].map((year) => (
                        <option key={year} value={year}>
                            Year {year}
                        </option>
                    ))}
                </select>
            </div>

            {/* ===================== CONTENT ===================== */}
            {loading && (
                <div className="text-gray-400">Loading enrollments...</div>
            )}

            {selectedStudent && selectedYear && !loading && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* ===================== ASSIGNED COURSES ===================== */}
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl">
                        <h2 className="text-lg font-semibold text-white mb-4">
                            Assigned Courses
                        </h2>

                        {assignedCourses.length === 0 ? (
                            <p className="text-gray-400">
                                No courses assigned yet
                            </p>
                        ) : (
                            <ul className="space-y-3">
                                {assignedCourses.map((course) => (
                                    <li
                                        key={course.id}
                                        className="flex items-center justify-between bg-gray-950 border border-gray-800 rounded-xl px-4 py-3"
                                    >
                                        <div>
                                            <p className="text-white font-medium">
                                                {course.name}
                                            </p>
                                            <p className="text-gray-400 text-sm">
                                                {course.code} • {course.credit} credits
                                            </p>
                                        </div>

                                        <button
                                            onClick={() =>
                                                handleRemove(course.id)
                                            }
                                            className="text-red-400 hover:text-red-300 transition"
                                        >
                                            Remove
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* ===================== AVAILABLE COURSES ===================== */}
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl">
                        <h2 className="text-lg font-semibold text-white mb-4">
                            Available Courses
                        </h2>

                        <select
                            multiple
                            className="bg-gray-950 border border-gray-700 text-white rounded-xl w-full p-3 h-48"
                            value={selectedCourses.map(String)}
                            onChange={(e) =>
                                setSelectedCourses(
                                    Array.from(
                                        e.target.selectedOptions,
                                        (o) => Number(o.value)
                                    )
                                )
                            }
                        >
                            {availableCourses.map((course) => (
                                <option key={course.id} value={course.id}>
                                    {course.name} ({course.code})
                                </option>
                            ))}
                        </select>

                        <button
                            onClick={handleAssign}
                            disabled={selectedCourses.length === 0}
                            className="mt-4 w-full bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-medium py-3 rounded-xl transition"
                        >
                            Assign Selected Courses
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
