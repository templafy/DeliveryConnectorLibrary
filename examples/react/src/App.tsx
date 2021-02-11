import React from 'react';
import { DeliveryController } from './DeliveryController';
import { BrowserRouter, Route } from "react-router-dom";
import { Login } from './Login';

function App() {
  return (
    <BrowserRouter>
      <Route
        path="/"
        exact={true}
        component={DeliveryController} />
      <Route />
      <Route
        path="/login"
        exact={true}
        component={Login} />
      <Route />
    </BrowserRouter>
  );
}

export default App;
