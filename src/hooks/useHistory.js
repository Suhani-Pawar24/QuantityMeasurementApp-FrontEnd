import { useState, useEffect, useCallback } from 'react';
import { historyAPI } from '../services/api';

export function useHistory() {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load history from localStorage
  const loadHistoryFromStorage = useCallback(() => {
    try {
      const stored = localStorage.getItem('calculationHistory');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.warn('Could not parse history from storage:', e);
      return [];
    }
  }, []);

  // Save history to localStorage
  const saveToLocalStorage = useCallback((historyData) => {
    try {
      localStorage.setItem('calculationHistory', JSON.stringify(historyData));
    } catch (e) {
      console.warn('Could not save history to storage:', e);
    }
  }, []);

  const fetchHistory = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // First, try to get from localStorage (always available)
      const stored = localStorage.getItem('calculationHistory');
      let historyData = stored ? JSON.parse(stored) : [];
      console.log('📦 Loaded from localStorage:', historyData.length, 'records');
      
      // Then try to sync from backend if available
      try {
        const response = await historyAPI.getAll();
        
        // Handle various API response formats
        let backendData = [];
        if (response.data?.data?.data) {
          backendData = response.data.data.data;
        } else if (response.data?.data) {
          backendData = response.data.data;
        } else if (Array.isArray(response.data)) {
          backendData = response.data;
        }
        
        if (backendData.length > 0) {
          console.log('📡 Synced from backend:', backendData.length, 'records');
          historyData = backendData;
          saveToLocalStorage(historyData);
        }
      } catch (syncError) {
        console.warn('Backend sync failed, using localStorage:', syncError.message);
        // Already have localStorage data, so this is fine
      }
      
      // Ensure all records have required fields
      historyData = historyData.map((record, index) => ({
        id: record.id || `${Date.now()}-${index}`,
        type: record.type || 'UNKNOWN',
        action: record.action || 'UNKNOWN',
        expression: record.expression || '',
        result: record.result || '',
        timestamp: record.timestamp || new Date().toISOString(),
      }));
      
      setHistory(historyData);
      setError(null);
    } catch (error) {
      console.error('❌ Error loading history:', error.message);
      setError('Could not load history: ' + error.message);
      setHistory([]);
    } finally {
      setIsLoading(false);
    }
  }, [saveToLocalStorage]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const saveHistory = useCallback(async (record) => {
    try {
      // Save to backend first
      await historyAPI.save(record);
      console.log('✅ History saved to backend');
      await fetchHistory();
    } catch (error) {
      console.warn('⚠️ Could not save history to backend, saving locally:', error.message);
      
      // Fallback: save to localStorage only
      const storedHistory = loadHistoryFromStorage();
      const newRecord = {
        id: `${Date.now()}`,
        type: record.type || 'UNKNOWN',
        action: record.action || 'UNKNOWN',
        expression: record.expression || '',
        result: record.result || '',
        timestamp: record.timestamp || new Date().toISOString(),
      };
      const updated = [newRecord, ...storedHistory];
      saveToLocalStorage(updated);
      setHistory(updated);
    }
  }, [fetchHistory, loadHistoryFromStorage, saveToLocalStorage]);

  const deleteRecord = useCallback(async (id) => {
    try {
      // Try to delete from backend
      await historyAPI.delete(id);
      console.log('✅ History record deleted from backend');
    } catch (error) {
      console.warn('⚠️ Could not delete from backend:', error.message);
    }
    
    // Always update local state and storage
    const updated = history.filter(record => record.id !== id);
    setHistory(updated);
    saveToLocalStorage(updated);
  }, [history, saveToLocalStorage]);

  const clearAll = useCallback(async () => {
    try {
      // Try to clear from backend
      await historyAPI.clearAll();
      console.log('✅ All history cleared from backend');
    } catch (error) {
      console.warn('⚠️ Could not clear backend history:', error.message);
    }
    
    // Always clear local state and storage
    setHistory([]);
    saveToLocalStorage([]);
  }, [saveToLocalStorage]);

  const refresh = useCallback(() => {
    fetchHistory();
  }, [fetchHistory]);

  return {
    history,
    isLoading,
    error,
    saveHistory,
    deleteRecord,
    clearAll,
    refresh,
  };
}
