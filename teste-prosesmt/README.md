# COVID-19 Brasil Dashboard

Dashboard interativo para visualização de dados sobre COVID-19 no Brasil, utilizando a API pública [COVID-19 Brazil API](https://covid19-brazil-api-docs.vercel.app/).

## 🚀 Tecnologias

- React 18.2.0
- Bootstrap 5.3.2
- Axios 1.6.5
- COVID-19 Brazil API

## 📋 Funcionalidades

- **Estados Brasileiros**: Visualiza dados atuais de todos os 27 estados com filtro
- **Brasil por Data**: Consulta dados históricos desde 25/02/2020
- **Países**: Lista de países com busca e dados COVID
- **Formulário**: Cadastro com validação completa e geração de JSON

## 🛠️ Instalação e Execução

### Instalação

```bash
npm install
```

### Executar

```bash
npm start
```

Acesse:
[http://localhost:3000](http://localhost:3000)

### Build para Produção

```bash
npm run build
```

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── BrazilStatesStatus.js
│   ├── BrazilByDate.js
│   ├── CountriesStatus.js
│   └── CovidForm.js
├── services/           # Serviços de API
│   └── api.js
├── constants/          # Constantes
│   └── brazilianStates.js
├── utils/             # Utilitários
│   └── formatters.js
├── App.js
├── App.css
└── index.js

docs/                  # Documentação
├── PROJETO_README.md
├── MELHORIAS_APLICADAS.md
└── CORREÇÕES_FINAIS.md
```

## 🎯 Características Técnicas

- Componentes funcionais com Hooks
- Otimizações com `useCallback` e `useMemo`
- Formatação segura de dados (null-safe)
- Tratamento robusto de erros
- Design responsivo
- Acessibilidade (ARIA)

