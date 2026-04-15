import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { MeasurementContext } from '../context/MeasurementContext';
import { TypeSelector } from '../components/TypeSelector';
import { ActionSelector } from '../components/ActionSelector';
import { UnitInput } from '../components/UnitInput';
import { OperatorSelector } from '../components/OperatorSelector';
import { ResultDisplay } from '../components/ResultDisplay';
import { ErrorBanner } from '../components/ErrorBanner';
import { HistoryList } from '../components/HistoryList';
import { useConversion } from '../hooks/useConversion';
import { useUnits } from '../hooks/useUnits';
import '../styles/MeasurementApp.css';

export function MeasurementApp() {
  const navigate = useNavigate();
  const user = authAPI.getCurrentUser();
  const { 
    state, 
    reset, 
    setLoading,
    setFromValue,
    setFromUnit,
    setToValue,
    setToUnit
  } = useContext(MeasurementContext);
  const { calculate } = useConversion();
  const { units } = useUnits(); // ✅ FIX: Call the hook to load units
  
  // ✅ DEBUG: Log units and state
  console.log('🔍 Units loaded:', units);
  console.log('📦 Current state:', { selectedType: state.selectedType, units: state.units });
  const handleCalculate = async () => {
    console.log('✓ Calculate button clicked', { fromValue: state.fromValue, fromUnit: state.fromUnit, toUnit: state.toUnit });
    if (!state.fromValue || !state.fromUnit || !state.toUnit) {
      console.warn('⚠️ Missing required fields:', { fromValue: state.fromValue, fromUnit: state.fromUnit, toUnit: state.toUnit });
      return;
    }
    setLoading(true);
    try {
      await calculate();
    } catch (error) {
      console.error('❌ Calculation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    console.log('🔄 Reset button clicked');
    reset();
  };

  const handleLogout = () => {
    console.log('👋 Logout button clicked');
    authAPI.logout();
    navigate('/login');
  };

  // ✅ Debug handlers for dropdowns
  const handleFromUnitChange = (e) => {
    const newUnit = e.target.value;
    console.log('📍 FROM Unit changed:', newUnit);
    setFromUnit(newUnit);
  };

  const handleToUnitChange = (e) => {
    const newUnit = e.target.value;
    console.log('📍 TO Unit changed:', newUnit);
    setToUnit(newUnit);
  };

  const showToValueInput = state.selectedAction !== 'Conversion';

  // Check if calculate button should be disabled
  const isCalculateDisabled = 
    state.isLoading || 
    !state.fromValue || 
    !state.fromUnit || 
    !state.toUnit || 
    (showToValueInput && !state.toValue);

  return (
    <div className="measurement-app">
      {/* Header */}
      <header className="app-header">
        <div className="header-container">
          <div className="app-title">
            <h1>📏 Quantity Measurement</h1>
            <p>Convert, Compare, and Calculate Measurements</p>
          </div>
          <div className="header-actions">
            <div className="user-info">
              <span className="user-icon">👤</span>
              <span className="user-name">{user?.fullName}</span>
            </div>
            <button className="btn btn-danger" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="app-main">
        <div className="container">
          <ErrorBanner />

          {/* Type and Action Section */}
          <div className="selection-section">
            <TypeSelector />
            <ActionSelector />
          </div>

          {/* Input Section */}
          <div className="input-section card">
            <h2 className="section-title">
              {state.selectedAction === 'Conversion'
                ? 'Convert Units'
                : state.selectedAction === 'Comparison'
                ? 'Compare Measurements'
                : 'Perform Arithmetic'}
            </h2>

            <div className="inputs-grid">
              {state.selectedAction === 'Conversion' ? (
                <>
                  {/* Conversion: Show value input and both unit dropdowns */}
                  <div className="conversion-input-wrapper">
                    <label className="input-label">Value</label>
                    <input
                      type="number"
                      className="value-input"
                      value={state.fromValue}
                      onChange={(e) => setFromValue(e.target.value)}
                      placeholder="Enter value"
                      step="any"
                    />
                  </div>
                  <div className="conversion-units-wrapper">
                    <label className="input-label">FROM Unit</label>
                    <select
                      className="unit-select"
                      value={state.fromUnit}
                      onChange={handleFromUnitChange}
                    >
                      <option value="">-- Select FROM unit --</option>
                      {state.units && state.units.length > 0 ? (
                        state.units.map((u) => (
                          <option key={u.id} value={u.symbol}>
                            {u.label} ({u.symbol})
                          </option>
                        ))
                      ) : (
                        <option disabled>Loading...</option>
                      )}
                    </select>
                  </div>
                  <div className="conversion-units-wrapper">
                    <label className="input-label">TO Unit</label>
                    <select
                      className="unit-select"
                      value={state.toUnit}
                      onChange={handleToUnitChange}
                    >
                      <option value="">-- Select TO unit --</option>
                      {state.units && state.units.length > 0 ? (
                        state.units.map((u) => (
                          <option key={u.id} value={u.symbol}>
                            {u.label} ({u.symbol})
                          </option>
                        ))
                      ) : (
                        <option disabled>Loading...</option>
                      )}
                    </select>
                  </div>
                </>
              ) : (
                <>
                  {/* Comparison/Arithmetic: Use regular UnitInput components */}
                  <UnitInput label="FROM" position="from" />
                  {showToValueInput && <UnitInput label="TO" position="to" />}
                </>
              )}
            </div>

            <OperatorSelector />

            {/* Result Display */}
            <ResultDisplay />

            {/* Control Buttons */}
            <div className="button-group" style={{ position: 'relative', zIndex: 5 }}>
              <button
                type="button"
                className="btn btn-primary btn-lg"
                onClick={handleCalculate}
                disabled={isCalculateDisabled}
                title={isCalculateDisabled ? 'Please fill in all required fields' : 'Calculate the conversion'}
                style={{ pointerEvents: isCalculateDisabled ? 'none' : 'auto' }}
              >
                {state.isLoading ? '⏳ Calculating...' : '✓ Calculate'}
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-lg"
                onClick={handleReset}
                disabled={state.isLoading}
                title="Clear all fields"
                style={{ pointerEvents: state.isLoading ? 'none' : 'auto' }}
              >
                🔄 Reset
              </button>
            </div>
          </div>

          {/* History Section */}
          <div className="history-section">
            <HistoryList />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>&copy; 2026 Quantity Measurement App. All rights reserved.</p>
      </footer>
    </div>
  );
}
