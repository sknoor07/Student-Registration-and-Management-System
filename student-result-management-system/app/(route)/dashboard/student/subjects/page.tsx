"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import api from "@/lib/axios";

interface Course {
    id: number;
    name: string;
    code: string;
    credits: number;
    department: string;
    year: number;
}

export default function StudentSubjects() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await api.get("/student/courses",
                    { withCredentials: true }
                );
                console.log(res.data);
                setCourses(res.data.courses);
            } catch (err: any) {
                setError(
                    err.response?.data?.message || "Failed to fetch courses"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    if (loading) return <p>Loading courses...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">My Courses</h1>

            {courses.length === 0 ? (
                <p className="text-zinc-400">No courses assigned.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {courses.map((course) => (
                        <div
                            key={course.id}
                            className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl"
                        >
                            <h2 className="text-lg font-semibold">
                                {course.name}
                            </h2>
                            <p className="text-zinc-400 text-sm">
                                Code: {course.code}
                            </p>
                            <p className="text-zinc-400 text-sm">
                                Credits: {course.credits}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
