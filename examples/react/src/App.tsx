import React from 'react';
import {MockControllerReact} from './MockControllerReact';
import {BrowserRouter, Route} from "react-router-dom";
import {MockPopUpReact} from './MockPopUpReact';
import {setAllowedOrigins} from "@templafy/delivery-connector-library/utils/GlobalVars";

setAllowedOrigins([
  "https://*.templafy-local.com",
  "https://*.templafy.com",
  "https://*.hive.templafy.com"
]);

function App() {
  return (
    <BrowserRouter>
      <Route 
        path="/"
        exact={true}
        component={MockControllerReact} />
      <Route/>
      <Route 
        path="/login"
        exact={true}
        component={MockPopUpReact} />
      <Route/>
    </BrowserRouter>
  );
}

export default App;
