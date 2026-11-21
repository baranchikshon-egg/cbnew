import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import AuthModal from './AuthModal';
import { formatPrice } from '@/lib/utils';
import { Package, Wallet, LogOut, User as UserIcon, Shield, MousePointerClick } from 'lucide-react';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function Header({ currentPage, onNavigate }: HeaderProps) {
  const { session, profile, signOut } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Главная' },
    { id: 'cases', label: 'Кейсы' },
    { id: 'upgrade', label: 'Апгрейд' },
    { id: 'clicker', label: 'Фарм' },
    { id: 'live', label: 'Дропы' },
  ];

  return (
    <>
      {/* Top utility bar */}
      <div className="w-full bg-black border-b border-css-border/50">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-8">
          <div className="flex items-center gap-3 text-[10px] font-body uppercase tracking-widest text-gray-600">
            <Shield size={12} className="text-css-green" />
            <span>Защищено Provably Fair</span>
          </div>
          <div className="flex items-center gap-3 text-[10px] font-body uppercase tracking-widest text-gray-600">
            <span>Онлайн: <span className="text-css-green">{Math.floor(Math.random() * 500 + 800)}</span></span>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header className="sticky top-0 z-40 bg-css-dark border-b-2 border-css-orange/30 css-stripes">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
          {/* Logo */}
          <button onClick={() => onNavigate('home')} className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-css-orange flex items-center justify-center transform skew-x-[-8deg] group-hover:skew-x-0 transition-transform">
              <span className="font-display font-bold text-black text-xl transform skew-x-[8deg]">CS</span>
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-display font-bold text-white text-xl tracking-wider">CRATE</span>
              <span className="text-[8px] font-body uppercase tracking-[0.3em] text-css-orange">Source</span>
            </div>
          </button>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`px-4 py-2 font-display text-sm uppercase tracking-wider transition-all relative ${
                  currentPage === item.id
                    ? 'text-css-orange'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {item.label}
                {currentPage === item.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-css-orange" />
                )}
              </button>
            ))}
          </nav>

          {/* Right side: balance / auth */}
          <div className="flex items-center gap-2">
            {session && profile ? (
              <>
                <button
                  onClick={() => onNavigate('clicker')}
                  className="flex items-center gap-2 bg-css-panel border border-css-border hover:border-css-orange px-3 py-1.5 transition-colors group"
                >
                  <Wallet size={16} className="text-css-orange" />
                  <span className="font-mono-cs font-bold text-sm text-css-tan">{formatPrice(profile.balance)}</span>
                  <span className="text-[10px] font-display uppercase text-gray-500 group-hover:text-css-orange transition-colors">+</span>
                </button>

                <button
                  onClick={() => onNavigate('profile')}
                  className="flex items-center gap-2 bg-css-panel border border-css-border hover:border-css-orange px-3 py-1.5 transition-colors"
                >
                  <div className="w-7 h-7 bg-gradient-to-br from-css-orange to-css-orange-dark flex items-center justify-center">
                    <span className="font-display font-bold text-black text-sm">
                      {profile.username.slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <span className="hidden sm:block font-body text-sm text-white max-w-[80px] truncate">{profile.username}</span>
                </button>

                <button
                  onClick={() => signOut()}
                  className="p-2 text-gray-500 hover:text-css-red transition-colors"
                  title="Выйти"
                >
                  <LogOut size={16} />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setAuthOpen(true)}
                  className="px-4 py-1.5 font-display text-sm uppercase tracking-wider text-gray-300 hover:text-white border border-css-border hover:border-css-orange transition-colors"
                >
                  Вход
                </button>
                <button
                  onClick={() => setAuthOpen(true)}
                  className="px-4 py-1.5 font-display text-sm uppercase tracking-wider bg-css-orange hover:bg-css-orange-light text-black transition-colors"
                >
                  Регистрация
                </button>
              </>
            )}
          </div>
        </div>

        {/* Mobile nav */}
        <nav className="md:hidden flex items-center gap-1 px-4 pb-2 overflow-x-auto css-scroll">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`px-3 py-1.5 font-display text-xs uppercase tracking-wider whitespace-nowrap transition-all ${
                currentPage === item.id
                  ? 'text-css-orange border-b-2 border-css-orange'
                  : 'text-gray-400'
              }`}
            >
              {item.label}
            </button>
          ))}
          {session && (
            <>
              <button onClick={() => onNavigate('profile')} className="px-3 py-1.5 font-display text-xs uppercase tracking-wider text-gray-400 whitespace-nowrap">
                <Package size={14} className="inline" /> Инвентарь
              </button>
              <button onClick={() => onNavigate('clicker')} className="px-3 py-1.5 font-display text-xs uppercase tracking-wider text-gray-400 whitespace-nowrap">
                <MousePointerClick size={14} className="inline" /> Фарм
              </button>
            </>
          )}
        </nav>
      </header>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
