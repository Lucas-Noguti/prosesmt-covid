import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { covidApi } from '../services/api';
import { formatNumber, formatDate } from '../utils/formatters';

const CountriesStatus = () => {
  const [countries, setCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCountriesData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await covidApi.getCountries();
      setCountries(response.data.data);
    } catch (err) {
      setError('Erro ao carregar dados dos países. Tente novamente mais tarde.');
      console.error('Erro ao buscar países:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCountriesData();
  }, [fetchCountriesData]);

  const filteredCountries = useMemo(() => {
    if (!searchTerm.trim()) {
      return countries;
    }
    return countries.filter(country =>
      country.country.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, countries]);

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
          onClick={fetchCountriesData}
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-4">Status COVID-19 por País</h2>
      
      <div className="row mb-4">
        <div className="col-md-6">
          <label htmlFor="countrySearch" className="form-label">Buscar País:</label>
          <input
            type="text"
            id="countrySearch"
            className="form-control"
            placeholder="Digite o nome do país..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-6 d-flex align-items-end">
          <div className="alert alert-info mb-0">
            <strong>{filteredCountries.length}</strong> países encontrados
          </div>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>País</th>
              <th className="text-end">Casos</th>
              <th className="text-end">Confirmados</th>
              <th className="text-end">Mortes</th>
              <th className="text-end">Recuperados</th>
              <th>Última Atualização</th>
            </tr>
          </thead>
          <tbody>
            {filteredCountries.map((country, index) => (
              <tr key={`${country.country}-${index}`}>
                <td><strong>{country.country || 'N/A'}</strong></td>
                <td className="text-end">
                  <span className="badge bg-warning text-dark">
                    {formatNumber(country.cases)}
                  </span>
                </td>
                <td className="text-end">
                  <span className="badge bg-primary">
                    {formatNumber(country.confirmed)}
                  </span>
                </td>
                <td className="text-end">
                  <span className="badge bg-danger">
                    {formatNumber(country.deaths)}
                  </span>
                </td>
                <td className="text-end">
                  <span className="badge bg-success">
                    {formatNumber(country.recovered)}
                  </span>
                </td>
                <td className="text-muted small">
                  {formatDate(country.updated_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredCountries.length === 0 && (
        <div className="alert alert-warning text-center" role="alert">
          Nenhum país encontrado com o termo "{searchTerm}"
        </div>
      )}
    </div>
  );
};

export default CountriesStatus;
