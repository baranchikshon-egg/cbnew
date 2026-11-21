import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Case } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import { catalogCases, SERIES_LIST } from '@/lib/skinCatalog';
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
  const [activeSeries, setActiveSeries] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from('cases')
      .select('*')
      .eq('is_active', true)
      .order('sort_order')
      .then(({ data, error }) => {
        if (!error && data && data.length > 0) {
          setCases(data as Case[]);
        } else {
          setCases(catalogCases as Case[]);
        }
        setLoading(false);
      });
  }, []);

  const filtered = cases
    .filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
    .filter((c) => !activeSeries || c.series === activeSeries)
    .sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price;
      if (sort === 'price-desc') return b.price - a.price;
      return a.name.localeCompare(b.name);
    });

  const grouped: Record<string, Case[]> = {};
  filtered.forEach((c) => {
    const s = c.series || 'Base';
    if (!grouped[s]) grouped[s] = [];
    grouped[s].push(c);
  });

  const orderedSeries = SERIES_LIST.map((s) => s.name).filter((s) => grouped[s]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-display text-4xl uppercase tracking-wider text-white mb-2">Каталог кейсов</h1>
        <p className="text-gray-500 font-body">35 кейсов в 8 сериях. Выбери серию или ищи по названию</p>
      </div>

      {/* Series tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setActiveSeries(null)}
          className={`px-4 py-2 font-display text-xs uppercase tracking-wider border transition-all ${
            activeSeries === null
              ? 'border-white text-white bg-white/10'
              : 'border-css-border text-gray-500 hover:text-white hover:border-gray-600'
          }`}
        >
          Все серии
        </button>
        {SERIES_LIST.map((s) => (
          <button
            key={s.name}
            onClick={() => setActiveSeries(s.name)}
            className={`px-4 py-2 font-display text-xs uppercase tracking-wider border transition-all ${
              activeSeries === s.name
                ? 'text-white'
                : 'border-css-border text-gray-500 hover:text-white hover:border-gray-600'
            }`}
            style={
              activeSeries === s.name
                ? { borderColor: s.color, background: `${s.color}20`, color: s.color }
                : undefined
            }
          >
            <span
              className="inline-block w-2 h-2 rounded-full mr-2 align-middle"
              style={{ background: s.color }}
            />
            {s.name}
          </button>
        ))}
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

      {/* Series-grouped grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-[240px] bg-css-panel border border-css-border animate-pulse" />
          ))}
        </div>
      ) : orderedSeries.length === 0 ? (
        <div className="text-center py-20 text-gray-600 font-body">Кейсы не найдены</div>
      ) : (
        <div className="space-y-10">
          {orderedSeries.map((seriesName) => {
            const seriesInfo = SERIES_LIST.find((s) => s.name === seriesName);
            return (
              <div key={seriesName}>
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className="inline-block w-3 h-3 rounded-full"
                    style={{ background: seriesInfo?.color || '#e87b1e' }}
                  />
                  <h2 className="font-display text-2xl uppercase tracking-wider text-white">
                    {seriesName}
                  </h2>
                  <span className="text-gray-600 font-body text-sm">
                    {grouped[seriesName].length} кейсов
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {grouped[seriesName].map((c) => (
                    <button
                      key={c.id || c.slug}
                      onClick={() => onOpenCase(c)}
                      className="group relative bg-css-panel border-2 border-css-border hover:border-css-orange transition-all overflow-hidden animate-slide-up"
                    >
                      <div className="absolute inset-0 opacity-5 css-grid-bg" />
                      <div className="h-1 w-full" style={{ background: c.accent_color }} />

                      <div className="h-[140px] flex items-center justify-center relative">
                        <div className="transform group-hover:scale-110 group-hover:-rotate-2 transition-all duration-300">
                          <CaseIcon name={c.name} accentColor={c.accent_color} size={95} />
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
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
