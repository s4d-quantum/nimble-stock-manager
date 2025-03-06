
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Index from './pages/Index';
import Products from './pages/Products';
import Customers from './pages/Customers';
import Orders from './pages/Orders';
import DeviceDetail from './pages/DeviceDetail';
import NotFound from './pages/NotFound';
import './App.css';
import { Toaster } from "@/components/ui/toaster";

const App: React.FC = () => {
  return (
    <Router>
      <div className="relative flex min-h-screen flex-col">
        <Navbar />
        <div className="flex flex-1 pt-16">
          <Sidebar />
          <main className="flex-1 p-4 md:p-6 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/products" element={<Products />} />
              <Route path="/device/:id" element={<DeviceDetail />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
        <Toaster />
      </div>
    </Router>
  );
};

export default App;
