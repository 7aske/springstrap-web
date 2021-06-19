import React from 'react';
import ReactDOM from 'react-dom';
import "../node_modules/materialize-css/dist/css/materialize.css"
import "../node_modules/materialize-css/dist/js/materialize"
import "./assets/styles/theme.scss";
import "./assets/styles/materialize-css-override.scss";
import "./assets/styles/index.scss";
import App from './App';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
