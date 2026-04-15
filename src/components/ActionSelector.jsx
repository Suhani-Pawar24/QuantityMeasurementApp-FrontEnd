import React, { useContext } from 'react';
import { MeasurementContext } from '../context/MeasurementContext';
import '../styles/ActionSelector.css';

export function ActionSelector() {
  const { state, setAction } = useContext(MeasurementContext);

  const actions = [
    { id: 'Conversion', label: 'Conversion', icon: '🔄' },
    { id: 'Comparison', label: 'Comparison', icon: '⚖️' },
    { id: 'Arithmetic', label: 'Arithmetic', icon: '➕' },
  ];

  return (
    <div className="action-selector">
      <label className="selector-label">Choose Action</label>
      <div className="action-buttons">
        {actions.map((action) => (
          <button
            key={action.id}
            className={`action-btn ${state.selectedAction === action.id ? 'active' : ''}`}
            onClick={() => setAction(action.id)}
          >
            <span className="action-icon">{action.icon}</span>
            <span className="action-name">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
