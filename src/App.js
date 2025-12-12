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
