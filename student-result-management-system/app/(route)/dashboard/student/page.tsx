"use client";

import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";

interface Stats {
    totalCourses: number;
    totalResults: number;
    gpa: number;
}

export default function StudentDashboard() {
    const { name } = useAuth();
    const router = useRouter();
    const [stats, setStats] = useState<Stats>({
        totalCourses: 0,
        totalResults: 0,
        gpa: 0,
    });

    const gradeToPoint = (grade: string) => {
        const map: Record<string, number> = {
            "A+": 4.0,
            "A": 4.0,
            "A-": 3.7,
            "B+": 3.3,
            "B": 3.0,
            "B-": 2.7,
            "C+": 2.3,
            "C": 2.0,
            "D": 1.0,
            "F": 0.0,
        };
        return map[grade] || 0;
    };

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Fetch courses assigned
                const coursesRes = await api.get("/student/courses");
                // Fetch results
                const resultsRes = await api.get("/student/results");

                const courses = coursesRes.data.courses;
                const results = resultsRes.data.results;
                console.log(results);

                // Simple GPA calculation (can refine later)
                let totalCredits = 0;
                let totalPoints = 0;

                results.forEach((r: any) => {
                    const gradePoint = gradeToPoint(r.grade);
                    totalPoints += gradePoint * r.marks;
                    totalCredits += r.marks;
                });

                const gpa = totalCredits > 0 ? totalPoints / totalCredits : 0;

                setStats({
                    totalCourses: courses.length,
                    totalResults: results.length,
                    gpa: parseFloat(gpa.toFixed(2)),
                });
            } catch (error) {
                console.error("Error fetching stats:", error);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="p-8 space-y-6">
            <h1 className="text-3xl font-bold">Welcome, {name}</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Total Courses</CardTitle>
                    </CardHeader>
                    <CardContent className="text-2xl font-bold">{stats.totalCourses}</CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Total Results</CardTitle>
                    </CardHeader>
                    <CardContent className="text-2xl font-bold">{stats.totalResults}</CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>GPA</CardTitle>
                    </CardHeader>
                    <CardContent className="text-2xl font-bold">{stats.gpa}</CardContent>
                </Card>
            </div>

            <div className="flex gap-4 mt-6">
                <button
                    onClick={() => router.push("/dashboard/student/results")}
                    className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded text-white font-semibold"
                >
                    My Results
                </button>

                <button
                    onClick={() => router.push("/dashboard/student/subjects")}
                    className="bg-gray-700 hover:bg-gray-800 px-6 py-3 rounded text-white font-semibold"
                >
                    My Courses
                </button>
            </div>
        </div>
    );
}
