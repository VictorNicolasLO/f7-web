import { BrowserRouter} from 'react-router-dom';
import './App.css';
import RootRouter from './router';
 
const App = () => {

  return (
    <BrowserRouter>
      <RootRouter />
    </BrowserRouter>
  );
};

export default App;
