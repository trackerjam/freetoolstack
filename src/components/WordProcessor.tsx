import React, { useState, useRef, useEffect } from 'react';
import { FileDown, FileText, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, List, Type } from 'lucide-react';
import ToolHeader from './ToolHeader';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export default function WordProcessor() {
  const [content, setContent] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [format, setFormat] = useState({
    bold: false,
    italic: false,
    underline: false,
    align: 'left',
    list: false,
    font: 'Inter var',
    size: '16px'
  });

  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Update word count whenever content changes
    const words = content.trim() ? content.trim().split(/\s+/).length : 0;
    setWordCount(words);
  }, [content]);

  const fonts = [
    { name: 'Inter var', label: 'Inter' },
    { name: 'Georgia, serif', label: 'Georgia' },
    { name: 'Arial, sans-serif', label: 'Arial' },
    { name: 'Courier New, monospace', label: 'Courier' },
    { name: 'Times New Roman, serif', label: 'Times New Roman' }
  ];

  const sizes = [
    { value: '12px', label: 'Small' },
    { value: '16px', label: 'Normal' },
    { value: '20px', label: 'Large' },
    { value: '24px', label: 'Extra Large' },
    { value: '32px', label: 'Huge' }
  ];

  const handleFormat = (type: keyof typeof format, value?: string) => {
    if (type === 'align') {
      const alignments = ['left', 'center', 'right'];
      const currentIndex = alignments.indexOf(format.align);
      const nextAlign = alignments[(currentIndex + 1) % alignments.length];
      setFormat(prev => ({ ...prev, align: nextAlign }));
    } else if (value !== undefined) {
      setFormat(prev => ({ ...prev, [type]: value }));
    } else {
      setFormat(prev => ({ ...prev, [type]: !prev[type as keyof typeof format] }));
    }
  };

  const downloadDocument = async (type: 'doc' | 'pdf') => {
    if (!editorRef.current) return;

    if (type === 'doc') {
      const element = document.createElement('a');
      const file = new Blob([content], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = 'document.doc';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    } else {
      const pdf = new jsPDF({
        unit: 'px',
        format: 'a4',
        orientation: 'portrait'
      });

      const canvas = await html2canvas(editorRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgWidth = pdf.internal.pageSize.getWidth();
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(
        canvas.toDataURL('image/jpeg', 1.0),
        'JPEG',
        0,
        0,
        imgWidth,
        imgHeight
      );

      if (imgHeight > pdf.internal.pageSize.getHeight()) {
        let remainingHeight = imgHeight;
        let currentPage = 1;
        const pageHeight = pdf.internal.pageSize.getHeight();

        while (remainingHeight > pageHeight) {
          pdf.addPage();
          pdf.addImage(
            canvas.toDataURL('image/jpeg', 1.0),
            'JPEG',
            0,
            -pageHeight * currentPage,
            imgWidth,
            imgHeight
          );
          remainingHeight -= pageHeight;
          currentPage++;
        }
      }

      pdf.save('document.pdf');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <ToolHeader 
          title="Word Processor" 
          description="Create and format documents with ease"
        />
        
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2 p-2 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleFormat('bold')}
                className={`p-2 rounded ${format.bold ? 'bg-blue-100 text-blue-600' : 'hover:bg-slate-200'}`}
                title="Bold"
              >
                <Bold className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleFormat('italic')}
                className={`p-2 rounded ${format.italic ? 'bg-blue-100 text-blue-600' : 'hover:bg-slate-200'}`}
                title="Italic"
              >
                <Italic className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleFormat('underline')}
                className={`p-2 rounded ${format.underline ? 'bg-blue-100 text-blue-600' : 'hover:bg-slate-200'}`}
                title="Underline"
              >
                <Underline className="w-4 h-4" />
              </button>
            </div>

            <div className="w-px h-6 bg-slate-300" />

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleFormat('align')}
                className="p-2 rounded hover:bg-slate-200"
                title="Text Alignment"
              >
                {format.align === 'left' && <AlignLeft className="w-4 h-4" />}
                {format.align === 'center' && <AlignCenter className="w-4 h-4" />}
                {format.align === 'right' && <AlignRight className="w-4 h-4" />}
              </button>
              <button
                onClick={() => handleFormat('list')}
                className={`p-2 rounded ${format.list ? 'bg-blue-100 text-blue-600' : 'hover:bg-slate-200'}`}
                title="Bullet List"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            <div className="w-px h-6 bg-slate-300" />

            <div className="flex items-center gap-2">
              <Type className="w-4 h-4 text-slate-400" />
              <select
                value={format.font}
                onChange={(e) => handleFormat('font', e.target.value)}
                className="px-2 py-1 rounded border border-slate-200 text-sm"
              >
                {fonts.map(font => (
                  <option key={font.name} value={font.name}>{font.label}</option>
                ))}
              </select>
              <select
                value={format.size}
                onChange={(e) => handleFormat('size', e.target.value)}
                className="px-2 py-1 rounded border border-slate-200 text-sm"
              >
                {sizes.map(size => (
                  <option key={size.value} value={size.value}>{size.label}</option>
                ))}
              </select>
            </div>

            <div className="flex-1" />

            <div className="flex items-center gap-2">
              <button
                onClick={() => downloadDocument('doc')}
                className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                <FileText className="w-4 h-4" />
                Download DOC
              </button>
              <button
                onClick={() => downloadDocument('pdf')}
                className="flex items-center gap-2 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
              >
                <FileDown className="w-4 h-4" />
                Download PDF
              </button>
            </div>
          </div>

          <div
            ref={editorRef}
            className={`min-h-[500px] p-4 border rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none ${
              format.bold ? 'font-bold' : ''
            } ${format.italic ? 'italic' : ''} ${
              format.underline ? 'underline' : ''
            } text-${format.align}`}
            contentEditable
            onInput={(e) => setContent(e.currentTarget.textContent || '')}
            style={{
              lineHeight: '1.5',
              backgroundColor: '#ffffff',
              fontFamily: format.font,
              fontSize: format.size
            }}
          />

          <div className="flex justify-end text-sm text-slate-500">
            {wordCount} {wordCount === 1 ? 'word' : 'words'}
          </div>
        </div>
      </div>
    </div>
  );
}