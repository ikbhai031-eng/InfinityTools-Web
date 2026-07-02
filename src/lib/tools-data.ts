
import { 
  FileText, ImageIcon, Code2, Calculator, Briefcase, 
  Settings, Type, Lock, Scissors, Files, Zap, Maximize2, 
  QrCode, Scale, ArrowRightLeft, Search, Mail, Smartphone,
  Globe, Trash2, Binary, CheckCircle2, ListOrdered, Palette,
  Clock, Ruler, DollarSign, Building2, Share2, Layout, Link, FileSearch, Terminal, Scan, FileCode,
  PenTool, Percent, GraduationCap, Hash, Calendar, Layers, CreditCard, Receipt, Repeat, Video, Unlock, Edit3, Sparkles,
  BarChart, FileJson, FileType, Braces, Minimize, RotateCw, FileImage, FileUp, FileDown, Box, ShieldCheck, Monitor, History,
  User, Award, Star
} from "lucide-react";

export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: any;
  category: ToolCategory;
  isNew?: boolean;
  isPopular?: boolean;
  isTrending?: boolean;
}

export type ToolCategory = 
  | "PDF" | "Image" | "Text" | "Developer" | "Security" | "Calculator" 
  | "Student" | "SEO" | "Finance" | "Business" | "Utility" | "QR" | "Web" | "Career";

export const CATEGORIES: { id: ToolCategory; label: string; icon: any }[] = [
  { id: "PDF", label: "PDF Station", icon: FileText },
  { id: "Career", label: "Career Suite", icon: Briefcase },
  { id: "Image", label: "Image Tools", icon: ImageIcon },
  { id: "Developer", label: "Dev Tools", icon: Code2 },
  { id: "SEO", label: "SEO Tools", icon: Search },
  { id: "Finance", label: "Finance", icon: DollarSign },
  { id: "Business", label: "Business", icon: Building2 },
  { id: "Student", label: "Student", icon: GraduationCap },
  { id: "Utility", label: "Utilities", icon: Settings },
  { id: "Web", label: "Web Hub", icon: Globe },
];

export const TOOLS: Tool[] = [
  { id: "resume-builder", name: "Resume Builder", description: "Premium original resume creator with 25+ professional templates and live high-res preview.", icon: Award, category: "Career", isPopular: true, isTrending: true, isNew: true },
  { id: "pdf-editor", name: "PDF Editor", description: "Professional visual editor. Edit text, sign, annotate, and reorder pages locally.", icon: Edit3, category: "PDF", isPopular: true, isTrending: true },
  { id: "merge-pdf", name: "Merge PDF", description: "Combine multiple PDF documents into a single high-quality file.", icon: Files, category: "PDF", isPopular: true },
  { id: "split-pdf", name: "Split PDF", description: "Extract every page into individual PDF documents instantly.", icon: Scissors, category: "PDF" },
  { id: "pdf-lock", name: "PDF Lock", description: "Secure your PDF documents with professional-grade password protection.", icon: Lock, category: "PDF" },
  { id: "pdf-unlock", name: "PDF Unlock", description: "Remove passwords and restrictions from your secured PDF files.", icon: Unlock, category: "PDF" },
  { id: "pdf-rotate", name: "PDF Rotate", description: "Rotate PDF pages clockwise or counter-clockwise permanently.", icon: RotateCw, category: "PDF" },
  { id: "pdf-compress", name: "PDF Compress", description: "Optimize PDF file size by reducing structural overhead.", icon: Zap, category: "PDF" },
  { id: "pdf-to-txt", name: "PDF to Text", description: "Extract clean text from PDF files using high-speed processing.", icon: FileText, category: "PDF" },
  { id: "compress-image", name: "Image Compressor", description: "Professional grade image optimization with live size stats.", icon: Zap, category: "Image", isPopular: true, isTrending: true },
  { id: "resize-image", name: "Image Resizer", description: "Pixel-perfect resizing with aspect ratio locking.", icon: Maximize2, category: "Image" },
  { id: "json-formatter", name: "JSON Formatter", description: "Prettify, minify, and validate complex JSON datasets.", icon: Code2, category: "Developer", isPopular: true },
  { id: "html-formatter", name: "HTML Formatter", description: "Clean and prettify your HTML code for better readability.", icon: Braces, category: "Developer" },
  { id: "css-minifier", name: "CSS Minifier", description: "Compress your CSS code to reduce file size and improve loading speed.", icon: Minimize, category: "Developer" },
  { id: "css-beautifier", name: "CSS Beautifier", description: "Format and indent your CSS code for better organization.", icon: Palette, category: "Developer" },
  { id: "js-minifier", name: "JS Minifier", description: "Optimize and minify your JavaScript code for production deployment.", icon: Terminal, category: "Developer" },
  { id: "password-generator", name: "Secure Passwords", description: "High-entropy unhackable passwords for your accounts.", icon: Lock, category: "Security", isPopular: true },
  { id: "qr-generator", name: "QR Generator", description: "Create branded high-res QR codes for any URL or text.", icon: QrCode, category: "QR", isPopular: true },
  { id: "qr-scanner", name: "QR Scanner", description: "Decode any QR code instantly using your camera.", icon: Scan, category: "QR" },
  { id: "barcode-generator", name: "Barcode Studio", description: "Generate standard barcodes for products and labels.", icon: BarChart, category: "Utility", isNew: true },
  { id: "word-counter", name: "Word Counter", description: "Detailed text analytics including reading time and stats.", icon: Type, category: "Text" },
  { id: "case-converter", name: "Case Converter", description: "Convert text between UPPERCASE, lowercase, and Title Case.", icon: Type, category: "Text" },
  { id: "lorem-ipsum", name: "Lorem Ipsum", description: "Generate placeholder text for your designs and mockups.", icon: FileText, category: "Text" },
  { id: "pdf-watermark", name: "PDF Watermark", description: "Add text watermarks to your PDF pages securely.", icon: PenTool, category: "PDF" },
  { id: "meta-tag-generator", name: "Meta Tags", description: "Create SEO-friendly meta tags for your website.", icon: Search, category: "SEO" },
  { id: "robots-txt-generator", name: "Robots.txt", description: "Generate a valid robots.txt file for your site.", icon: Terminal, category: "SEO" },
  { id: "sitemap-generator", name: "Sitemap Generator", description: "Create XML sitemaps for search engine indexing.", icon: Globe, category: "SEO" },
  { id: "schema-generator", name: "Schema.org Gen", description: "Generate JSON-LD schema markup for your pages.", icon: FileCode, category: "SEO" },
  { id: "gst-calculator", name: "GST Calculator", description: "Calculate Goods and Services Tax instantly.", icon: Calculator, category: "Finance" },
  { id: "emi-calculator", name: "EMI Calculator", description: "Calculate monthly installments for your loans.", icon: DollarSign, category: "Finance" },
  { id: "sip-calculator", name: "SIP Calculator", description: "Calculate future wealth based on systematic investment.", icon: CreditCard, category: "Finance" },
  { id: "uuid-generator", name: "UUID Generator", description: "Generate version 4 universally unique identifiers.", icon: Hash, category: "Utility" },
  { id: "unit-converter", name: "Unit Converter", description: "Convert between various physical and digital units.", icon: Ruler, category: "Utility" },
  { id: "invoice-generator", name: "Invoice Maker", description: "Professional invoice generator for businesses.", icon: FileText, category: "Business" },
  { id: "receipt-generator", name: "Receipt Maker", description: "Create professional business receipts instantly.", icon: Receipt, category: "Business" },
];
