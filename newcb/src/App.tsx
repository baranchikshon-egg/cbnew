import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from '@/lib/auth';
import { LiveDropsProvider } from '@/lib/livedrops';
import { supabase } from '@/lib/supabase';
import type { Case, CaseItem } from '@/lib/types';
import { skinCatalog } from '@/lib/skinCatalog';
import Header from '@/components/Header';
import HomePage from '@/pages/HomePage';
import CasesPage from '@/pages/CasesPage';
import CaseOpenPage from '@/pages/CaseOpenPage';
import UpgradePage from '@/pages/UpgradePage';
import ProfilePage from '@/pages/ProfilePage';
import ClickerPage from '@/pages/ClickerPage';
import LiveDropsPage from '@/pages/LiveDropsPage';
import { Shield, Zap } from 'lucide-react';

type Page = 'home' | 'cases' | 'case-open' | 'upgrade' | 'live' | 'profile' | 'clicker';

function AppContent() {
  const { loading } = useAuth();
  const [page, setPage] = useState<Page>('home');
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [caseItems, setCaseItems] = useState<CaseItem[]>([]);
  const [itemsLoading, setItemsLoading] = useState(false);

  function navigate(p: string) {
    setPage(p as Page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function openCase(caseData: Case) {
    setSelectedCase(caseData);
    setItemsLoading(true);
    setCaseItems([]);
    supabase
      .from('case_items')
      .select('*')
      .eq('case_id', caseData.id)
      .order('sort_order')
      .then(({ data, error }) => {
        const catalogItems = skinCatalog
          .filter((item) => item.caseSlug === caseData.slug)
          .map((item, index) => ({
            ...item,
            case_id: caseData.id,
            sort_order: index,
          }));

        if (catalogItems.length > 0) {
          setCaseItems(catalogItems as CaseItem[]);
        } else if (!error && data) {
          setCaseItems(data as CaseItem[]);
        }
        setItemsLoading(false);
      });
    setPage('case-open');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-css-dark flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-css-orange flex items-center justify-center transform skew-x-[-8deg] mx-auto mb-4 animate-pulse">
            <span className="font-display font-bold text-black text-2xl transform skew-x-[8deg]">CS</span>
          </div>
          <p className="text-gray-600 font-display text-sm uppercase tracking-widest animate-pulse">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-css-dark flex flex-col">
      <Header currentPage={page} onNavigate={navigate} />

      <main className="flex-1">
        {page === 'home' && <HomePage onNavigate={navigate} onOpenCase={openCase} />}
        {page === 'cases' && <CasesPage onOpenCase={openCase} />}
        {page === 'case-open' && selectedCase && (
          itemsLoading ? (
            <div className="py-20 text-center">
              <p className="text-gray-600 font-body animate-pulse">Загрузка содержимого кейса...</p>
            </div>
          ) : caseItems.length > 0 ? (
            <CaseOpenPage
              caseData={selectedCase}
              items={caseItems}
              onBack={() => navigate('cases')}
              onNavigate={navigate}
            />
          ) : (
            <div className="py-20 text-center">
              <p className="text-gray-600 font-body">Кейс пуст или не найден</p>
              <button onClick={() => navigate('cases')} className="text-css-orange hover:underline font-body mt-2">
                ← К кейсам
              </button>
            </div>
          )
        )}
        {page === 'upgrade' && <UpgradePage onNavigate={navigate} />}
        {page === 'live' && <LiveDropsPage />}
        {page === 'profile' && <ProfilePage onNavigate={navigate} />}
        {page === 'clicker' && <ClickerPage onNavigate={navigate} />}
      </main>

      {/* Footer */}
      <footer className="bg-black border-t border-css-border mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-css-orange flex items-center justify-center transform skew-x-[-8deg]">
                  <span className="font-display font-bold text-black text-sm transform skew-x-[8deg]">CS</span>
                </div>
                <span className="font-display font-bold text-white text-lg tracking-wider">CRATE SOURCE</span>
              </div>
              <p className="text-xs text-gray-600 font-body">
                Сайт для открытия кейсов и апгрейдов в стиле Counter-Strike: Source. Provably Fair.
              </p>
            </div>

            <div>
              <h4 className="font-display text-sm uppercase tracking-wider text-gray-400 mb-3">Навигация</h4>
              <div className="flex flex-col gap-1.5">
                <button onClick={() => navigate('cases')} className="text-xs text-gray-600 hover:text-css-orange font-body text-left transition-colors">Кейсы</button>
                <button onClick={() => navigate('upgrade')} className="text-xs text-gray-600 hover:text-css-orange font-body text-left transition-colors">Апгрейд</button>
                <button onClick={() => navigate('live')} className="text-xs text-gray-600 hover:text-css-orange font-body text-left transition-colors">Лента дропов</button>
              </div>
            </div>

            <div>
              <h4 className="font-display text-sm uppercase tracking-wider text-gray-400 mb-3">Информация</h4>
              <div className="flex flex-col gap-1.5">
                <span className="text-xs text-gray-600 font-body flex items-center gap-1.5">
                  <Shield size={12} className="text-css-green" /> Provably Fair система
                </span>
                <span className="text-xs text-gray-600 font-body flex items-center gap-1.5">
                  <Zap size={12} className="text-css-orange" /> Мгновенная выдача
                </span>
                <span className="text-xs text-gray-600 font-body">18+ Только для совершеннолетних</span>
              </div>
            </div>
          </div>

          <div className="border-t border-css-border pt-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-[10px] text-gray-700 font-body uppercase tracking-widest">
              © 2026 CS Crate Source. Демонстрационный проект.
            </p>
            <p className="text-[10px] text-gray-700 font-body">
              Игра может вызывать зависимость. Играйте ответственно.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <LiveDropsProvider>
        <AppContent />
      </LiveDropsProvider>
    </AuthProvider>
  );
}
