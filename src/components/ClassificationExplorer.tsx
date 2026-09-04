import React, { useState } from 'react';
import { Search, Compass, Layers, Check, Copy, ArrowUpRight, BookOpen } from 'lucide-react';
import { CDD_DIVISIONS, CDU_MAIN_CLASSES } from '../data/cddCduData';
import { CDDDivision, CDUEntry } from '../types';

interface ClassificationExplorerProps {
  onSelectCDD?: (cdd: CDDDivision) => void;
  onSelectCDU?: (cdu: CDUEntry) => void;
}

export const ClassificationExplorer: React.FC<ClassificationExplorerProps> = ({
  onSelectCDD,
  onSelectCDU,
}) => {
  const [activeTab, setActiveTab] = useState<'cdd' | 'cdu'>('cdd');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const categories = [
    'all',
    '000 - Generalidades',
    '100 - Filosofia e Psicologia',
    '200 - Religião',
    '300 - Ciências Sociais',
    '400 - Linguagem',
    '500 - Ciências Puras',
    '600 - Tecnologia',
    '700 - Artes',
    '800 - Literatura',
    '900 - História e Geografia',
  ];

  const filteredCDD = CDD_DIVISIONS.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      item.code.includes(term) ||
      item.name.toLowerCase().includes(term) ||
      item.description.toLowerCase().includes(term) ||
      item.keywords.some((kw) => kw.toLowerCase().includes(term));
    return matchesCategory && matchesSearch;
  });

  const filteredCDU = CDU_MAIN_CLASSES.filter((item) => {
    const term = searchTerm.toLowerCase();
    return (
      item.notation.toLowerCase().includes(term) ||
      item.title.toLowerCase().includes(term) ||
      item.usageNotes.toLowerCase().includes(term)
    );
  });

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 1800);
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-amber-800" />
            <h2 className="text-xl font-serif font-bold text-stone-900">
              Navegador Completo CDD & CDU
            </h2>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Busca reversa por assunto, aplicação direta na ficha e tabela sistemática
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-stone-100 p-1 rounded-xl border border-stone-200 text-xs font-medium">
          <button
            onClick={() => setActiveTab('cdd')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'cdd'
                ? 'bg-white text-amber-900 shadow-sm font-bold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            CDD (100 Divisões de Dewey)
          </button>
          <button
            onClick={() => setActiveTab('cdu')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'cdu'
                ? 'bg-white text-amber-900 shadow-sm font-bold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            CDU (Classificação Universal)
          </button>
        </div>
      </div>

      {/* Search & Category Filter bar */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder={
              activeTab === 'cdd'
                ? 'Busca reversa (ex: literatura, inteligência, filosofia, 869, poesia)...'
                : 'Busca reversa na CDU (ex: 821, psicologia, medicina, direito)...'
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-600 text-stone-900"
          />
        </div>

        {activeTab === 'cdd' && (
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-600 font-sans"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'Todas as 10 Classes Principais' : cat}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Results Count & Help */}
      <div className="flex items-center justify-between text-xs text-stone-500 font-mono">
        <span>
          Exibindo {activeTab === 'cdd' ? filteredCDD.length : filteredCDU.length} divisões
        </span>
        <span className="text-[11px] text-amber-800">
          Dica: Clique no código para copiar ou no botão para aplicar
        </span>
      </div>

      {/* Content List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[520px] overflow-y-auto pr-1">
        {activeTab === 'cdd' ? (
          filteredCDD.length > 0 ? (
            filteredCDD.map((item) => (
              <div
                key={item.code}
                className="group p-3.5 bg-stone-50/70 hover:bg-amber-50/50 border border-stone-200 hover:border-amber-300 rounded-xl transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <button
                      onClick={() => handleCopyCode(item.code)}
                      title="Clique para copiar código CDD"
                      className="font-mono font-bold text-xs bg-amber-100 hover:bg-amber-200 text-amber-950 px-2 py-0.5 rounded border border-amber-300 inline-flex items-center gap-1 transition-colors"
                    >
                      CDD {item.code}
                      {copiedCode === item.code ? (
                        <Check className="w-3 h-3 text-emerald-700" />
                      ) : (
                        <Copy className="w-2.5 h-2.5 opacity-60 group-hover:opacity-100" />
                      )}
                    </button>
                    <span className="text-[10px] font-sans text-stone-500 truncate max-w-[140px]">
                      {item.category.split(' - ')[1] || item.category}
                    </span>
                  </div>
                  <h4 className="font-semibold text-stone-900 text-xs leading-snug">
                    {item.name}
                  </h4>
                  <p className="text-[11px] text-stone-600 mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-stone-200/60 flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {item.keywords.slice(0, 3).map((kw) => (
                      <span
                        key={kw}
                        className="text-[9px] bg-white text-stone-600 px-1.5 py-0.5 rounded border border-stone-200"
                      >
                        #{kw}
                      </span>
                    ))}
                  </div>

                  {onSelectCDD && (
                    <button
                      onClick={() => onSelectCDD(item)}
                      className="text-[11px] font-medium text-amber-900 hover:text-amber-700 inline-flex items-center gap-0.5"
                    >
                      Aplicar
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 text-center py-10 text-stone-400 text-xs">
              Nenhuma divisão CDD encontrada para os termos buscados.
            </div>
          )
        ) : filteredCDU.length > 0 ? (
          filteredCDU.map((item) => (
            <div
              key={item.notation}
              className="group p-3.5 bg-stone-50/70 hover:bg-blue-50/50 border border-stone-200 hover:border-blue-300 rounded-xl transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <button
                    onClick={() => handleCopyCode(item.notation)}
                    title="Clique para copiar notação CDU"
                    className="font-mono font-bold text-xs bg-blue-100 hover:bg-blue-200 text-blue-950 px-2 py-0.5 rounded border border-blue-300 inline-flex items-center gap-1 transition-colors"
                  >
                    CDU {item.notation}
                    {copiedCode === item.notation ? (
                      <Check className="w-3 h-3 text-emerald-700" />
                    ) : (
                      <Copy className="w-2.5 h-2.5 opacity-60 group-hover:opacity-100" />
                    )}
                  </button>
                  <span className="text-[10px] font-sans text-stone-500">{item.category}</span>
                </div>
                <h4 className="font-semibold text-stone-900 text-xs leading-snug">
                  {item.title}
                </h4>
                <p className="text-[11px] text-stone-600 mt-1 leading-relaxed">
                  {item.usageNotes}
                </p>
              </div>

              {onSelectCDU && (
                <div className="mt-3 pt-2 border-t border-stone-200/60 flex justify-end">
                  <button
                    onClick={() => onSelectCDU(item)}
                    className="text-[11px] font-medium text-blue-900 hover:text-blue-700 inline-flex items-center gap-0.5"
                  >
                    Aplicar
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="col-span-2 text-center py-10 text-stone-400 text-xs">
            Nenhuma classe CDU encontrada para a busca.
          </div>
        )}
      </div>
    </div>
  );
};
