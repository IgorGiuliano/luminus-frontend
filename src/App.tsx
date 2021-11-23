import { AuthProvider } from './contexts/auth';
import Routes from './routes/routes';

function App() {
  return (
    <AuthProvider>
        <Routes />
    </ AuthProvider>
  );
}

export default App;
