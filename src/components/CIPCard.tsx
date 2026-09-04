import React, { useState } from 'react';
import { Copy, Check, Printer, Download, Award, Sparkles, BookOpen } from 'lucide-react';
import { CIPRecord } from '../types';

interface CIPCardProps {
  record: CIPRecord;
  onEdit?: (record: CIPRecord) => void;
  showAiBadge?: boolean;
}

export const CIPCard: React.FC<CIPCardProps> = ({ record, onEdit, showAiBadge = true }) => {
  const [copied, setCopied] = useState(false);

  const formattedText = `Dados Internacionais de Catalogação na Publicação (CIP)
(Câmara Brasileira do Livro ou Bibliotecário Responsável)
____________________________________________________________________
${record.cutter}   ${record.author}
          ${record.title}${record.subtitle ? `: ${record.subtitle}` : ''} / ${record.author}${record.secondaryAuthors ? `; ${record.secondaryAuthors}` : ''}. -- ${record.city}: ${record.publisher}, ${record.year}.
          ${record.pages}${record.dimensions ? ` ; ${record.dimensions}` : ''}.

          ISBN ${record.isbn}

          ${record.subjects.join('. ')}.

                                                                CDD ${record.cdd}
                                                                CDU ${record.cdu}
____________________________________________________________________
Bibliotecário responsável: ${record.crbNumber || 'CRB-8/10425'}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formattedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="relative group bg-[#fdfbf7] border border-amber-900/20 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 md:p-8 font-serif text-[#1e2329] max-w-2xl mx-auto selection:bg-amber-100 print:shadow-none print:border-black">
      {/* Top Header metadata toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-900/10 pb-3 mb-4 font-sans text-xs text-stone-600 print:hidden">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            <Sparkles className="w-3 h-3 text-emerald-600" />
            {record.confidenceScore ? `${record.confidenceScore}% Precisão IA` : 'Norma ABNT/AACR2'}
          </span>
          <span className="text-stone-400">|</span>
          <span className="text-stone-500 truncate max-w-[180px]">{record.crbNumber || 'CRB Registrado'}</span>
        </div>

        <div className="flex items-center gap-1 font-sans">
          <button
            onClick={handleCopy}
            title="Copiar texto CIP"
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-stone-700 bg-white hover:bg-stone-100 border border-stone-300 rounded transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copiado!' : 'Copiar'}
          </button>
          <button
            onClick={handlePrint}
            title="Imprimir ficha catalográfica"
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-stone-700 bg-white hover:bg-stone-100 border border-stone-300 rounded transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            Imprimir
          </button>
          {onEdit && (
            <button
              onClick={() => onEdit(record)}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded transition-colors"
            >
              Editar
            </button>
          )}
        </div>
      </div>

      {/* Catalog Card Box (Standard library style) */}
      <div className="border border-stone-800/80 p-5 md:p-6 bg-white relative rounded-sm shadow-inner">
        {/* Animated stamp */}
        <div className="absolute top-3 right-3 pointer-events-none opacity-80 rotate-[-12deg] select-none print:opacity-100">
          <div className="border-2 border-dashed border-emerald-700 text-emerald-800 text-[10px] font-mono tracking-widest font-bold px-2 py-1 uppercase rounded bg-emerald-50/50 backdrop-blur-[1px]">
            ✓ FICHÁRIO IA • CIP
          </div>
        </div>

        <p className="text-center text-xs md:text-sm font-sans tracking-wide text-stone-700 mb-1">
          Dados Internacionais de Catalogação na Publicação (CIP)
        </p>
        <p className="text-center text-[11px] font-sans text-stone-500 mb-4 italic">
          (Câmara Brasileira do Livro ou Bibliotecário Homologado)
        </p>

        <div className="border-t border-stone-700 pt-4 font-mono text-[13px] leading-relaxed text-stone-900">
          {/* Cutter Code & Author Line */}
          <div className="flex items-start gap-4">
            <span className="font-bold text-amber-950 whitespace-nowrap select-all tracking-wider">
              {record.cutter}
            </span>
            <div className="pl-4 border-l border-transparent">
              <span className="font-bold">{record.author}</span>
              <p className="mt-1 pl-4 text-stone-800">
                {record.title}
                {record.subtitle && `: ${record.subtitle}`} / {record.author}
                {record.secondaryAuthors && `; ${record.secondaryAuthors}`}
                {record.translator && `; tradução de ${record.translator}`}. – {record.edition || '1. ed.'} – {record.city}: {record.publisher}, {record.year}.
              </p>
              <p className="pl-4 mt-1 text-stone-800">
                {record.pages}
                {record.dimensions && ` ; ${record.dimensions}`}
                {record.series && ` – (${record.series})`}.
              </p>
              <p className="pl-4 mt-2 font-sans text-xs tracking-normal text-stone-800">
                ISBN {record.isbn}
              </p>
              
              {/* Subjects / Tracing */}
              <div className="pl-4 mt-3 text-xs leading-normal text-stone-800">
                {record.subjects.map((subj, idx) => (
                  <span key={idx} className="mr-2">
                    {subj}.
                  </span>
                ))}
                <span className="italic font-sans">I. Título.</span>
              </div>
            </div>
          </div>

          {/* Classification Indexes at Bottom Right */}
          <div className="mt-6 flex flex-col items-end text-xs font-mono space-y-0.5 pt-2 border-t border-dotted border-stone-300">
            <div className="flex items-center gap-2">
              <span className="text-stone-500 font-sans">Índice para catálogo sistemático:</span>
              <span className="font-bold bg-amber-50 px-1 text-amber-900 border border-amber-200">CDD {record.cdd}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-stone-500 font-sans">Classificação Decimal Universal:</span>
              <span className="font-bold bg-blue-50 px-1 text-blue-900 border border-blue-200">CDU {record.cdu}</span>
            </div>
          </div>
        </div>

        {/* Responsible Librarian signature footer */}
        <div className="mt-4 pt-2 border-t border-stone-200 flex items-center justify-between text-[11px] font-sans text-stone-500">
          <span>Bibliotecário(a) responsável: <strong className="text-stone-700">{record.crbNumber || 'CRB-8/10425'}</strong></span>
          <span className="text-[10px] text-stone-400">Validação Algorítmica ABNT 6023/AACR2</span>
        </div>
      </div>

      {/* AI classification analysis insight bar */}
      {showAiBadge && record.aiNotes && (
        <div className="mt-4 p-3 bg-stone-100/80 rounded-lg text-xs font-sans text-stone-600 flex items-start gap-2 border border-stone-200 print:hidden">
          <BookOpen className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-stone-800">Diagnóstico da IA: </span>
            <span>{record.aiNotes}</span>
            <div className="mt-1 text-[11px] text-stone-500">
              CDD: <em>{record.cddDescription}</em> • CDU: <em>{record.cduDescription}</em>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
