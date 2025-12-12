import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Vendas from './pages/Vendas';
import Financeiro from './pages/Financeiro';
import Estoque from './pages/Estoque';
import Clientes from './pages/Clientes';
import Comercial from './pages/Comercial';

function App() {
  return (
    <Router>
      <nav style={{ display: 'flex', gap: '1rem', padding: '1rem', background: '#eee', justifyContent: 'center' }}>
        <Link to="/">Home</Link>
        <Link to="/vendas">Vendas</Link>
        <Link to="/financeiro">Financeiro</Link>
        <Link to="/estoque">Estoque</Link>
        <Link to="/clientes">Clientes</Link>
        <Link to="/comercial">Comercial</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/vendas" element={<Vendas />} />
        <Route path="/financeiro" element={<Financeiro />} />
        <Route path="/estoque" element={<Estoque />} />
        <Route path="/clientes" element={<Clientes />} />
        <Route path="/comercial" element={<Comercial />} />
      </Routes>
    </Router>
  );
}

export default App;
