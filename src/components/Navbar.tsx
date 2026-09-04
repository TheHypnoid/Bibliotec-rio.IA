import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Layers, Compass, Network, Sparkles, ExternalLink } from 'lucide-react';

interface NavbarProps {
  isPreview: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ isPreview }) => {
  const location = useLocation();

  const navItems = [
    { path: '/lp-video', label: 'Landing Page & Vídeo', icon: Sparkles },
    { path: '/catalogo', label: 'Gerador CIP & Acervo', icon: BookOpen },
    { path: '/classificacao', label: 'Navegador CDD / CDU', icon: Compass },
    { path: '/sitemap', label: 'Sitemap & Roteamento', icon: Network },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#181d24] border-b border-stone-800 text-stone-100 backdrop-blur-md bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5 text-amber-100" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-lg text-amber-50 tracking-tight">Fichário</span>
                <span className="text-[10px] font-mono uppercase tracking-widest bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded border border-amber-500/30">
                  IA CIP
                </span>
              </div>
              <p className="text-[11px] text-stone-400 font-mono">Catalogação CDD & CDU</p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                    isActive
                      ? 'bg-amber-600/20 text-amber-300 border border-amber-500/30 shadow-sm'
                      : 'text-stone-300 hover:text-white hover:bg-stone-800/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Architecture Badge */}
          <div className="flex items-center gap-2">
            <Link
              to="/sitemap"
              title="Clique para ver o diagnóstico de roteamento híbrido"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-full border transition-all text-xs font-mono font-medium hover:border-amber-400"
              style={{
                backgroundColor: isPreview ? '#1e293b' : '#064e3b',
                borderColor: isPreview ? '#3b82f6' : '#10b981',
                color: isPreview ? '#93c5fd' : '#a7f3d0',
              }}
            >
              <span className={`w-2 h-2 rounded-full animate-pulse ${isPreview ? 'bg-blue-400' : 'bg-emerald-400'}`} />
              <span className="hidden sm:inline">Modo:</span>
              <span>{isPreview ? 'Preview (HashRouter)' : 'Produção (BrowserRouter)'}</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
