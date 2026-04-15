import React, { useContext, useEffect, useState } from 'react';
import { MeasurementContext } from '../context/MeasurementContext';
import '../styles/ResultDisplay.css';

export function ResultDisplay() {
  const { state } = useContext(MeasurementContext);
  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    if (state.result) {
      setIsNew(true);
      const timer = setTimeout(() => setIsNew(false), 600);
      return () => clearTimeout(timer);
    }
  }, [state.result]);

  return (
    <div className="result-display">
      <div className={`result-box ${isNew ? 'highlight' : ''}`}>
        <div className="result-label">Result</div>
        <div className="result-value">
          {state.result || '—'}
        </div>
      </div>
    </div>
  );
}
