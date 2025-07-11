import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider } from 'react-redux';
import { store,persistor } from './redux/store';
import { BrowserRouter } from 'react-router-dom';
import './index.css'// ✅ wrap Router here only
import { PersistGate } from 'redux-persist/integration/react';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <BrowserRouter>
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <App />
        </PersistGate>
    </Provider>
      </BrowserRouter>
  </React.StrictMode>
);
