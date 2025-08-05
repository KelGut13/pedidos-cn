import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import PedidosView from './components/PedidosView';
import PedidoDetails from './components/PedidoDetails';
import Login from './components/Login';
import Layout from './components/Layout';
import { AuthProvider, useAuth } from './context/AuthContext';
import './App.css';

// Componente para proteger rutas
function RequireAuth({ children }) {
  const { isAuthenticated, loading } = useAuth();
  
  // Mientras se verifica la autenticación, mostrar cargando
  if (loading) {
    return <div className="loading-screen">Cargando...</div>;
  }
  
  // Si no está autenticado, redirigir a login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Si está autenticado, mostrar componente hijo
  return children;
}

function App() {
  return (
    <AuthProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={
            <RequireAuth>
              <Layout>
                <Dashboard />
              </Layout>
            </RequireAuth>
          } />
          
          <Route path="/pedidos" element={
            <RequireAuth>
              <Layout>
                <PedidosView />
              </Layout>
            </RequireAuth>
          } />
          
          <Route path="/pedidos/:id" element={
            <RequireAuth>
              <Layout>
                <PedidoDetails />
              </Layout>
            </RequireAuth>
          } />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
