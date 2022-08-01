import React from 'react';
import ReactDOM from 'react-dom';
import './styles/output.css';
import './styles/tailwind.css'
import App from './containers/App';
import { ChakraProvider } from "@chakra-ui/react";

ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider>
      <App />
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
