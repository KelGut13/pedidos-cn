import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import PedidosView from './components/PedidosView';
import PedidoDetails from './components/PedidoDetails';
import Layout from './components/Layout';
import './App.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/pedidos" element={<PedidosView />} />
          <Route path="/pedidos/:id" element={<PedidoDetails />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
