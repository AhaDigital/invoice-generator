import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { AuthContextProvider } from './Firebase'
import registerServiceWorker from './registerServiceWorker';

const application = (
  <AuthContextProvider>
    <App/>
  </AuthContextProvider>
);

ReactDOM.render(application, document.getElementById('root'));
registerServiceWorker();
