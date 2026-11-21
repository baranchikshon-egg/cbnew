import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { LiveDrop } from '@/lib/types';

interface LiveDropsContextValue {
  drops: LiveDrop[];
  addDrop: (drop: LiveDrop) => void;
}

const LiveDropsContext = createContext<LiveDropsContextValue | undefined>(undefined);

export function LiveDropsProvider({ children }: { children: ReactNode }) {
  const [drops, setDrops] = useState<LiveDrop[]>([]);

  useEffect(() => {
    // Fetch initial drops
    supabase
      .from('live_drops')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(40)
      .then(({ data }) => {
        if (data) setDrops(data as LiveDrop[]);
      });

    // Subscribe to new drops
    const channel = supabase
      .channel('live_drops')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'live_drops' }, (payload) => {
        const newDrop = payload.new as LiveDrop;
        setDrops((prev) => [newDrop, ...prev].slice(0, 40));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const addDrop = useCallback((drop: LiveDrop) => {
    setDrops((prev) => [drop, ...prev].slice(0, 40));
  }, []);

  return (
    <LiveDropsContext.Provider value={{ drops, addDrop }}>
      {children}
    </LiveDropsContext.Provider>
  );
}

export function useLiveDrops() {
  const ctx = useContext(LiveDropsContext);
  if (!ctx) throw new Error('useLiveDrops must be used within LiveDropsProvider');
  return ctx;
}
