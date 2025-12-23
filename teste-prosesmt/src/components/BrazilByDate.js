import React, { useState, useCallback } from 'react';
import { covidApi } from '../services/api';
import { formatNumber, formatDate } from '../utils/formatters';

const BrazilByDate = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [brazilData, setBrazilData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = useCallback(async (e) => {
    e.preventDefault();
    
    if (!selectedDate) {
      setError('Por favor, selecione uma data');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const formattedDate = selectedDate.replace(/-/g, '');
      const response = await covidApi.getBrazilByDate(formattedDate);
      
      if (!response.data || !response.data.data) {
        throw new Error('Dados não encontrados para esta data');
      }
      
      setBrazilData(response.data.data);
    } catch (err) {
      setError('Erro ao carregar dados. A data pode não ter relatório disponível. Tente outra data.');
      setBrazilData(null);
      console.error('Erro ao buscar dados por data:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  return (
    <div>
      <h2 className="mb-4">Status COVID-19 no Brasil por Data</h2>
      
      <div className="alert alert-info mb-4" role="alert">
        <strong>Dica:</strong> A API possui dados históricos de estados brasileiros. 
        Selecione uma data para visualizar o relatório daquele dia.
      </div>
      
      <form onSubmit={handleSearch} className="mb-4">
        <div className="row">
          <div className="col-md-6">
            <label htmlFor="dateInput" className="form-label">Selecione uma Data:</label>
            <input
              type="date"
              id="dateInput"
              className="form-control"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              min="2020-02-25"
            />
            <small className="form-text text-muted">
              Dados disponíveis a partir de 25/02/2020
            </small>
          </div>
          <div className="col-md-6 d-flex align-items-end">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Carregando...' : 'Buscar'}
            </button>
          </div>
        </div>
      </form>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {loading && (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
        </div>
      )}

      {brazilData && brazilData.length > 0 && (
        <div>
          <h3 className="mb-3">Relatório de {new Date(selectedDate).toLocaleDateString('pt-BR')}</h3>
          <div className="row">
            {brazilData.map((state, index) => (
              <div key={state.uf || index} className="col-md-6 col-lg-4 mb-4">
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
      )}
      
      {brazilData && brazilData.length === 0 && (
        <div className="alert alert-warning text-center" role="alert">
          Nenhum dado encontrado para esta data.
        </div>
      )}
    </div>
  );
};

export default BrazilByDate;
