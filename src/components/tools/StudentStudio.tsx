
"use client";

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { GraduationCap, Percent, Plus, Trash2 } from 'lucide-react';

interface StudentStudioProps {
  mode: 'gpa' | 'percentage' | 'cgpa';
}

export function StudentStudio({ mode }: StudentStudioProps) {
  const [courses, setCourses] = useState([{ grade: '4.0', credits: '3' }]);
  const [semesters, setSemesters] = useState([{ gpa: '4.0', credits: '15' }]);
  const [percent, setPercent] = useState({ obtain: '', total: '' });

  const addCourse = () => setCourses([...courses, { grade: '', credits: '' }]);
  const removeCourse = (i: number) => setCourses(courses.filter((_, idx) => idx !== i));
  const updateCourse = (i: number, field: string, val: string) => {
    const newCourses = [...courses];
    (newCourses[i] as any)[field] = val;
    setCourses(newCourses);
  };

  const addSemester = () => setSemesters([...semesters, { gpa: '', credits: '' }]);
  const removeSemester = (i: number) => setSemesters(semesters.filter((_, idx) => idx !== i));
  const updateSemester = (i: number, field: string, val: string) => {
    const newSemesters = [...semesters];
    (newSemesters[i] as any)[field] = val;
    setSemesters(newSemesters);
  };

  const calculateGpa = () => {
    let totalCredits = 0;
    let totalPoints = 0;
    courses.forEach(c => {
      const g = parseFloat(c.grade) || 0;
      const cr = parseFloat(c.credits) || 0;
      totalPoints += g * cr;
      totalCredits += cr;
    });
    return totalCredits ? (totalPoints / totalCredits).toFixed(2) : '0.00';
  };

  const calculateCgpa = () => {
    let totalCredits = 0;
    let totalPoints = 0;
    semesters.forEach(s => {
      const g = parseFloat(s.gpa) || 0;
      const cr = parseFloat(s.credits) || 0;
      totalPoints += g * cr;
      totalCredits += cr;
    });
    return totalCredits ? (totalPoints / totalCredits).toFixed(2) : '0.00';
  };

  const calculatePercent = () => {
    const ob = parseFloat(percent.obtain) || 0;
    const to = parseFloat(percent.total) || 1;
    return ((ob / to) * 100).toFixed(1);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-500">
      <div className="text-center space-y-4">
        <div className="p-4 bg-primary/10 w-fit rounded-full mx-auto">
          {mode === 'percentage' ? <Percent className="w-10 h-10 text-primary" /> : <GraduationCap className="w-10 h-10 text-primary" />}
        </div>
        <h2 className="text-4xl font-headline font-bold">
          {mode === 'gpa' ? 'GPA Calculator' : mode === 'cgpa' ? 'CGPA Calculator' : 'Percentage Calculator'}
        </h2>
        <p className="text-muted-foreground text-lg">Fast, accurate results for your academic tracking.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 items-start">
        <div className="glass p-8 rounded-[2.5rem] border-white/5 space-y-6">
          {mode === 'gpa' && (
            <div className="space-y-4">
              {courses.map((c, i) => (
                <div key={i} className="flex gap-4 items-center">
                  <div className="flex-1 space-y-2">
                    <Label className="text-xs font-bold uppercase opacity-50">Grade (0-4.0)</Label>
                    <Input placeholder="4.0" value={c.grade} onChange={(e) => updateCourse(i, 'grade', e.target.value)} className="glass h-12" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label className="text-xs font-bold uppercase opacity-50">Credits</Label>
                    <Input placeholder="3" value={c.credits} onChange={(e) => updateCourse(i, 'credits', e.target.value)} className="glass h-12" />
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeCourse(i)} className="mt-6 text-destructive"><Trash2 className="w-4 h-4" /></Button>
                </div>
              ))}
              <Button variant="outline" className="w-full border-dashed rounded-xl h-12" onClick={addCourse}><Plus className="w-4 h-4 mr-2" /> Add Course</Button>
            </div>
          )}
          {mode === 'cgpa' && (
            <div className="space-y-4">
              {semesters.map((s, i) => (
                <div key={i} className="flex gap-4 items-center">
                  <div className="flex-1 space-y-2">
                    <Label className="text-xs font-bold uppercase opacity-50">Sem GPA</Label>
                    <Input placeholder="4.0" value={s.gpa} onChange={(e) => updateSemester(i, 'gpa', e.target.value)} className="glass h-12" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label className="text-xs font-bold uppercase opacity-50">Sem Credits</Label>
                    <Input placeholder="15" value={s.credits} onChange={(e) => updateSemester(i, 'credits', e.target.value)} className="glass h-12" />
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeSemester(i)} className="mt-6 text-destructive"><Trash2 className="w-4 h-4" /></Button>
                </div>
              ))}
              <Button variant="outline" className="w-full border-dashed rounded-xl h-12" onClick={addSemester}><Plus className="w-4 h-4 mr-2" /> Add Semester</Button>
            </div>
          )}
          {mode === 'percentage' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase opacity-50">Obtained Marks</Label>
                <Input placeholder="450" value={percent.obtain} onChange={(e) => setPercent({...percent, obtain: e.target.value})} className="glass h-14 text-xl" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase opacity-50">Total Marks</Label>
                <Input placeholder="500" value={percent.total} onChange={(e) => setPercent({...percent, total: e.target.value})} className="glass h-14 text-xl" />
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col justify-center space-y-8 h-full pt-10 lg:pt-0">
          <div className="glass p-12 rounded-[3.5rem] border-primary/20 bg-primary/5 text-center relative overflow-hidden group">
            <div className="absolute -top-12 -right-12 w-24 h-24 bg-primary/20 blur-3xl rounded-full group-hover:bg-primary/40 transition-all"></div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-primary mb-4">
              {mode === 'gpa' ? 'Your Average GPA' : mode === 'cgpa' ? 'Cumulative GPA' : 'Your Percentage'}
            </p>
            <h3 className="text-8xl font-headline font-bold text-white tracking-tighter">
              {mode === 'gpa' ? calculateGpa() : mode === 'cgpa' ? calculateCgpa() : `${calculatePercent()}%`}
            </h3>
            <div className="mt-8 p-4 bg-white/5 rounded-2xl text-xs font-bold text-muted-foreground uppercase tracking-widest">
              High Performance Academic Engine
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
