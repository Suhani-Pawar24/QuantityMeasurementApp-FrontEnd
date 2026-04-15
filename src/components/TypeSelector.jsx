import React, { useContext } from 'react';
import { MeasurementContext } from '../context/MeasurementContext';
import '../styles/TypeSelector.css';

export function TypeSelector() {
  const { state, setType } = useContext(MeasurementContext);

  const types = [
    { id: 'LENGTH', label: 'Length', icon: '📐' },
    { id: 'WEIGHT', label: 'Weight', icon: '⚖️' },
    { id: 'TEMPERATURE', label: 'Temperature', icon: '🌡️' },
    { id: 'VOLUME', label: 'Volume', icon: '🥤' },
  ];

  const handleTypeClick = (typeId) => {
    console.log(`🔄 Type changed: ${state.selectedType} → ${typeId}`);
    setType(typeId);
  };

  return (
    <div className="type-selector">
      <label className="selector-label">Choose Type</label>
      <div className="type-buttons">
        {types.map((type) => (
          <button
            key={type.id}
            className={`type-btn ${state.selectedType === type.id ? 'active' : ''}`}
            onClick={() => handleTypeClick(type.id)}
          >
            <span className="type-icon">{type.icon}</span>
            <span className="type-name">{type.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
