import { useContext, useCallback } from 'react';
import { MeasurementContext } from '../context/MeasurementContext';
import { conversionAPI, measurementAPI, historyAPI } from '../services/api';

// Conversion factors to base units
const CONVERSION_FACTORS = {
  LENGTH: {
    'm': 1,
    'km': 1000,
    'cm': 0.01,
    'mm': 0.001,
    'ft': 0.3048,
    'in': 0.0254,
    'yd': 0.9144,
    'mi': 1609.34,
  },
  WEIGHT: {
    'kg': 1,
    'g': 0.001,
    'mg': 0.000001,
    'lb': 0.453592,
    'oz': 0.0283495,
    'ton': 1000,
  },
  VOLUME: {
    'L': 1,
    'ml': 0.001,
    'gal': 3.78541,
    'oz': 0.0295735,
    'pint': 0.473176,
    'cup': 0.236588,
  },
  TEMPERATURE: {
    'C': 1,
    'F': 1,
    'K': 1,
  },
};

export function useConversion() {
  const context = useContext(MeasurementContext);
  const { state, setResult, setLoading, setError, clearError } = context;

  // Local conversion calculation (fallback)
  const calculateLocalConversion = useCallback((value, fromUnit, toUnit, type) => {
    const factors = CONVERSION_FACTORS[type];
    if (!factors || !factors[fromUnit] || !factors[toUnit]) {
      return null;
    }
    const baseValue = value * factors[fromUnit];
    const result = baseValue / factors[toUnit];
    return result.toFixed(4);
  }, []);

  // Local arithmetic calculation (fallback)
  const calculateLocalArithmetic = useCallback((value1, unit1, value2, unit2, operator, type) => {
    const factors = CONVERSION_FACTORS[type];
    if (!factors || !factors[unit1] || !factors[unit2]) {
      return null;
    }

    // Convert both values to base unit
    const baseValue1 = value1 * factors[unit1];
    const baseValue2 = value2 * factors[unit2];

    // Perform operation
    let result;
    switch (operator) {
      case '+':
        result = baseValue1 + baseValue2;
        break;
      case '-':
        result = baseValue1 - baseValue2;
        break;
      case '*':
        result = baseValue1 * baseValue2;
        break;
      case '/':
        if (baseValue2 === 0) {
          return null;
        }
        result = baseValue1 / baseValue2;
        break;
      default:
        return null;
    }

    // Return result in the first unit
    const finalResult = result / factors[unit1];
    return finalResult.toFixed(4);
  }, []);

  // Local comparison calculation (fallback)
  const calculateLocalComparison = useCallback((value1, unit1, value2, unit2, type) => {
    const factors = CONVERSION_FACTORS[type];
    if (!factors || !factors[unit1] || !factors[unit2]) {
      return null;
    }

    // Convert both to base unit for comparison
    const baseValue1 = value1 * factors[unit1];
    const baseValue2 = value2 * factors[unit2];

    if (baseValue1 > baseValue2) {
      return `${value1} ${unit1} is greater than ${value2} ${unit2}`;
    } else if (baseValue1 < baseValue2) {
      return `${value1} ${unit1} is less than ${value2} ${unit2}`;
    } else {
      return `${value1} ${unit1} equals ${value2} ${unit2}`;
    }
  }, []);

  const calculate = useCallback(async () => {
    try {
      // Validation
      if (!state.fromValue || !state.fromUnit) {
        setError('Please enter a value and select a unit');
        return;
      }

      if (state.selectedAction !== 'Conversion' && !state.toValue) {
        setError('Please fill in all required fields');
        return;
      }

      if (state.selectedAction !== 'Conversion' && !state.toUnit) {
        setError('Please select both units');
        return;
      }

      if (state.selectedAction === 'Conversion' && !state.toUnit) {
        setError('Please select the target unit');
        return;
      }

      setLoading(true);
      clearError();

      let resultText = '';
      let expression = '';

      try {
        // Try API first
        if (state.selectedAction === 'Conversion') {
          const response = await conversionAPI.convert({
            value: parseFloat(state.fromValue),
            fromUnit: state.fromUnit,
            toUnit: state.toUnit,
          });
          resultText = response.data.data?.formattedResult || '';
          expression = `${state.fromValue} ${state.fromUnit} to ${state.toUnit}`;
        } else if (state.selectedAction === 'Comparison') {
          const response = await measurementAPI.compare({
            value1: parseFloat(state.fromValue),
            unit1: state.fromUnit,
            value2: parseFloat(state.toValue),
            unit2: state.toUnit,
          });
          resultText = response.data.data || '';
          expression = `Compare ${state.fromValue} ${state.fromUnit} with ${state.toValue} ${state.toUnit}`;
        } else if (state.selectedAction === 'Arithmetic') {
          const response = await measurementAPI.arithmetic({
            value1: parseFloat(state.fromValue),
            unit1: state.fromUnit,
            value2: parseFloat(state.toValue),
            unit2: state.toUnit,
            operator: state.operator,
          });
          resultText = response.data.data?.formattedResult || '';
          expression = `${state.fromValue} ${state.fromUnit} ${state.operator} ${state.toValue} ${state.toUnit}`;
        }
      } catch (apiError) {
        // Fallback: Use local calculation for all operations
        console.warn('API failed, using local calculation:', apiError.message);
        
        if (state.selectedAction === 'Conversion') {
          const convertedValue = calculateLocalConversion(
            parseFloat(state.fromValue),
            state.fromUnit,
            state.toUnit,
            state.selectedType
          );
          
          if (convertedValue !== null) {
            resultText = `${convertedValue} ${state.toUnit}`;
            expression = `${state.fromValue} ${state.fromUnit} to ${state.toUnit}`;
          } else {
            throw new Error('Conversion not supported for these units');
          }
        } else if (state.selectedAction === 'Comparison') {
          const comparisonResult = calculateLocalComparison(
            parseFloat(state.fromValue),
            state.fromUnit,
            parseFloat(state.toValue),
            state.toUnit,
            state.selectedType
          );
          
          if (comparisonResult !== null) {
            resultText = comparisonResult;
            expression = `Compare ${state.fromValue} ${state.fromUnit} with ${state.toValue} ${state.toUnit}`;
          } else {
            throw new Error('Comparison not supported for these units');
          }
        } else if (state.selectedAction === 'Arithmetic') {
          const arithmeticResult = calculateLocalArithmetic(
            parseFloat(state.fromValue),
            state.fromUnit,
            parseFloat(state.toValue),
            state.toUnit,
            state.operator,
            state.selectedType
          );
          
          if (arithmeticResult !== null) {
            resultText = `${arithmeticResult} ${state.fromUnit}`;
            expression = `${state.fromValue} ${state.fromUnit} ${state.operator} ${state.toValue} ${state.toUnit}`;
          } else {
            throw new Error('Arithmetic operation not supported for these units');
          }
        }
      }

      if (resultText) {
        setResult(resultText);
        
        // Save to history locally first
        const historyRecord = {
          id: `${Date.now()}`,
          type: state.selectedType,
          action: state.selectedAction,
          expression: expression,
          result: resultText,
          timestamp: new Date().toISOString(),
        };
        
        try {
          // Save to localStorage
          const stored = localStorage.getItem('calculationHistory');
          const historyData = stored ? JSON.parse(stored) : [];
          historyData.unshift(historyRecord);
          localStorage.setItem('calculationHistory', JSON.stringify(historyData));
          console.log('✅ History saved locally');
        } catch (error) {
          console.warn('Could not save to localStorage:', error.message);
        }
        
        // Also try to save to backend (non-critical)
        try {
          await historyAPI.save(historyRecord);
          console.log('✅ History saved to backend');
        } catch (error) {
          console.warn('Could not save to backend:', error.message);
        }
      }
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message || 'Calculation failed';
      setError(errorMsg);
      setResult(null);
    } finally {
      setLoading(false);
    }
  }, [state, setResult, setLoading, setError, clearError, calculateLocalConversion, calculateLocalArithmetic, calculateLocalComparison]);

  return {
    calculate,
    isCalculating: state.isLoading,
    result: state.result,
  };
}
