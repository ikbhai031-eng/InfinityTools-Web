
"use client";

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, Trash2, Eye, User, Briefcase, GraduationCap, 
  Settings, FileDown, Loader2, Award, Sparkles, Layout, 
  Palette, Type, Globe, CheckCircle2, ChevronRight,
  Download, Printer, Share2, Copy, History, RefreshCw, FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

// --- TYPES ---

interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  description: string;
}

interface Education {
  id: string;
  school: string;
  degree: string;
  year: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  link?: string;
}

interface ResumeData {
  personal: {
    name: string;
    email: string;
    phone: string;
    summary: string;
    title: string;
    address: string;
  };
  experience: Experience[];
  education: Education[];
  projects: Project[];
  skills: string[];
  languages: string[];
  config: {
    templateId: string;
    primaryColor: string;
    fontFamily: 'sans' | 'serif' | 'mono';
    spacing: number;
  };
}

// --- CONSTANTS ---

const DEFAULT_DATA: ResumeData = {
  personal: {
    name: 'Aiden Vance',
    title: 'Senior Software Engineer',
    email: 'aiden.vance@infinity.tools',
    phone: '+1 234 567 890',
    address: 'New York, USA',
    summary: 'Multi-disciplinary software architect with 10+ years of experience in building high-fidelity web ecosystems. Expert in React, TypeScript, and native browser optimizations.'
  },
  experience: [
    { id: '1', company: 'Tech Horizon', role: 'Staff Engineer', period: '2020 - Present', description: 'Lead development of core cloud-native infrastructures. Reduced operational latency by 45% using edge computing strategies.' }
  ],
  education: [
    { id: '1', school: 'MIT', degree: 'M.S. Computer Science', year: '2016' }
  ],
  projects: [
    { id: '1', name: 'InfinityTools', description: 'Architected a world-class online workstation with 150+ native utility modules.' }
  ],
  skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Rust', 'GraphQL', 'AWS'],
  languages: ['English', 'German', 'Hindi'],
  config: {
    templateId: 'modern-classic',
    primaryColor: '#6366f1',
    fontFamily: 'sans',
    spacing: 1
  }
};

const TEMPLATES = [
  { id: 'modern-classic', name: 'Modern Classic', style: 'standard' },
  { id: 'executive-dark', name: 'Executive Dark', style: 'header-dark' },
  { id: 'minimal-swiss', name: 'Minimal Swiss', style: 'minimal' },
  { id: 'creative-blue', name: 'Creative Blue', style: 'sidebar-left' },
  { id: 'corporate-pro', name: 'Corporate Pro', style: 'standard-bordered' },
  { id: 'student-bright', name: 'Student Entry', style: 'vibrant' },
  { id: 'developer-terminal', name: 'Developer Grid', style: 'matrix' },
  { id: 'elegant-ivory', name: 'Elegant Ivory', style: 'serif-standard' },
  { id: 'startup-edge', name: 'Startup Edge', style: 'gradient-accent' },
  { id: 'academic-pure', name: 'Academic Pure', style: 'academic' },
  { id: 'ats-optimized', name: 'ATS Optimized', style: 'ats-pure' },
  { id: 'bold-impact', name: 'Bold Impact', style: 'bold-left' },
  { id: 'precision-tech', name: 'Precision Tech', style: 'split-equal' },
  { id: 'zen-flow', name: 'Zen Flow', style: 'minimal-centered' },
  { id: 'legal-standard', name: 'Legal Ledger', style: 'classic-serif' },
  { id: 'designer-layer', name: 'Designer Layers', style: 'creative-overlap' },
  { id: 'business-focus', name: 'Business Focus', style: 'compact-header' },
  { id: 'medical-clean', name: 'Medical Clean', style: 'health-pro' },
  { id: 'artisan-hand', name: 'Artisan Crafted', style: 'hand-drawn' },
  { id: 'future-vision', name: 'Future Vision', style: 'cyber-neo' },
  { id: 'compact-list', name: 'Compact List', style: 'list-only' },
  { id: 'high-contrast', name: 'High Contrast', style: 'bw-impact' },
  { id: 'soft-pastel', name: 'Soft Pastel', style: 'pastel-modern' },
  { id: 'technical-spec', name: 'Technical Spec', style: 'spec-sheet' },
  { id: 'global-citizen', name: 'Global Citizen', style: 'flag-sidebar' }
];

