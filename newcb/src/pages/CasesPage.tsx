import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Case } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import CaseIcon from '@/components/CaseIcon';
import { Search } from 'lucide-react';

interface CasesPageProps {
  onOpenCase: (caseData: Case) => void;
}

export default function CasesPage({ onOpenCase }: CasesPageProps) {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<'price-asc' | 'price-desc' | 'name'>('price-asc');

  useEffect(() => {
    supabase
      .from('cases')
      .select('*')
      .eq('is_active', true)
      .order('sort_order')
      .then(({ data, error }) => {
        if (!error && data) setCases(data as Case[]);
        setLoading(false);
      });
  }, []);

  const filtered = cases
    .filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price;
      if (sort === 'price-desc') return b.price - a.price;
      return a.name.localeCompare(b.name);
    });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-display text-4xl uppercase tracking-wider text-white mb-2">Каталог кейсов</h1>
        <p className="text-gray-500 font-body">Выберите кейс, чтобы увидеть содержимое и открыть его</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск кейса..."
            className="w-full bg-css-panel border border-css-border pl-10 pr-3 py-2.5 text-white font-body text-sm focus:border-css-orange focus:outline-none transition-colors"
          />
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as typeof sort)}
          className="bg-css-panel border border-css-border px-3 py-2.5 text-white font-body text-sm focus:border-css-orange focus:outline-none transition-colors"
        >
          <option value="price-asc">Цена: по возрастанию</option>
          <option value="price-desc">Цена: по убыванию</option>
          <option value="name">По названию</option>
        </select>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-[240px] bg-css-panel border border-css-border animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-600 font-body">Кейсы не найдены</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {filtered.map((c) => (
            <button
              key={c.id}
              onClick={() => onOpenCase(c)}
              className="group relative bg-css-panel border-2 border-css-border hover:border-css-orange transition-all overflow-hidden animate-slide-up"
            >
              <div className="absolute inset-0 opacity-5 css-grid-bg" />
              <div className="h-1 w-full" style={{ background: c.accent_color }} />

              <div className="h-[140px] flex items-center justify-center relative">
                <div className="transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <CaseIcon name={c.name} accentColor={c.accent_color} size={90} />
                </div>
              </div>

              <div className="px-3 pb-3">
                <h3 className="font-display text-sm uppercase tracking-wider text-white truncate group-hover:text-css-orange transition-colors">
                  {c.name}
                </h3>
                <div className="flex items-center justify-between mt-2">
                  <span className="font-mono-cs text-sm font-bold text-css-tan">{formatPrice(c.price)}</span>
                  <span className="text-[10px] font-display uppercase text-gray-500 group-hover:text-css-orange transition-colors">Открыть →</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
