import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import MainLayout from './components/Layout/MainLayout';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <AppProvider>
      <Router>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            {/* Add more routes as we build them */}
            <Route path="*" element={<div>Page not found</div>} />
          </Routes>
        </MainLayout>
      </Router>
    </AppProvider>
  );
}

export default App;
