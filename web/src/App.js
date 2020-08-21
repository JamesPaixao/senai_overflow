import React, { useState } from 'react';

import Login from "./pages/Login";
import Home from "./pages/Home";
import {GlobalStyle} from "./styles/GlobalStyles";

function App() {
  return (
    <>
      <Home/>
      <GlobalStyle/>
    </>
  );
}

export default App;