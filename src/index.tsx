import ReactDOM from 'react-dom/client';
import App from './App';
import {
  ChakraProvider,
} from '@chakra-ui/react'
import { ColorModeProvider } from './components/ui/color-mode';
import { ApiProvider } from './providers/api-provider';
import { Flash7Api, withErrorHandling } from './api/flash7Api';
import { AuthProvider } from './providers/auth-provider';
import system from './theme';






const api = new Flash7Api({
  baseUrl: 'https://api-beta.f-7.io',
})

const rootEl = document.getElementById('root');
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(
    // <React.StrictMode>
    <ChakraProvider value={system}>
      <ColorModeProvider>
        <ApiProvider api={withErrorHandling(api)}>
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