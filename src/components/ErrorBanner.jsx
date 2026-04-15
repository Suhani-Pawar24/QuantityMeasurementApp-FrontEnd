import React, { useContext } from 'react';
import { MeasurementContext } from '../context/MeasurementContext';
import '../styles/ErrorBanner.css';

export function ErrorBanner() {
  const { state, setError } = useContext(MeasurementContext);

  if (!state.error) {
    return null;
  }

  return (
    <div className="error-banner">
      <span className="error-icon">⚠️</span>
      <span className="error-message">{state.error}</span>
      <button
        className="error-close"
        onClick={() => setError(null)}
      >
        ✕
      </button>
    </div>
  );
}