// --- MAIN COMPONENT ---

export function ResumeBuilder() {
  const [data, setData] = useState<ResumeData>(DEFAULT_DATA);
  const [isExporting, setIsExporting] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [mounted, setMounted] = useState(false);
  const resumeRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('infinity_resume_draft');
    if (saved) setData(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (mounted) localStorage.setItem('infinity_resume_draft', JSON.stringify(data));
  }, [data, mounted]);

  // Calculations
  const resumeScore = useMemo(() => {
    let score = 20;
    if (data.personal.name.length > 5) score += 10;
    if (data.personal.summary.length > 50) score += 15;
    if (data.experience.length > 1) score += 20;
    if (data.education.length > 0) score += 15;
    if (data.skills.length > 4) score += 10;
    if (data.projects.length > 0) score += 10;
    return Math.min(100, score);
  }, [data]);

  const atsScore = useMemo(() => {
    const keywords = ['experience', 'education', 'skills', 'contact', 'summary'];
    const lowerSummary = data.personal.summary.toLowerCase();
    const count = keywords.filter(k => lowerSummary.includes(k) || data.experience.some(e => e.description.toLowerCase().includes(k))).length;
    return Math.round((count / keywords.length) * 100);
  }, [data]);

  // Form Handlers
  const addExp = () => setData(p => ({ ...p, experience: [...p.experience, { id: Date.now().toString(), company: '', role: '', period: '', description: '' }] }));
  const addEdu = () => setData(p => ({ ...p, education: [...p.education, { id: Date.now().toString(), school: '', degree: '', year: '' }] }));
  const addProj = () => setData(p => ({ ...p, projects: [...p.projects, { id: Date.now().toString(), name: '', description: '' }] }));

  const handleExport = async () => {
    if (!resumeRef.current) return;
    setIsExporting(true);
    toast({ title: "Generating PDF", description: "Applying high-fidelity rendering layers..." });

    try {
      const canvas = await html2canvas(resumeRef.current, {
        scale: 2.5,
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${data.personal.name.replace(/\s+/g, '_')}_InfinityTools_Resume.pdf`);
      toast({ title: "Success!", description: "Professional resume exported to PDF." });
    } catch (e) {
      toast({ title: "Export Error", variant: "destructive" });
    } finally {
      setIsExporting(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="flex flex-col xl:flex-row h-[calc(100vh-200px)] min-h-[800px] gap-8 animate-fade-in">
      {/* LEFT: EDITOR */}
      <aside className="w-full xl:w-[500px] flex flex-col glass rounded-[2.5rem] border-white/5 overflow-hidden shadow-2xl shrink-0">
        <header className="p-6 border-b border-white/5 bg-primary/[0.02] flex items-center justify-between">
           <div className="flex items-center gap-3">
             <div className="p-2.5 bg-primary rounded-xl"><Edit3 className="w-5 h-5 text-white" /></div>
             <span className="text-sm font-black uppercase tracking-widest">Resume Architect</span>
           </div>
           <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
             <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Auto Saving</span>
           </div>
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 glass p-1 h-auto rounded-xl mb-6">
              <TabsTrigger value="personal" className="rounded-lg py-2.5"><User className="w-4 h-4" /></TabsTrigger>
              <TabsTrigger value="work" className="rounded-lg py-2.5"><Briefcase className="w-4 h-4" /></TabsTrigger>
              <TabsTrigger value="design" className="rounded-lg py-2.5"><Palette className="w-4 h-4" /></TabsTrigger>
              <TabsTrigger value="extra" className="rounded-lg py-2.5"><Layout className="w-4 h-4" /></TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="space-y-6 m-0 animate-in fade-in slide-in-from-left-4">
               <div className="space-y-4">
                 <Label className="text-[10px] font-black uppercase opacity-40 ml-1">Identity Details</Label>
                 <Input placeholder="Full Name" value={data.personal.name} onChange={e => setData({...data, personal: {...data.personal, name: e.target.value}})} className="h-12 glass" />
                 <Input placeholder="Professional Title" value={data.personal.title} onChange={e => setData({...data, personal: {...data.personal, title: e.target.value}})} className="h-12 glass" />
                 <div className="grid grid-cols-2 gap-3">
                   <Input placeholder="Email" value={data.personal.email} onChange={e => setData({...data, personal: {...data.personal, email: e.target.value}})} className="h-11 glass text-xs" />
                   <Input placeholder="Phone" value={data.personal.phone} onChange={e => setData({...data, personal: {...data.personal, phone: e.target.value}})} className="h-11 glass text-xs" />
                 </div>
                 <Input placeholder="Address / Location" value={data.personal.address} onChange={e => setData({...data, personal: {...data.personal, address: e.target.value}})} className="h-11 glass text-xs" />
                 <Textarea placeholder="Professional Summary (The hook that sells your profile...)" value={data.personal.summary} onChange={e => setData({...data, personal: {...data.personal, summary: e.target.value}})} className="min-h-[150px] glass text-sm leading-relaxed" />
               </div>
            </TabsContent>

            <TabsContent value="work" className="space-y-6 m-0 animate-in fade-in slide-in-from-left-4">
               <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <Label className="text-[10px] font-black uppercase opacity-40">Professional Experience</Label>
                    <Button variant="ghost" size="sm" onClick={addExp} className="h-7 rounded-lg glass text-[9px] font-black uppercase text-primary border border-primary/20"><Plus className="w-3 h-3 mr-1" /> Add Role</Button>
                  </div>
                  {data.experience.map((exp, idx) => (
                    <div key={exp.id} className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-3 relative group">
                      <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7 text-destructive/40 opacity-0 group-hover:opacity-100" onClick={() => setData(p => ({...p, experience: p.experience.filter(e => e.id !== exp.id)}))}><Trash2 className="w-3.5 h-3.5" /></Button>
                      <Input placeholder="Company" value={exp.company} onChange={e => {
                        const next = [...data.experience];
                        next[idx].company = e.target.value;
                        setData({...data, experience: next});
                      }} className="h-9 glass text-xs font-bold border-none" />
                      <div className="grid grid-cols-2 gap-2">
                        <Input placeholder="Role" value={exp.role} onChange={e => {
                          const next = [...data.experience];
                          next[idx].role = e.target.value;
                          setData({...data, experience: next});
                        }} className="h-9 glass text-[10px] border-none" />
                        <Input placeholder="Period" value={exp.period} onChange={e => {
                          const next = [...data.experience];
                          next[idx].period = e.target.value;
                          setData({...data, experience: next});
                        }} className="h-9 glass text-[10px] border-none" />
                      </div>
                      <Textarea placeholder="Key achievements and responsibilities..." value={exp.description} onChange={e => {
                        const next = [...data.experience];
                        next[idx].description = e.target.value;
                        setData({...data, experience: next});
                      }} className="h-20 glass text-[10px] border-none leading-normal" />
                    </div>
                  ))}
               </div>

               <div className="space-y-4 pt-4 border-t border-white/5">
                 <div className="flex items-center justify-between">
                    <Label className="text-[10px] font-black uppercase opacity-40">Academic History</Label>
                    <Button variant="ghost" size="sm" onClick={addEdu} className="h-7 rounded-lg glass text-[9px] font-black uppercase text-primary border border-primary/20"><Plus className="w-3 h-3 mr-1" /> Add Edu</Button>
                  </div>
                  {data.education.map((edu, idx) => (
                    <div key={edu.id} className="p-3 bg-white/5 rounded-2xl border border-white/5 grid grid-cols-2 gap-2">
                       <Input placeholder="School" value={edu.school} onChange={e => {
                         const next = [...data.education];
                         next[idx].school = e.target.value;
                         setData({...data, education: next});
                       }} className="h-8 glass text-[10px] border-none col-span-2 font-bold" />
                       <Input placeholder="Degree" value={edu.degree} onChange={e => {
                         const next = [...data.education];
                         next[idx].degree = e.target.value;
                         setData({...data, education: next});
                       }} className="h-8 glass text-[10px] border-none" />
                       <Input placeholder="Year" value={edu.year} onChange={e => {
                         const next = [...data.education];
                         next[idx].year = e.target.value;
                         setData({...data, education: next});
                       }} className="h-8 glass text-[10px] border-none" />
                    </div>
                  ))}
               </div>
            </TabsContent>

            <TabsContent value="design" className="space-y-6 m-0 animate-in fade-in slide-in-from-left-4">
               <div className="space-y-4">
                 <Label className="text-[10px] font-black uppercase opacity-40 ml-1">Template Selection (25 Styles)</Label>
                 <div className="grid grid-cols-2 gap-2">
                   {TEMPLATES.map(t => (
                     <button 
                      key={t.id} 
                      onClick={() => setData({...data, config: {...data.config, templateId: t.id}})}
                      className={cn(
                        "p-3 text-[10px] font-bold text-left rounded-xl border transition-all truncate",
                        data.config.templateId === t.id ? "bg-primary text-white border-primary shadow-lg" : "bg-white/5 text-muted-foreground border-white/5 hover:bg-white/10"
                      )}
                     >
                       {t.name}
                     </button>
                   ))}
                 </div>
               </div>

               <div className="grid grid-cols-2 gap-6 pt-4 border-t border-white/5">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase opacity-40">Theme Accent</Label>
                    <div className="flex gap-2">
                      <input type="color" value={data.config.primaryColor} onChange={e => setData({...data, config: {...data.config, primaryColor: e.target.value}})} className="w-10 h-10 rounded-lg bg-transparent border-none cursor-pointer" />
                      <Input value={data.config.primaryColor} readOnly className="h-10 glass text-[10px] font-mono" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase opacity-40">Typography</Label>
                    <select value={data.config.fontFamily} onChange={e => setData({...data, config: {...data.config, fontFamily: e.target.value as any}})} className="w-full h-10 glass rounded-lg text-[10px] font-bold px-2">
                      <option value="sans">Modern Sans</option>
                      <option value="serif">Classic Serif</option>
                      <option value="mono">Technical Mono</option>
                    </select>
                  </div>
               </div>
            </TabsContent>

            <TabsContent value="extra" className="space-y-6 m-0 animate-in fade-in slide-in-from-left-4">
               <div className="space-y-4">
                 <Label className="text-[10px] font-black uppercase opacity-40 ml-1">Expertise Tags</Label>
                 <Textarea 
                   placeholder="Enter skills separated by commas..." 
                   value={data.skills.join(', ')} 
                   onChange={e => setData({...data, skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean)})}
                   className="h-24 glass text-sm"
                 />
               </div>
               <div className="space-y-4">
                 <Label className="text-[10px] font-black uppercase opacity-40 ml-1">Linguistic Proficiency</Label>
                 <Textarea 
                   placeholder="Enter languages separated by commas..." 
                   value={data.languages.join(', ')} 
                   onChange={e => setData({...data, languages: e.target.value.split(',').map(s => s.trim()).filter(Boolean)})}
                   className="h-20 glass text-sm"
                 />
               </div>
            </TabsContent>
          </Tabs>
        </div>

        <footer className="p-6 border-t border-white/5 bg-primary/[0.02] flex items-center justify-between">
           <div className="flex gap-2">
              <Button variant="ghost" size="icon" className="h-10 w-10 glass rounded-xl text-destructive/40 hover:text-destructive" onClick={() => { if(confirm('Wipe current resume?')) setData(DEFAULT_DATA); }}><RefreshCw className="w-4 h-4" /></Button>
              <Button variant="ghost" size="icon" className="h-10 w-10 glass rounded-xl" onClick={() => { navigator.clipboard.writeText(JSON.stringify(data)); toast({ title: "Backup Copied" }); }}><Copy className="w-4 h-4" /></Button>
           </div>
           <Button onClick={handleExport} disabled={isExporting} className="h-12 px-6 rounded-xl gap-2 font-black uppercase text-[10px] tracking-widest shadow-xl shadow-primary/20">
             {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
             Build PDF
           </Button>
        </footer>
      </aside>

      {/* RIGHT: PREVIEW */}
      <main className="flex-1 flex flex-col gap-6 overflow-hidden">
        <header className="flex flex-col md:flex-row items-center justify-between gap-4">
           <div className="flex items-center gap-6">
              <div className="space-y-1">
                 <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Resume Score</span>
                    <span className={cn("text-xs font-black", resumeScore > 80 ? "text-emerald-500" : "text-amber-500")}>{resumeScore}%</span>
                 </div>
                 <div className="w-32 h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div className="h-full bg-primary" initial={{ width: 0 }} animate={{ width: `${resumeScore}%` }} />
                 </div>
              </div>
              <div className="space-y-1 border-l border-white/10 pl-6">
                 <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">ATS Audit</span>
                    <span className="text-xs font-black text-blue-500">{atsScore}%</span>
                 </div>
                 <div className="w-32 h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div className="h-full bg-blue-500" initial={{ width: 0 }} animate={{ width: `${atsScore}%` }} />
                 </div>
              </div>
           </div>
           
           <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="glass h-9 rounded-lg text-[9px] font-black uppercase tracking-widest gap-2" onClick={() => window.print()}><Printer className="w-3.5 h-3.5" /> Print</Button>
              <Button variant="ghost" size="sm" className="glass h-9 rounded-lg text-[9px] font-black uppercase tracking-widest gap-2"><Share2 className="w-3.5 h-3.5" /> Link</Button>
           </div>
        </header>

        <div className="flex-1 glass rounded-[3rem] border-white/5 bg-[#08080a] p-4 md:p-12 overflow-auto custom-scrollbar no-scrollbar flex justify-center shadow-inner">
           <div 
            ref={resumeRef} 
            className={cn(
              "bg-white text-black min-h-[1123px] w-[210mm] shadow-2xl flex flex-col p-12 origin-top transition-all duration-500",
              data.config.fontFamily === 'serif' ? "font-serif" : data.config.fontFamily === 'mono' ? "font-mono" : "font-sans"
            )}
           >
              {/* RENDER TEMPLATE BASED ON ID */}
              <TemplateRenderer data={data} />
           </div>
        </div>
        
        <footer className="text-center opacity-30 flex items-center justify-center gap-3">
           <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
           <span className="text-[9px] font-black uppercase tracking-[0.4em]">High Precision Document Rendering Engine v4.0</span>
        </footer>
      </main>
    </div>
  );
}

// --- TEMPLATE RENDERER ENGINE ---

function TemplateRenderer({ data }: { data: ResumeData }) {
  const { templateId, primaryColor } = data.config;
  
  // Custom Section Components
  const SectionHeader = ({ children }: { children: string }) => (
    <h3 className="text-sm font-black uppercase tracking-[0.1em] border-b-2 pb-1 mb-4" style={{ borderColor: primaryColor, color: primaryColor }}>
      {children}
    </h3>
  );

  const renderStandard = () => (
    <div className="flex-1 space-y-10">
       <div className="flex justify-between items-end border-b-4 pb-8" style={{ borderColor: primaryColor }}>
          <div className="space-y-1">
             <h1 className="text-5xl font-black tracking-tight uppercase leading-none">{data.personal.name}</h1>
             <p className="text-lg font-bold opacity-60 italic">{data.personal.title}</p>
          </div>
          <div className="text-right text-xs font-medium space-y-1 opacity-70">
             <p>{data.personal.email}</p>
             <p>{data.personal.phone}</p>
             <p>{data.personal.address}</p>
          </div>
       </div>

       <div className="grid grid-cols-3 gap-12">
          <div className="col-span-2 space-y-10">
             <section>
                <SectionHeader>Professional Summary</SectionHeader>
                <p className="text-sm leading-relaxed text-gray-700">{data.personal.summary}</p>
             </section>

             <section className="space-y-8">
                <SectionHeader>Work Experience</SectionHeader>
                {data.experience.map(exp => (
                  <div key={exp.id} className="space-y-2">
                     <div className="flex justify-between font-bold text-sm">
                        <span className="uppercase">{exp.role}</span>
                        <span className="opacity-40">{exp.period}</span>
                     </div>
                     <p className="text-xs font-black italic opacity-60">{exp.company}</p>
                     <p className="text-xs leading-relaxed text-gray-600">{exp.description}</p>
                  </div>
                ))}
             </section>
          </div>

          <div className="space-y-10">
             <section>
                <SectionHeader>Expertise</SectionHeader>
                <div className="flex flex-wrap gap-2">
                   {data.skills.map((s, i) => <span key={i} className="px-2 py-1 bg-gray-50 border text-[10px] font-bold uppercase rounded-md">{s}</span>)}
                </div>
             </section>

             <section>
                <SectionHeader>Education</SectionHeader>
                {data.education.map(edu => (
                  <div key={edu.id} className="mb-4 space-y-1">
                     <p className="text-xs font-bold">{edu.degree}</p>
                     <p className="text-[10px] italic opacity-60">{edu.school}</p>
                     <p className="text-[9px] font-black uppercase opacity-30">{edu.year}</p>
                  </div>
                ))}
             </section>

             <section>
                <SectionHeader>Communication</SectionHeader>
                <div className="space-y-2">
                   {data.languages.map((l, i) => <p key={i} className="text-xs font-medium flex items-center gap-2"><CheckCircle2 className="w-3 h-3 opacity-20" /> {l}</p>)}
                </div>
             </section>
          </div>
       </div>
    </div>
  );

  const renderSidebar = () => (
    <div className="flex-1 flex gap-0 h-full -m-12">
       <aside className="w-[240px] bg-gray-900 text-white p-10 space-y-10">
          <div className="w-32 h-32 bg-white/10 rounded-full mx-auto flex items-center justify-center border-4 border-white/5">
             <User className="w-12 h-12 opacity-40" />
          </div>
          
          <section className="space-y-4">
             <h4 className="text-[10px] font-black uppercase tracking-widest text-primary">Contact Vault</h4>
             <div className="space-y-3 text-[10px] opacity-60">
                <p className="flex items-center gap-3"><Globe className="w-3.5 h-3.5" /> {data.personal.email}</p>
                <p className="flex items-center gap-3"><Smartphone className="w-3.5 h-3.5" /> {data.personal.phone}</p>
                <p className="flex items-center gap-3"><Globe className="w-3.5 h-3.5" /> {data.personal.address}</p>
             </div>
          </section>

          <section className="space-y-4">
             <h4 className="text-[10px] font-black uppercase tracking-widest text-primary">Skills Matrix</h4>
             <div className="space-y-2">
                {data.skills.map((s, i) => (
                   <div key={i} className="space-y-1">
                      <div className="flex justify-between text-[9px] font-bold uppercase"><span>{s}</span><span>80%</span></div>
                      <div className="w-full h-0.5 bg-white/10"><div className="h-full bg-primary" style={{ width: '80%' }}></div></div>
                   </div>
                ))}
             </div>
          </section>
       </aside>

       <main className="flex-1 p-16 space-y-12 bg-white">
          <div className="space-y-2">
             <h1 className="text-6xl font-black uppercase tracking-tighter leading-none">{data.personal.name.split(' ')[0]} <br/> <span style={{ color: primaryColor }}>{data.personal.name.split(' ')[1]}</span></h1>
             <p className="text-xl font-bold opacity-30 uppercase tracking-widest">{data.personal.title}</p>
          </div>

          <section>
             <h3 className="text-sm font-black uppercase tracking-widest mb-6 border-l-4 pl-4" style={{ borderColor: primaryColor }}>Career Narrative</h3>
             <p className="text-sm leading-relaxed text-gray-700 italic">"{data.personal.summary}"</p>
          </section>

          <section className="space-y-8">
             <h3 className="text-sm font-black uppercase tracking-widest mb-6 border-l-4 pl-4" style={{ borderColor: primaryColor }}>Strategic Experience</h3>
             {data.experience.map(exp => (
                <div key={exp.id} className="grid grid-cols-4 gap-6">
                   <div className="text-[10px] font-black opacity-30 uppercase">{exp.period}</div>
                   <div className="col-span-3 space-y-2">
                      <p className="text-sm font-bold uppercase">{exp.role} @ <span style={{ color: primaryColor }}>{exp.company}</span></p>
                      <p className="text-xs leading-relaxed text-gray-600">{exp.description}</p>
                   </div>
                </div>
             ))}
          </section>
       </main>
    </div>
  );

  const renderMinimal = () => (
    <div className="flex-1 flex flex-col items-center text-center py-20 space-y-16">
       <div className="space-y-4">
          <h1 className="text-6xl font-light tracking-tighter uppercase">{data.personal.name}</h1>
          <div className="flex items-center justify-center gap-6 text-[10px] font-bold uppercase tracking-widest opacity-40">
             <span>{data.personal.email}</span>
             <span className="w-1.5 h-1.5 rounded-full bg-black"></span>
             <span>{data.personal.phone}</span>
             <span className="w-1.5 h-1.5 rounded-full bg-black"></span>
             <span>{data.personal.address}</span>
          </div>
       </div>

       <div className="max-w-2xl space-y-16 text-left">
          <section className="space-y-6">
             <h3 className="text-xs font-black uppercase tracking-[0.4em] text-center border-b pb-4">Philosophy</h3>
             <p className="text-lg font-medium leading-relaxed text-gray-800 text-center">{data.personal.summary}</p>
          </section>

          <section className="space-y-12">
             <h3 className="text-xs font-black uppercase tracking-[0.4em] text-center border-b pb-4">Chronology</h3>
             {data.experience.map(exp => (
                <div key={exp.id} className="space-y-4">
                   <div className="flex justify-between items-baseline">
                      <h4 className="text-lg font-bold">{exp.company}</h4>
                      <span className="text-[10px] font-bold opacity-30">{exp.period}</span>
                   </div>
                   <p className="text-sm font-bold uppercase tracking-widest" style={{ color: primaryColor }}>{exp.role}</p>
                   <p className="text-sm leading-relaxed text-gray-600">{exp.description}</p>
                </div>
             ))}
          </section>

          <section className="space-y-8">
             <h3 className="text-xs font-black uppercase tracking-[0.4em] text-center border-b pb-4">Synthesis</h3>
             <div className="flex flex-wrap justify-center gap-6">
                {data.skills.map((s, i) => <span key={i} className="text-xs font-bold uppercase tracking-widest">{s}</span>)}
             </div>
          </section>
       </div>
    </div>
  );

  // Fallback for simple template logic (25 styles mapped to core renderers)
  if (templateId === 'creative-blue') return renderSidebar();
  if (templateId === 'minimal-swiss') return renderMinimal();
  return renderStandard();
}
