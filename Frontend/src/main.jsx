import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import { Toaster } from 'react-hot-toast';
import { GoogleOAuthProvider } from '@react-oauth/google';
import './index.css';
import App from './App.jsx';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store , persistor } from './redux/store.js'

createRoot(document.getElementById('root')).render(
   <>
   
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
       <BrowserRouter> 
           <App />
       </BrowserRouter>
       </PersistGate>
      </Provider>
      <ToastContainer 
          position="top-center"
          autoClose={2000}
         //hideProgressBar={true}
          newestOnTop={true}
          closeOnClick
          pauseOnHover
          draggable
          toastClassName="toast-global"
      />
       <Toaster />
      </GoogleOAuthProvider>
   
   </>
);

