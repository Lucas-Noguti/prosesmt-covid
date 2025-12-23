import axios from 'axios';

const API_BASE_URL = 'https://covid19-brazil-api.vercel.app';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const covidApi = {
  getStates: () => api.get('/api/report/v1'),
  
  getCountries: () => api.get('/api/report/v1/countries'),
  
  getCountryByName: (country) => api.get(`/api/report/v1/${country}`),
  
  getBrazilCurrent: () => api.get('/api/report/v1/brazil'),
  
  getBrazilByDate: (date) => api.get(`/api/report/v1/brazil/${date}`),
};

export default api;
