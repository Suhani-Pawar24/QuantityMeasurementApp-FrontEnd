import React, { useContext, useEffect } from 'react';
import { useHistory } from '../hooks/useHistory';
import { MeasurementContext } from '../context/MeasurementContext';
import '../styles/HistoryList.css';

export function HistoryList() {
  const { history, isLoading, error, deleteRecord, clearAll, refresh } = useHistory();
  const { state } = useContext(MeasurementContext);

  // Refresh history when a result is calculated
  useEffect(() => {
    if (state.result) {
      setTimeout(() => {
        refresh();
      }, 500); // Small delay to allow backend to process
    }
  }, [state.result, refresh]);

  if (isLoading) {
    return (
      <div className="history-container">
        <div className="history-header">
          <h3>Calculation History</h3>
        </div>
        <div className="loading-state">
          <span className="spinner"></span>
          Loading history...
        </div>
      </div>
    );
  }

  // Log the history state for debugging
  console.log('🔍 HistoryList render:', { historyLength: history.length, error });

  return (
    <div className="history-container">
      <div className="history-header">
        <h3>Calculation History</h3>
        {history.length > 0 && (
          <button
            className="btn btn-danger btn-sm"
            onClick={clearAll}
            title="Clear all history"
          >
            Clear All
          </button>
        )}
      </div>

      {error && (
        <div className="error-state">
          <p>⚠️ Error loading history: {error}</p>
        </div>
      )}

      {history.length === 0 ? (
        <div className="empty-state">
          <p>No calculations yet</p>
        </div>
      ) : (
        <div className="history-list">
          {history.map((record, index) => (
            <div key={record.id || index} className="history-item">
              <div className="history-content">
                <div className="history-expression">{record.expression}</div>
                <div className="history-result">{record.result}</div>
                <div className="history-meta">
                  <span className="history-type">{record.type}</span>
                  <span className="history-time">
                    {new Date(record.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>
              <button
                className="history-delete"
                onClick={() => deleteRecord(record.id)}
                title="Delete this record"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
