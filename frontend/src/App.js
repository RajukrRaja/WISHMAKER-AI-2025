import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import BatchCardPage from './pages/BatchCardPage';
import TributePage from './pages/TributePage';
import CollagePage from './pages/CollagePage';
import './styles/output.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/batch-card" element={<BatchCardPage />} />
        <Route path="/tribute" element={<TributePage />} />
        <Route path="/collage" element={<CollagePage />} />
      </Routes>
    </Router>
  );
}

export default App;