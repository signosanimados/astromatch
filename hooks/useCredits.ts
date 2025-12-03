import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { logger } from '../lib/logger';

export const useCredits = (userId: string | undefined) => {
  const [credits, setCredits] = useState<number | null>(null);
  const [refreshingCredits, setRefreshingCredits] = useState(false);

  const fetchCredits = useCallback(async () => {
    if (!userId) return;

    setRefreshingCredits(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('credits')
        .eq('id', userId)
        .single();

      if (data) {
        setCredits(data.credits);
      } else if (error) {
        logger.error('Erro ao buscar créditos:', error);
        setCredits(0);
      }
    } catch (e) {
      logger.error("Erro de conexão:", e);
    } finally {
      setTimeout(() => setRefreshingCredits(false), 500);
    }
  }, [userId]);

  const deductCredit = useCallback(async () => {
    if (!userId || credits === null) return false;

    const previousCredits = credits;
    const newCredits = credits - 1;
    setCredits(newCredits);

    try {
      const { error: creditError } = await supabase
        .from('profiles')
        .update({ credits: newCredits })
        .eq('id', userId);

      if (creditError) {
        logger.error("Erro ao deduzir crédito:", creditError);
        setCredits(previousCredits);
        return false;
      }

      return true;
    } catch (e) {
      logger.error("Erro ao deduzir crédito:", e);
      setCredits(previousCredits);
      return false;
    }
  }, [userId, credits]);

  return {
    credits,
    refreshingCredits,
    fetchCredits,
    deductCredit,
    setCredits
  };
};
