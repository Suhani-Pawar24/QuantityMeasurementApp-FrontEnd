import React, { createContext, useReducer, useCallback } from 'react';

export const MeasurementContext = createContext();

const initialState = {
  selectedType: 'LENGTH',
  selectedAction: 'Conversion',
  units: [],
  fromUnit: '',
  toUnit: '',
  fromValue: '',
  toValue: '',
  operator: '+',
  result: null,
  isLoading: false,
  error: null,
};

function measurementReducer(state, action) {
  console.log(`[REDUCER] Action: ${action.type}`, action.payload);
  
  switch (action.type) {
    case 'SET_TYPE':
      console.log('✅ SET_TYPE:', action.payload);
      return {
        ...state,
        selectedType: action.payload,
        units: [],
        fromUnit: '',
        toUnit: '',
        fromValue: '',
        toValue: '',
        result: null,
        error: null,
      };

    case 'SET_ACTION':
      return {
        ...state,
        selectedAction: action.payload,
        fromValue: '',
        toValue: '',
        result: null,
        error: null,
      };

    case 'SET_UNITS':
      console.log('✅ SET_UNITS:', action.payload.length, 'units loaded');
      return {
        ...state,
        units: action.payload,
      };

    case 'SET_FROM_UNIT':
      console.log('✅ SET_FROM_UNIT:', action.payload);
      return {
        ...state,
        fromUnit: action.payload,
      };

    case 'SET_TO_UNIT':
      console.log('✅ SET_TO_UNIT:', action.payload);
      return {
        ...state,
        toUnit: action.payload,
      };

    case 'SET_FROM_VALUE':
      return {
        ...state,
        fromValue: action.payload,
      };

    case 'SET_TO_VALUE':
      return {
        ...state,
        toValue: action.payload,
      };

    case 'SET_OPERATOR':
      return {
        ...state,
        operator: action.payload,
      };

    case 'SET_RESULT':
      return {
        ...state,
        result: action.payload,
        error: null,
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };

    case 'RESET':
      return {
        ...initialState,
        selectedType: state.selectedType,
        selectedAction: state.selectedAction,
        units: state.units,
      };

    default:
      return state;
  }
}

export function MeasurementProvider({ children }) {
  const [state, dispatch] = useReducer(measurementReducer, initialState);

  const actions = {
    setType: useCallback((type) => {
      dispatch({ type: 'SET_TYPE', payload: type });
    }, []),

    setAction: useCallback((action) => {
      dispatch({ type: 'SET_ACTION', payload: action });
    }, []),

    setUnits: useCallback((units) => {
      dispatch({ type: 'SET_UNITS', payload: units });
    }, []),

    setFromUnit: useCallback((unit) => {
      dispatch({ type: 'SET_FROM_UNIT', payload: unit });
    }, []),

    setToUnit: useCallback((unit) => {
      dispatch({ type: 'SET_TO_UNIT', payload: unit });
    }, []),

    setFromValue: useCallback((value) => {
      dispatch({ type: 'SET_FROM_VALUE', payload: value });
    }, []),

    setToValue: useCallback((value) => {
      dispatch({ type: 'SET_TO_VALUE', payload: value });
    }, []),

    setOperator: useCallback((operator) => {
      dispatch({ type: 'SET_OPERATOR', payload: operator });
    }, []),

    setResult: useCallback((result) => {
      dispatch({ type: 'SET_RESULT', payload: result });
    }, []),

    setLoading: useCallback((loading) => {
      dispatch({ type: 'SET_LOADING', payload: loading });
    }, []),

    setError: useCallback((error) => {
      dispatch({ type: 'SET_ERROR', payload: error });
    }, []),

    clearError: useCallback(() => {
      dispatch({ type: 'SET_ERROR', payload: null });
    }, []),

    reset: useCallback(() => {
      dispatch({ type: 'RESET' });
    }, []),
  };

  return (
    <MeasurementContext.Provider value={{ state, dispatch, ...actions }}>
      {children}
    </MeasurementContext.Provider>
  );
}
