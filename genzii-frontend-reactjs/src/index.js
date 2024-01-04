import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import App from './App';
import { GlobalStyles } from './components/components';
import Context from './contexts/context';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Context>
    <GlobalStyles>
      <App />
    </GlobalStyles>
  </Context>
);
 
reportWebVitals();
