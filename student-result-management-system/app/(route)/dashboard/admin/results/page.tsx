"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import api from "@/lib/axios";

interface Result {
    id: number;
    student_id: number;
    course_id: number;
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

    // Modal states
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Result | null>(null);
    const [form, setForm] = useState({
        student_id: "",
        course_id: "",
        marks: "",
        grade: "",
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const [resultsRes, studentsRes, coursesRes] = await Promise.all([
                api.get("/admin/results"),
                api.get("/admin/students/details"),
                api.get("/admin/courses"),
            ]);
            console.log(resultsRes?.data?.count);
            console.log(studentsRes?.data?.student);
            console.log(coursesRes?.data?.courses);

            setResults(resultsRes?.data?.count);
            setStudents(studentsRes?.data?.student);
            setCourses(coursesRes?.data?.courses);

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Handle form change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Open modal for add/edit
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
            setForm({ student_id: "", course_id: "", marks: "", grade: "" });
        }
        setOpen(true);
    };

    // Add or Edit result
    const handleSubmit = async () => {
        try {
            if (editing) {
                await api.put(`/admin/results/${editing.id}`, form);
            } else {
                await api.post("/admin/results", form);
            }
            setOpen(false);
            fetchData();
        } catch (err: any) {
            alert(err.response?.data?.message || "Error occurred");
        }
    };

    // Delete result
    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this result?")) return;
        try {
            await api.delete(`/admin/results/${id}`);
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Manage Results</h1>

            <Button onClick={() => openModal()} className="mb-4 bg-indigo-600 hover:bg-indigo-700">
                Add Result
            </Button>

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
                                    <Button size="sm" className="mr-2" onClick={() => openModal(result)}>
                                        Edit
                                    </Button>
                                    <Button size="sm" variant="destructive" onClick={() => handleDelete(result.id)}>
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* Modal for Add/Edit */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editing ? "Edit Result" : "Add Result"}</DialogTitle>
                    </DialogHeader>

                    <div className="flex flex-col gap-4 mt-4">
                        <Select value={form.student_id} onValueChange={(val) => setForm({ ...form, student_id: val })}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Student" />
                            </SelectTrigger>
                            <SelectContent>
                                {students.map((s) => (
                                    <SelectItem key={s.id} value={String(s.id)}>
                                        {s.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={form.course_id} onValueChange={(val) => setForm({ ...form, course_id: val })}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Course" />
                            </SelectTrigger>
                            <SelectContent>
                                {courses.map((c) => (
                                    <SelectItem key={c.id} value={String(c.id)}>
                                        {c.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Input
                            type="number"
                            name="marks"
                            placeholder="Marks"
                            value={form.marks}
                            onChange={handleChange}
                        />
                        <Input
                            type="text"
                            name="grade"
                            placeholder="Grade (e.g. A, B+)"
                            value={form.grade}
                            onChange={handleChange}
                        />
                    </div>

                    <DialogFooter>
                        <Button onClick={handleSubmit}>{editing ? "Update" : "Add"}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
