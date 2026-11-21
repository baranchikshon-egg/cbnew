import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Case } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import LiveDropsTicker from '@/components/LiveDropsTicker';
import CaseIcon from '@/components/CaseIcon';
import { ChevronRight, Flame, TrendingUp } from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: string) => void;
  onOpenCase: (caseData: Case) => void;
}

export default function HomePage({ onNavigate, onOpenCase }: HomePageProps) {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div>
      <LiveDropsTicker />

      {/* Hero */}
      <div className="relative css-grid-bg border-b border-css-border overflow-hidden">
        <div className="absolute inset-0 css-stripes" />
        <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-28 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-css-orange/10 border border-css-orange/30 mb-6">
            <Flame size={14} className="text-css-orange" />
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-bold text-white uppercase tracking-wider mb-4 text-shadow-lg">
            Открывай кейсы.<br />
            <span className="text-css-orange">Забирай скины.</span>
          </h1>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('cases')}
              className="flex items-center gap-2 bg-css-orange hover:bg-css-orange-light text-black font-display font-bold uppercase tracking-wider px-8 py-3 transition-colors text-lg"
            >
              Открыть кейс <ChevronRight size={20} />
            </button>
            <button
              onClick={() => onNavigate('upgrade')}
              className="flex items-center gap-2 bg-css-panel border border-css-border hover:border-css-orange text-white font-display font-bold uppercase tracking-wider px-8 py-3 transition-colors text-lg"
            >
              <TrendingUp size={18} /> Апгрейд
            </button>
          </div>
        </div>
      </div>

      {/* Cases preview */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl uppercase tracking-wider text-white">Популярные кейсы</h2>
          <button
            onClick={() => onNavigate('cases')}
            className="text-sm text-gray-400 hover:text-css-orange font-body uppercase tracking-wider flex items-center gap-1"
          >
            Все кейсы <ChevronRight size={16} />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-[240px] bg-css-panel border border-css-border animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {cases.map((c) => (
              <button
                key={c.id}
                onClick={() => onOpenCase(c)}
                className="group relative bg-css-panel border-2 border-css-border hover:border-css-orange transition-all overflow-hidden"
                style={{ '--case-accent': c.accent_color } as React.CSSProperties}
              >
                <div className="absolute inset-0 opacity-5 css-grid-bg" />
                <div
                  className="h-1 w-full"
                  style={{ background: c.accent_color }}
                />

                {/* Case visual */}
                <div className="h-[140px] flex items-center justify-center relative">
                  <div className="transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <CaseIcon name={c.name} accentColor={c.accent_color} size={90} />
                  </div>
                </div>

                {/* Info */}
                <div className="px-3 pb-3">
                  <h3 className="font-display text-sm uppercase tracking-wider text-white truncate group-hover:text-css-orange transition-colors">
                    {c.name}
                  </h3>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-mono-cs text-sm font-bold text-css-tan">{formatPrice(c.price)}</span>
                    <span className="text-[10px] font-display uppercase text-gray-500 group-hover:text-css-orange transition-colors">Открыть</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Features strip */}
      <div className="border-t border-css-border bg-css-darker">
        <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-css-orange/10 border border-css-orange/30 flex items-center justify-center flex-shrink-0">
              <Flame size={20} className="text-css-orange" />
            </div>
            <div>
              <h3 className="font-display text-sm uppercase tracking-wider text-white">Открытие кейсов</h3>
              <p className="text-xs text-gray-500 font-body mt-1">Анимация прокрутки ленты, честные шансы, мгновенный выигрыш в инвентарь.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-css-orange/10 border border-css-orange/30 flex items-center justify-center flex-shrink-0">
              <TrendingUp size={20} className="text-css-orange" />
            </div>
            <div>
              <h3 className="font-display text-sm uppercase tracking-wider text-white">Апгрейды</h3>
              <p className="text-xs text-gray-500 font-body mt-1">Выбери скин и цель — крути колесо и повышай ценность.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-css-orange/10 border border-css-orange/30 flex items-center justify-center flex-shrink-0">
              <ChevronRight size={20} className="text-css-orange" />
            </div>
            <div>
              <h3 className="font-display text-sm uppercase tracking-wider text-white">Лента дропов</h3>
              <p className="text-xs text-gray-500 font-body mt-1">Реальное время: видишь, что выпало у других игроков прямо сейчас.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
