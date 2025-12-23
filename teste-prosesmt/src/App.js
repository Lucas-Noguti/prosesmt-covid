import React, { useState, useCallback, useMemo } from 'react';
import './App.css';
import BrazilStatesStatus from './components/BrazilStatesStatus';
import BrazilByDate from './components/BrazilByDate';
import CountriesStatus from './components/CountriesStatus';
import CovidForm from './components/CovidForm';

const TABS = [
  { id: 'states', label: 'Estados Brasileiros', Component: BrazilStatesStatus },
  { id: 'date', label: 'Brasil por Data', Component: BrazilByDate },
  { id: 'countries', label: 'Países', Component: CountriesStatus },
  { id: 'form', label: 'Formulário', Component: CovidForm }
];

function App() {
  const [activeTab, setActiveTab] = useState('states');

  const handleTabChange = useCallback((tabId) => {
    setActiveTab(tabId);
  }, []);

  const ActiveComponent = useMemo(() => {
    const tab = TABS.find(t => t.id === activeTab);
    return tab ? tab.Component : null;
  }, [activeTab]);

  return (
    <div className="App">
      <nav className="navbar navbar-dark bg-primary">
        <div className="container-fluid">
          <span className="navbar-brand mb-0 h1">COVID-19 Brasil - Dashboard</span>
        </div>
      </nav>

      <div className="container mt-4 mb-5">
        <ul className="nav nav-tabs mb-4" role="tablist">
          {TABS.map(tab => (
            <li key={tab.id} className="nav-item" role="presentation">
              <button 
                className={`nav-link ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => handleTabChange(tab.id)}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.id}
                aria-controls={`${tab.id}-panel`}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>

        <div className="tab-content" role="tabpanel" id={`${activeTab}-panel`}>
          {ActiveComponent && <ActiveComponent />}
        </div>
      </div>
    </div>
  );
}

export default App;
