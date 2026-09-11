'use client'

import { useRef, useState } from 'react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { Download, FileText, RotateCcw } from 'lucide-react'

type FormState = {
  department: string
  topic: string
  courseTitle: string
  courseCode: string
  submittedTo: string
  submittedByName: string
  submittedById: string
  date: string
}

const initialForm: FormState = {
  department: 'DEPARTMENT OF MARITIME LAW AND POLICY',
  topic: '',
  courseTitle: '',
  courseCode: '',
  submittedTo: '',
  submittedByName: '',
  submittedById: '',
  date: '',
}

const universityLogo = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo_of_Bangladesh_Maritime_University-3nRxheVMn6IZAoZTGXg8n6Rv4WngIc.png'

function UniversityLogo({ watermark = false }: { watermark?: boolean }) {
  return <img className={watermark ? 'university-logo watermark-logo' : 'university-logo'} src={universityLogo} alt={watermark ? '' : 'Bangladesh Maritime University logo'} aria-hidden={watermark} />
}

export default function Page() {
  const [form, setForm] = useState<FormState>(initialForm)
  const previewRef = useRef<HTMLDivElement>(null)
  const [isExporting, setIsExporting] = useState(false)
  const [mobileView, setMobileView] = useState<'edit' | 'preview'>('edit')

  const update = (key: keyof FormState, value: string) => setForm((current) => ({ ...current, [key]: value }))
  const downloadPdf = async () => {
    if (!previewRef.current) return
    setIsExporting(true)
    try {
      const canvas = await html2canvas(previewRef.current, { scale: 2, backgroundColor: '#ffffff', useCORS: true, windowWidth: previewRef.current.scrollWidth, windowHeight: previewRef.current.scrollHeight })
      const pdf = new jsPDF('p', 'mm', 'a4')
      const image = canvas.toDataURL('image/png')
      const pageWidth = 210
      const pageHeight = (canvas.height / canvas.width) * pageWidth
      pdf.internal.pageSize.setHeight(pageHeight)
      pdf.addImage(image, 'PNG', 0, 0, pageWidth, pageHeight)
      pdf.save('bmu-assignment-cover.pdf')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <main className="editor-shell">
      <header className="topbar">
        <div className="brand-lockup">
          <div className="brand-mark"><FileText size={18} strokeWidth={1.8} /></div>
          <div><p className="eyebrow">Document studio</p><h1>Assignment cover</h1></div>
        </div>
        <button className="download-button" onClick={downloadPdf} disabled={isExporting}>
          <Download size={16} /> {isExporting ? 'Preparing PDF…' : 'Download as PDF'}
        </button>
      </header>

      <div className="mobile-view-toggle" role="tablist" aria-label="Cover editor view"><button className={mobileView === 'edit' ? 'active' : ''} onClick={() => setMobileView('edit')} role="tab" aria-selected={mobileView === 'edit'}>Edit details</button><button className={mobileView === 'preview' ? 'active' : ''} onClick={() => setMobileView('preview')} role="tab" aria-selected={mobileView === 'preview'}>Preview</button></div>
      <div className={`workspace mobile-${mobileView}`}>
        <aside className="form-panel">
          <div className="panel-heading"><div><p className="eyebrow">Editable template</p><h2>Cover details</h2></div><button className="reset-button" onClick={() => setForm(initialForm)} aria-label="Reset all fields" title="Reset all fields"><RotateCcw size={15} /></button></div>
          <p className="panel-intro">Fill in the fields below. Your changes appear on the cover instantly.</p>

          <div className="form-section">
            <label>Department<input value={form.department} onChange={(event) => update('department', event.target.value)} /></label>
            <label>Topic<input placeholder="Enter assignment topic" value={form.topic} onChange={(event) => update('topic', event.target.value)} /></label>
            <div className="form-grid"><label>Course title<input placeholder="e.g. Maritime Law" value={form.courseTitle} onChange={(event) => update('courseTitle', event.target.value)} /></label><label>Course code<input placeholder="e.g. MLP 301" value={form.courseCode} onChange={(event) => update('courseCode', event.target.value)} /></label></div>
          </div>

          <div className="form-section"><label>Submitted to<textarea rows={4} placeholder="Supervisor name\nDesignation\nDepartment" value={form.submittedTo} onChange={(event) => update('submittedTo', event.target.value)} /></label></div>
          <div className="form-section"><div className="section-label">Submitted by</div><div className="form-grid"><label>Name<input placeholder="Your full name" value={form.submittedByName} onChange={(event) => update('submittedByName', event.target.value)} /></label><label>ID<input placeholder="Student ID" value={form.submittedById} onChange={(event) => update('submittedById', event.target.value)} /></label></div></div>
          <div className="form-section"><label>Date of submission<input type="date" value={form.date} onChange={(event) => update('date', event.target.value)} /></label></div>
          <p className="form-footnote">All fields are private to this browser session.</p>
        </aside>

        <section className="preview-panel"><div className="preview-meta"><span>Live preview</span><span>A4 · Portrait</span></div><div className="paper-wrap"><div className="paper" ref={previewRef}><div className="paper-watermark"><UniversityLogo watermark /></div><div className="paper-frame"><UniversityLogo /><h2>Bangladesh Maritime University</h2><p className="tagline">We strive for Maritime Excellence</p><p className="paper-department">{form.department || 'DEPARTMENT OF MARITIME LAW AND POLICY'}</p><h3>ASSIGNMENT ON</h3><div className="paper-fields"><p><strong>TOPIC</strong><b>:</b><span>{form.topic || '\u00a0'}</span></p><p><strong>COURSE TITLE</strong><b>:</b><span>{form.courseTitle || '\u00a0'}</span></p><p><strong>COURSE CODE</strong><b>:</b><span>{form.courseCode || '\u00a0'}</span></p></div><div className="submission-grid"><div><h4>SUBMITTED TO -</h4><p className="submitted-block">{form.submittedTo || '\u00a0'}</p></div><div><h4>SUBMITTED BY -</h4><p><strong>NAME</strong><b>:</b><span>{form.submittedByName || '\u00a0'}</span></p><p><strong>ID.</strong><b>:</b><span>{form.submittedById || '\u00a0'}</span></p></div></div><p className="date-line"><strong>DATE OF SUBMISSION :</strong> {form.date ? new Date(`${form.date}T00:00:00`).toLocaleDateString('en-GB') : '\u00a0'}</p></div></div></div></section>
      </div>
      <footer className="site-footer"><p>Built by Shahriar Tanvir Daffodil International University, SWE</p><p>262-35-351@diu.edu.bd</p><p>Rakib khan</p><p>LLB - VIII, Department of Maritime Law and Policy, Bangladesh Maritime University</p><p>lawkib29@gmail</p></footer>
    </main>
  )
}
