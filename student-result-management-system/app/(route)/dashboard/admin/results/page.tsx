"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import api from "@/lib/axios";

interface Result {
    id: number;
    student_id: number;
    student_name: string;
    course_id: number;
    course_name: string;
    marks: number;
    grade: string;
}

interface Student {
    id: number;
    name: string;
}

interface Course {
    id: number;
    name: string;
}

export default function AdminResults() {
    const [results, setResults] = useState<Result[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);

    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Result | null>(null);

    const [form, setForm] = useState({
        student_id: "",
        course_id: "",
        marks: "",
        grade: "",
    });

    // =============================
    // FETCH DATA
    // =============================

    const fetchAll = async () => {
        setLoading(true);
        try {
            const [resultsRes, studentsRes, coursesRes] = await Promise.all([
                api.get("/admin/allResults"),
                api.get("/admin/students/details"),
                api.get("/admin/courses"),
            ]);

            setResults(resultsRes?.data?.results);
            setStudents(studentsRes?.data?.student);
            setCourses(coursesRes?.data?.courses);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAll();
    }, []);

    // =============================
    // MODAL
    // =============================

    const openModal = (result?: Result) => {
        if (result) {
            setEditing(result);
            setForm({
                student_id: String(result.student_id),
                course_id: String(result.course_id),
                marks: String(result.marks),
                grade: result.grade,
            });
        } else {
            setEditing(null);
            setForm({
                student_id: "",
                course_id: "",
                marks: "",
                grade: "",
            });
        }

        setOpen(true);
    };

    // =============================
    // SUBMIT
    // =============================

    const handleSubmit = async () => {
        try {
            const payload = {
                studentId: Number(form.student_id),
                courseId: Number(form.course_id),
                marks: Number(form.marks),
                grade: form.grade,
            };
            console.log(payload);

            if (editing) {
                await api.put(`/admin/results/${editing.id}`, payload);
            } else {
                await api.post("/admin/results", payload);
            }

            setOpen(false);
            fetchAll();
        } catch (err: any) {
            alert(err.response?.data?.message || "Error occurred");
        }
    };

    // =============================
    // DELETE
    // =============================

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this result?")) return;

        try {
            await api.delete(`/admin/results/${id}`);
            fetchAll();
        } catch (error) {
            console.error(error);
        }
    };

    // =============================
    // UI
    // =============================

    return (
        <div className="p-8">
            <div className="flex justify-between">
                <h1 className="text-2xl font-bold mb-4">Manage Results</h1>

                <Button onClick={() => openModal()} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg mb-4">
                    Add Result
                </Button>
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <table className="w-full table-auto border-collapse">
                    <thead>
                        <tr className="bg-gray-800 text-left">
                            <th className="px-4 py-2">Student</th>
                            <th className="px-4 py-2">Course</th>
                            <th className="px-4 py-2">Marks</th>
                            <th className="px-4 py-2">Grade</th>
                            <th className="px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.map((result) => (
                            <tr key={result.id} className="border-b border-gray-700">
                                <td className="px-4 py-2">{result.student_name}</td>
                                <td className="px-4 py-2">{result.course_name}</td>
                                <td className="px-4 py-2">{result.marks}</td>
                                <td className="px-4 py-2">{result.grade}</td>
                                <td className="px-4 py-2">
                                    <div className="flex gap-3">
                                        <Button size="sm" onClick={() => openModal(result)} className="bg-indigo-600 hover:bg-indigo-700 px-3 py-1 rounded text-white mr-2">
                                            Edit
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => handleDelete(result.id)}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* Modal */}
            {/* Modal */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="bg-gray-900 border border-gray-700 text-white rounded-2xl shadow-2xl max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold">
                            {editing ? "Edit Result" : "Add Result"}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="flex flex-col gap-5 mt-4">

                        {/* Student Select */}
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">Student</label>
                            <Select
                                value={form.student_id}
                                onValueChange={(val) =>
                                    setForm({ ...form, student_id: val })
                                }
                            >
                                <SelectTrigger className="bg-gray-800 border-gray-700 focus:ring-indigo-500">
                                    <SelectValue placeholder="Select Student" />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-900 border-gray-700 text-white">
                                    {students.map((s) => (
                                        <SelectItem key={s.id} value={String(s.id)}>
                                            {s.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Course Select */}
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">Course</label>
                            <Select
                                value={form.course_id}
                                onValueChange={(val) =>
                                    setForm({ ...form, course_id: val })
                                }
                            >
                                <SelectTrigger className="bg-gray-800 border-gray-700 focus:ring-indigo-500">
                                    <SelectValue placeholder="Select Course" />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-900 border-gray-700 text-white">
                                    {courses.map((c) => (
                                        <SelectItem key={c.id} value={String(c.id)}>
                                            {c.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Marks */}
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">Marks</label>
                            <Input
                                type="number"
                                placeholder="Enter marks"
                                className="bg-gray-800 border-gray-700 focus-visible:ring-indigo-500"
                                value={form.marks}
                                onChange={(e) =>
                                    setForm({ ...form, marks: e.target.value })
                                }
                            />
                        </div>

                        {/* Grade */}
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">Grade</label>
                            <Input
                                type="text"
                                placeholder="e.g. A, B+"
                                className="bg-gray-800 border-gray-700 focus-visible:ring-indigo-500"
                                value={form.grade}
                                onChange={(e) =>
                                    setForm({ ...form, grade: e.target.value })
                                }
                            />
                        </div>
                    </div>

                    <DialogFooter className="mt-6">
                        <Button
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
                            onClick={handleSubmit}
                        >
                            {editing ? "Update Result" : "Add Result"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div>
    );
}
