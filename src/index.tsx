import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {
  ChakraProvider,
  createSystem,
  defaultConfig,
  
  defineConfig
} from '@chakra-ui/react'
import { ColorModeProvider } from './components/ui/color-mode';
const config = defineConfig({
  theme:{

  }
})

const system = createSystem(defaultConfig
, config)
const rootEl = document.getElementById('root');
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(
    <React.StrictMode>
      <ChakraProvider value={system}>
       <ColorModeProvider><App /></ColorModeProvider> 
      </ChakraProvider>
      
    </React.StrictMode>,
  );
}

// Suggested name: Trash Can