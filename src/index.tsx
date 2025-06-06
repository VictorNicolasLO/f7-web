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
import { ApiProvider } from './providers/api-provider';
import { Flash7Api } from './api/flash7Api';
import { AuthProvider } from './providers/auth-provider';
const config = defineConfig({
  theme: {
     tokens: {
      colors:{
        'flash7': {
         value: '#94A89A'
        }
      }
     }
  }
})
const api = new Flash7Api({
  baseUrl: 'http://localhost:8081',
})
const system = createSystem(defaultConfig
  , config)
const rootEl = document.getElementById('root');
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(
    // <React.StrictMode>
      <ChakraProvider value={system}>
        <ColorModeProvider>
          <ApiProvider api={api}>
            <AuthProvider>
              <App />
            </AuthProvider>
          </ApiProvider>
        </ColorModeProvider>
      </ChakraProvider>

    // </React.StrictMode>,
  );
}

// Suggested name: Trash Can