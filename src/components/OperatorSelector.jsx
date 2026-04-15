import React, { useContext } from 'react';
import { MeasurementContext } from '../context/MeasurementContext';
import '../styles/OperatorSelector.css';

export function OperatorSelector() {
  const { state, setOperator } = useContext(MeasurementContext);

  const operators = [
    { symbol: '+', label: 'Addition' },
    { symbol: '-', label: 'Subtraction' },
    { symbol: '*', label: 'Multiplication' },
    { symbol: '/', label: 'Division' },
  ];

  if (state.selectedAction !== 'Arithmetic') {
    return null;
  }

  return (
    <div className="operator-selector">
      <label className="selector-label">Select Operator</label>
      <div className="operator-buttons">
        {operators.map((op) => (
          <button
            key={op.symbol}
            className={`operator-btn ${state.operator === op.symbol ? 'active' : ''}`}
            onClick={() => setOperator(op.symbol)}
            title={op.label}
          >
            {op.symbol}
          </button>
        ))}
      </div>
    </div>
  );
}
