import React, { useState, useEffect, useCallback } from 'react';
import { covidApi } from '../services/api';
import { formatNumber, formatDate } from '../utils/formatters';

const BrazilStatesStatus = () => {
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStatesData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await covidApi.getStates();
      setStates(response.data.data);
    } catch (err) {
      setError('Erro ao carregar dados dos estados. Tente novamente mais tarde.');
      console.error('Erro ao buscar estados:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatesData();
  }, [fetchStatesData]);

  const filteredStates = selectedState === 'all' 
    ? states 
    : states.filter(state => state.uf === selectedState);

  if (loading) {
    return (
      <div className="text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        <strong>Erro:</strong> {error}
        <button 
          className="btn btn-sm btn-outline-danger ms-3" 
          onClick={fetchStatesData}
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-4">Status COVID-19 por Estado</h2>
      
      <div className="row mb-4">
        <div className="col-md-6">
          <label htmlFor="stateSelect" className="form-label">Selecione um Estado:</label>
          <select 
            id="stateSelect"
            className="form-select" 
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
          >
            <option value="all">Todos os Estados</option>
            {states.map(state => (
              <option key={state.uf} value={state.uf}>
                {state.state} ({state.uf})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="row">
        {filteredStates.map(state => (
          <div key={state.uf} className="col-md-6 col-lg-4 mb-4">
            <div className="card h-100">
              <div className="card-header bg-primary text-white">
                <h5 className="card-title mb-0">{state.state} ({state.uf})</h5>
              </div>
              <div className="card-body">
                <ul className="list-group list-group-flush">
                  <li className="list-group-item d-flex justify-content-between">
                    <strong>Casos:</strong>
                    <span className="badge bg-warning text-dark">{formatNumber(state.cases)}</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between">
                    <strong>Mortes:</strong>
                    <span className="badge bg-danger">{formatNumber(state.deaths)}</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between">
                    <strong>Suspeitos:</strong>
                    <span className="badge bg-info">{formatNumber(state.suspects)}</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between">
                    <strong>Recusados:</strong>
                    <span className="badge bg-secondary">{formatNumber(state.refuses)}</span>
                  </li>
                </ul>
                <div className="mt-3 text-muted small">
                  Atualizado em: {formatDate(state.datetime)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrazilStatesStatus;
