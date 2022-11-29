import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import Router from './Router';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
          <Router />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
