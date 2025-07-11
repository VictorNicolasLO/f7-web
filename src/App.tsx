import { BrowserRouter } from 'react-router-dom';
import './App.css';
import RootRouter from './router';
import { useColorMode } from './components/ui/color-mode';
import { memo, useEffect } from 'react';
import { Toaster } from './components/ui/toaster';

const App = () => {
  const { setColorMode } = useColorMode();
  useEffect(() => {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

    setColorMode('light');
  }
    , [setColorMode]);
  return (
    <BrowserRouter>
      <Toaster />
      <RootRouter />
    </BrowserRouter>
  );
};

export default memo(App);
