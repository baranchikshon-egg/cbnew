import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import type { UserItem, Transaction, UpgradeRecord } from '@/lib/types';
import { formatPrice, timeAgo } from '@/lib/utils';
import ItemCard from '@/components/ItemCard';
import { Package, Wallet, TrendingUp, Coins, Trophy, MousePointerClick } from 'lucide-react';

interface ProfilePageProps {
  onNavigate: (page: string) => void;
}

type Tab = 'inventory' | 'history' | 'upgrades';

export default function ProfilePage({ onNavigate }: ProfilePageProps) {
  const { profile, session } = useAuth();
  const [tab, setTab] = useState<Tab>('inventory');
  const [items, setItems] = useState<UserItem[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [upgrades, setUpgrades] = useState<UpgradeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selling, setSelling] = useState<string | null>(null);

  useEffect(() => {
    if (!session) return;
    const userId = session.user.id;

    Promise.all([
      supabase.from('user_items').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
      supabase.from('transactions').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(50),
      supabase.from('upgrades').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(50),
    ]).then(([itemsRes, txRes, upRes]) => {
      if (itemsRes.data) setItems(itemsRes.data as UserItem[]);
      if (txRes.data) setTransactions(txRes.data as Transaction[]);
      if (upRes.data) setUpgrades(upRes.data as UpgradeRecord[]);
      setLoading(false);
    });
  }, [session]);

  async function sellItem(item: UserItem) {
    if (!profile) return;
    setSelling(item.id);

    // Add item price to balance
    const newBalance = profile.balance + item.price;
    await supabase.from('profiles').update({ balance: newBalance }).eq('id', profile.id);

    // Mark item as sold
    await supabase.from('user_items').update({ status: 'sold' }).eq('id', item.id);

    // Record transaction
    await supabase.from('transactions').insert({
      user_id: profile.id,
      type: 'sell',
      amount: item.price,
      method: 'balance',
      description: `Продажа: ${item.name}`,
    });

    // Update local state
    setItems((prev) => prev.filter((i) => i.id !== item.id));
    setTransactions((prev) => [{
      id: 'temp-' + Date.now(),
      user_id: profile.id,
      type: 'sell',
      amount: item.price,
      status: 'completed',
      method: 'balance',
      description: `Продажа: ${item.name}`,
      created_at: new Date().toISOString(),
    }, ...prev]);

    setSelling(null);
    // Refresh profile balance
    window.location.reload();
  }

  if (!profile) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-500 font-body">Войдите для просмотра профиля</p>
      </div>
    );
  }

  const inventoryItems = items.filter((i) => i.status === 'inventory');
  const visibleTransactions = transactions.filter((t) => t.type !== 'withdraw' && t.type !== 'deposit');
  const totalInvValue = inventoryItems.reduce((sum, i) => sum + i.price, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Profile header */}
      <div className="bg-css-panel border border-css-border p-6 mb-6 flex flex-col md:flex-row items-center gap-6">
        <div className="w-20 h-20 bg-gradient-to-br from-css-orange to-css-orange-dark flex items-center justify-center flex-shrink-0">
          <span className="font-display font-bold text-black text-2xl">
            {profile.username.slice(0, 2).toUpperCase()}
          </span>
        </div>
        <div className="flex-1 text-center md:text-left">
          <h1 className="font-display text-3xl uppercase tracking-wider text-white">{profile.username}</h1>
          {profile.steam_id && (
            <p className="text-xs text-gray-500 font-mono-cs mt-1">Steam: {profile.steam_id}</p>
          )}
          <div className="flex flex-wrap gap-4 mt-3 justify-center md:justify-start">
            <div className="flex items-center gap-1.5">
              <Wallet size={14} className="text-css-orange" />
              <span className="text-sm font-mono-cs text-css-tan">{formatPrice(profile.balance)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Package size={14} className="text-gray-500" />
              <span className="text-sm text-gray-400">{inventoryItems.length} предметов</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Coins size={14} className="text-gray-500" />
              <span className="text-sm text-gray-400">Инвентарь: {formatPrice(totalInvValue)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Trophy size={14} className="text-gray-500" />
              <span className="text-sm text-gray-400">{profile.cases_opened} кейсов открыто</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => onNavigate('clicker')}
          className="flex items-center gap-2 bg-css-orange hover:bg-css-orange-light text-black font-display font-bold uppercase tracking-wider px-6 py-2.5 transition-colors"
        >
          <MousePointerClick size={18} />
          Фармить
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-css-border">
        {[
          { id: 'inventory' as Tab, label: 'Инвентарь', icon: Package },
          { id: 'history' as Tab, label: 'История операций', icon: Wallet },
          { id: 'upgrades' as Tab, label: 'Апгрейды', icon: TrendingUp },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-3 font-display text-sm uppercase tracking-wider transition-colors relative ${
              tab === t.id ? 'text-css-orange' : 'text-gray-500 hover:text-white'
            }`}
          >
            <t.icon size={16} /> {t.label}
            {tab === t.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-css-orange" />}
          </button>
        ))}
      </div>

      {/* Content */}
      {tab === 'inventory' && (
        <div>
          {loading ? (
            <p className="text-gray-600 font-body text-center py-12">Загрузка...</p>
          ) : inventoryItems.length === 0 ? (
            <div className="text-center py-20">
              <Package size={48} className="text-gray-700 mx-auto mb-4" />
              <p className="text-gray-500 font-body mb-4">Инвентарь пуст</p>
              <button onClick={() => onNavigate('cases')} className="text-css-orange hover:underline font-body">
                Открыть первый кейс →
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {inventoryItems.map((item) => (
                <div key={item.id} className="relative group">
                  <ItemCard
                    name={item.name}
                    weapon={item.weapon}
                    rarity={item.rarity}
                    wear={item.wear}
                    price={item.price}
                    imageUrl={item.image_url}
                    size="md"
                  />
                  <div className="mt-2 flex gap-1">
                    <button
                      onClick={() => sellItem(item)}
                      disabled={selling === item.id}
                      className="flex-1 bg-css-green/20 border border-css-green/50 text-css-green hover:bg-css-green/30 py-1.5 font-display text-[10px] uppercase tracking-wider transition-colors disabled:opacity-50"
                    >
                      {selling === item.id ? '...' : `Продать ${formatPrice(item.price)}`}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'history' && (
        <div className="bg-css-panel border border-css-border">
          {visibleTransactions.length === 0 ? (
            <p className="text-gray-600 font-body text-center py-12">Нет операций</p>
          ) : (
            <div className="divide-y divide-css-border">
              {visibleTransactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between px-4 py-3 hover:bg-css-panel-light transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 ${tx.amount >= 0 ? 'bg-css-green' : 'bg-css-red'}`} />
                    <div>
                      <p className="font-body text-sm text-white">{tx.description || tx.type}</p>
                      <p className="text-[10px] text-gray-500 font-body">{timeAgo(tx.created_at)} · {tx.type}</p>
                    </div>
                  </div>
                  <span className={`font-mono-cs font-bold text-sm ${tx.amount >= 0 ? 'text-css-green' : 'text-css-red'}`}>
                    {tx.amount >= 0 ? '+' : ''}{formatPrice(tx.amount)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'upgrades' && (
        <div className="bg-css-panel border border-css-border">
          {upgrades.length === 0 ? (
            <p className="text-gray-600 font-body text-center py-12">Нет апгрейдов</p>
          ) : (
            <div className="divide-y divide-css-border">
              {upgrades.map((up) => (
                <div key={up.id} className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className={`px-2 py-1 font-display text-[10px] uppercase ${up.success ? 'bg-css-green/20 text-css-green' : 'bg-css-red/20 text-css-red'}`}>
                      {up.success ? 'УСПЕХ' : 'ПРОМАХ'}
                    </div>
                    <div>
                      <p className="font-body text-sm text-white">
                        {up.input_item_name} → {up.target_item_name}
                      </p>
                      <p className="text-[10px] text-gray-500 font-body">
                        {(up.chance * 100).toFixed(1)}% · {timeAgo(up.created_at)}
                      </p>
                    </div>
                  </div>
                  <span className={`font-mono-cs font-bold text-sm ${up.success ? 'text-css-green' : 'text-css-red'}`}>
                    {up.success ? `+${formatPrice(up.target_item_price)}` : `-${formatPrice(up.input_item_price)}`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
