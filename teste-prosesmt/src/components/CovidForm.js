import React, { useState, useCallback } from 'react';
import { BRAZILIAN_STATES } from '../constants/brazilianStates';

const INITIAL_FORM_STATE = {
  estado: '',
  casos: '',
  confirmados: '',
  mortos: '',
  recuperados: '',
  data: ''
};

const CovidForm = () => {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState({});
  const [jsonOutput, setJsonOutput] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    setErrors(prev => {
      if (prev[name]) {
        const { [name]: _, ...rest } = prev;
        return rest;
      }
      return prev;
    });
  }, []);

  const validateForm = useCallback(() => {
    const newErrors = {};
    const numericFields = ['casos', 'confirmados', 'mortos', 'recuperados'];

    if (!formData.estado) {
      newErrors.estado = 'Estado é obrigatório';
    }

    numericFields.forEach(field => {
      const fieldLabel = field.charAt(0).toUpperCase() + field.slice(1);
      if (!formData[field]) {
        newErrors[field] = `${fieldLabel} é obrigatório`;
      } else if (isNaN(formData[field]) || Number(formData[field]) < 0) {
        newErrors[field] = `${fieldLabel} deve ser um número válido e não negativo`;
      }
    });

    if (!formData.data) {
      newErrors.data = 'Data é obrigatória';
    }

    return newErrors;
  }, [formData]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setJsonOutput(null);
      setShowSuccess(false);
      return;
    }

    const selectedState = BRAZILIAN_STATES.find(s => s.uf === formData.estado);
    
    const dataToSend = {
      uf: formData.estado,
      state: selectedState?.name || formData.estado,
      cases: Number(formData.casos),
      confirmed: Number(formData.confirmados),
      deaths: Number(formData.mortos),
      recovered: Number(formData.recuperados),
      date: formData.data,
      datetime: new Date(formData.data).toISOString(),
      created_at: new Date().toISOString()
    };

    setJsonOutput(JSON.stringify(dataToSend, null, 2));
    setShowSuccess(true);
    
    console.log('JSON que seria enviado para a API:');
    console.log(dataToSend);
    
    setTimeout(() => {
      setShowSuccess(false);
    }, 5000);
  }, [formData, validateForm]);

  const handleReset = useCallback(() => {
    setFormData(INITIAL_FORM_STATE);
    setErrors({});
    setJsonOutput(null);
    setShowSuccess(false);
  }, []);

  return (
    <div>
      <h2 className="mb-4">Formulário de Dados COVID-19</h2>
      
      {showSuccess && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          <strong>Sucesso!</strong> Formulário validado com sucesso. Verifique o console e o JSON abaixo.
          <button type="button" className="btn-close" onClick={() => setShowSuccess(false)}></button>
        </div>
      )}

      <div className="row">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Preencha os Dados</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="estado" className="form-label">Estado *</label>
                  <select
                    id="estado"
                    name="estado"
                    className={`form-select ${errors.estado ? 'is-invalid' : ''}`}
                    value={formData.estado}
                    onChange={handleChange}
                  >
                    <option value="">Selecione um estado</option>
                    {BRAZILIAN_STATES.map(state => (
                      <option key={state.uf} value={state.uf}>
                        {state.name} ({state.uf})
                      </option>
                    ))}
                  </select>
                  {errors.estado && <div className="invalid-feedback">{errors.estado}</div>}
                </div>

                <div className="mb-3">
                  <label htmlFor="casos" className="form-label">Casos *</label>
                  <input
                    type="number"
                    id="casos"
                    name="casos"
                    className={`form-control ${errors.casos ? 'is-invalid' : ''}`}
                    value={formData.casos}
                    onChange={handleChange}
                    min="0"
                  />
                  {errors.casos && <div className="invalid-feedback">{errors.casos}</div>}
                </div>

                <div className="mb-3">
                  <label htmlFor="confirmados" className="form-label">Confirmados *</label>
                  <input
                    type="number"
                    id="confirmados"
                    name="confirmados"
                    className={`form-control ${errors.confirmados ? 'is-invalid' : ''}`}
                    value={formData.confirmados}
                    onChange={handleChange}
                    min="0"
                  />
                  {errors.confirmados && <div className="invalid-feedback">{errors.confirmados}</div>}
                </div>

                <div className="mb-3">
                  <label htmlFor="mortos" className="form-label">Mortos *</label>
                  <input
                    type="number"
                    id="mortos"
                    name="mortos"
                    className={`form-control ${errors.mortos ? 'is-invalid' : ''}`}
                    value={formData.mortos}
                    onChange={handleChange}
                    min="0"
                  />
                  {errors.mortos && <div className="invalid-feedback">{errors.mortos}</div>}
                </div>

                <div className="mb-3">
                  <label htmlFor="recuperados" className="form-label">Recuperados *</label>
                  <input
                    type="number"
                    id="recuperados"
                    name="recuperados"
                    className={`form-control ${errors.recuperados ? 'is-invalid' : ''}`}
                    value={formData.recuperados}
                    onChange={handleChange}
                    min="0"
                  />
                  {errors.recuperados && <div className="invalid-feedback">{errors.recuperados}</div>}
                </div>

                <div className="mb-3">
                  <label htmlFor="data" className="form-label">Data *</label>
                  <input
                    type="date"
                    id="data"
                    name="data"
                    className={`form-control ${errors.data ? 'is-invalid' : ''}`}
                    value={formData.data}
                    onChange={handleChange}
                    max={new Date().toISOString().split('T')[0]}
                  />
                  {errors.data && <div className="invalid-feedback">{errors.data}</div>}
                </div>

                <div className="d-grid gap-2">
                  <button type="submit" className="btn btn-primary">
                    Enviar
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={handleReset}>
                    Limpar Formulário
                  </button>
                </div>

                <div className="mt-3 text-muted small">
                  * Todos os campos são obrigatórios
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card">
            <div className="card-header bg-success text-white">
              <h5 className="mb-0">JSON Gerado</h5>
            </div>
            <div className="card-body">
              {jsonOutput ? (
                <div>
                  <p className="text-muted mb-2">
                    Este JSON seria enviado para a API:
                  </p>
                  <pre className="bg-light p-3 rounded border">
                    <code>{jsonOutput}</code>
                  </pre>
                  <div className="alert alert-info mt-3">
                    <small>
                      <strong>Nota:</strong> Os dados também foram exibidos no console do navegador.
                      Abra o DevTools (F12) para visualizar.
                    </small>
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted py-5">
                  <p>Preencha o formulário e clique em "Enviar" para ver o JSON gerado aqui.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CovidForm;
