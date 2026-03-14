'use client'

import { RefObject, useState } from 'react'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import toast from 'react-hot-toast'
import { Download } from 'lucide-react'

interface PDFDownloadButtonProps {
  previewRef: RefObject<HTMLDivElement>
  fileName?: string
}

export function PDFDownloadButton({ previewRef, fileName }: PDFDownloadButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  const handleDownload = async () => {
    if (!previewRef.current) return
    setIsGenerating(true)

    try {
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()

      const imgWidth = canvas.width
      const imgHeight = canvas.height
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
      const width = imgWidth * ratio
      const height = imgHeight * ratio

      pdf.addImage(imgData, 'PNG', 0, 0, width, height)
      pdf.save(fileName || 'resume.pdf')
      toast.success('Resume downloaded!')
    } catch (error) {
      toast.error('Failed to generate PDF. Try again.')
      console.error('PDF generation error:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <button
      onClick={handleDownload}
      disabled={isGenerating}
      className="flex items-center gap-2 rounded-xl bg-brand-terracotta px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-terracotta/90 disabled:opacity-60"
    >
      {isGenerating ? (
        <>
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          Generating...
        </>
      ) : (
        <>
          <Download size={16} />
          Download PDF
        </>
      )}
    </button>
  )
}
