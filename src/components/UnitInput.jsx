import React, { useContext, useEffect } from 'react';
import { MeasurementContext } from '../context/MeasurementContext';
import { useUnits } from '../hooks/useUnits';
import '../styles/UnitInput.css';

export function UnitInput({ label, position }) {
  const { state, setFromValue, setToValue, setFromUnit, setToUnit } = useContext(MeasurementContext);
  const { units } = useUnits();

  const isFromInput = position === 'from';
  const value = isFromInput ? state.fromValue : state.toValue;
  const unit = isFromInput ? state.fromUnit : state.toUnit;

  // ✅ DEBUG logging
  useEffect(() => {
    console.log(`📊 UnitInput [${label}] - Units available:`, units.length, 'Selected unit:', unit);
  }, [units, unit, label]);

  // Auto-select first unit if none selected and units are available
  useEffect(() => {
    if (units.length > 0 && !unit) {
      const firstSymbol = units[0].symbol;
      console.log(`🔧 Auto-selecting first unit for ${label}: ${firstSymbol}`);
      if (isFromInput) {
        setFromUnit(firstSymbol);
      } else {
        setToUnit(firstSymbol);
      }
    }
  }, [units, unit, isFromInput, setFromUnit, setToUnit, label]);

  const handleValueChange = (e) => {
    const newValue = e.target.value;
    console.log(`📝 ${label} value changed: ${newValue}`);
    if (isFromInput) {
      setFromValue(newValue);
    } else {
      setToValue(newValue);
    }
  };

  const handleUnitChange = (e) => {
    const newUnit = e.target.value;
    console.log(`📍 ${label} unit changed: ${newUnit}`);
    if (newUnit) {
      if (isFromInput) {
        setFromUnit(newUnit);
      } else {
        setToUnit(newUnit);
      }
    }
  };

  return (
    <div className="unit-input-container">
      <label className="input-label">{label}</label>
      <div className="input-group">
        <input
          type="number"
          className="value-input"
          value={value}
          onChange={handleValueChange}
          placeholder="Enter value"
          step="any"
        />
        <select
          className="unit-select"
          value={unit}
          onChange={handleUnitChange}
        >
          <option value="">-- Select unit --</option>
          {units && units.length > 0 ? (
            units.map((u) => (
              <option key={u.id} value={u.symbol}>
                {u.label} ({u.symbol})
              </option>
            ))
          ) : (
            <option disabled>Loading...</option>
          )}
        </select>
      </div>
    </div>
  );
}
