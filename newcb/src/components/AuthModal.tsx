import { useState, FormEvent } from 'react';
import { useAuth } from '@/lib/auth';
import { X, User, Mail, Lock } from 'lucide-react';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AuthModal({ open, onClose }: AuthModalProps) {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (mode === 'register') {
      if (username.trim().length < 3) {
        setError('Имя пользователя должно быть не короче 3 символов');
        setLoading(false);
        return;
      }
      const { error } = await signUp(email, password, username.trim());
      if (error) {
        setError(error);
        setLoading(false);
      } else {
        onClose();
        resetForm();
      }
    } else {
      const { error } = await signIn(email, password);
      if (error) {
        setError(error);
        setLoading(false);
      } else {
        onClose();
        resetForm();
      }
    }
  }

  function resetForm() {
    setEmail('');
    setPassword('');
    setUsername('');
    setError(null);
    setLoading(false);
  }

  function switchMode(newMode: 'login' | 'register') {
    setMode(newMode);
    setError(null);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div
        className="w-full max-w-md bg-css-panel border-2 border-css-border relative animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-css-dark border-b border-css-border">
          <h2 className="font-display text-lg uppercase tracking-wider text-css-orange">
            {mode === 'login' ? 'Вход' : 'Регистрация'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-css-border">
          <button
            onClick={() => switchMode('login')}
            className={`flex-1 py-2 font-display text-sm uppercase tracking-wider transition-colors ${mode === 'login' ? 'bg-css-orange text-black' : 'text-gray-500 hover:text-white'}`}
          >
            Вход
          </button>
          <button
            onClick={() => switchMode('register')}
            className={`flex-1 py-2 font-display text-sm uppercase tracking-wider transition-colors ${mode === 'register' ? 'bg-css-orange text-black' : 'text-gray-500 hover:text-white'}`}
          >
            Регистрация
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {mode === 'register' && (
            <div>
              <label className="text-xs text-gray-400 font-body uppercase tracking-wide mb-1 block">Имя пользователя</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-css-dark border border-css-border pl-10 pr-3 py-2.5 text-white font-body text-sm focus:border-css-orange focus:outline-none transition-colors"
                  placeholder="Ваш никнейм"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs text-gray-400 font-body uppercase tracking-wide mb-1 block">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-css-dark border border-css-border pl-10 pr-3 py-2.5 text-white font-body text-sm focus:border-css-orange focus:outline-none transition-colors"
                placeholder="email@example.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-400 font-body uppercase tracking-wide mb-1 block">Пароль</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-css-dark border border-css-border pl-10 pr-3 py-2.5 text-white font-body text-sm focus:border-css-orange focus:outline-none transition-colors"
                placeholder="Минимум 6 символов"
                required
                minLength={6}
              />
            </div>
          </div>

          {error && (
            <div className="bg-css-red/20 border border-css-red text-css-red px-3 py-2 text-xs font-body animate-shake">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-css-orange hover:bg-css-orange-light text-black font-display font-semibold uppercase tracking-wider py-3 transition-colors disabled:opacity-50"
          >
            {loading ? 'Загрузка...' : mode === 'login' ? 'Войти' : 'Создать аккаунт'}
          </button>

          <p className="text-center text-[10px] text-gray-600 font-body">
            Авторизуясь, вы соглашаетесь с правилами сайта
          </p>
        </form>
      </div>
    </div>
  );
}
