import { useContext, useEffect } from 'react';
import { MeasurementContext } from '../context/MeasurementContext';
import { unitAPI } from '../services/api';

// ✅ Simplified fallback units matching user requirements
const FALLBACK_UNITS = {
  LENGTH: [
    { id: 1, symbol: 'm', label: 'meter' },
    { id: 2, symbol: 'km', label: 'kilometer' },
    { id: 3, symbol: 'cm', label: 'centimeter' },
    { id: 4, symbol: 'ft', label: 'foot' },
    { id: 5, symbol: 'in', label: 'inch' },
  ],
  WEIGHT: [
    { id: 6, symbol: 'kg', label: 'kilogram' },
    { id: 7, symbol: 'g', label: 'gram' },
    { id: 8, symbol: 'lb', label: 'pound' },
    { id: 9, symbol: 'oz', label: 'ounce' },
  ],
  TEMPERATURE: [
    { id: 10, symbol: '°C', label: 'celsius' },
    { id: 11, symbol: '°F', label: 'fahrenheit' },
    { id: 12, symbol: 'K', label: 'kelvin' },
  ],
  VOLUME: [
    { id: 13, symbol: 'L', label: 'liter' },
    { id: 14, symbol: 'ml', label: 'milliliter' },
    { id: 15, symbol: 'gal', label: 'gallon' },
    { id: 16, symbol: 'oz', label: 'fluid_ounce' },
  ],
};

export function useUnits() {
  const { state, setUnits, setLoading, setError, clearError } = useContext(MeasurementContext);

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        console.log(`📥 Fetching units for type: ${state.selectedType}`);
        setLoading(true);
        clearError();
        
        // Try to fetch from API
        try {
          const response = await unitAPI.getUnitsByType(state.selectedType);
          const units = response.data?.data || response.data || [];
          
          if (units && Array.isArray(units) && units.length > 0) {
            console.log('✅ Units loaded from API:', units);
            setUnits(units);
            return;
          }
        } catch (apiError) {
          console.warn('⚠️ API failed:', apiError.message);
        }
        
        // Use fallback if API returns empty or fails
        const fallbackUnits = FALLBACK_UNITS[state.selectedType] || [];
        console.log(`✅ Using fallback units for ${state.selectedType}:`, fallbackUnits);
        setUnits(fallbackUnits);
        
      } catch (error) {
        console.error('❌ Error fetching units:', error);
        setError(`Failed to load units for ${state.selectedType}`);
      } finally {
        setLoading(false);
      }
    };

    if (state.selectedType) {
      fetchUnits();
    }
  }, [state.selectedType, setUnits, setLoading, setError, clearError]);

  return {
    units: state.units,
    isLoading: state.isLoading,
    error: state.error,
  };
}
