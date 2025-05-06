
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Index from './pages/Index';
import Products from './pages/Products';
import Customers from './pages/Customers';
import Suppliers from './pages/Suppliers';
import Orders from './pages/Orders';
import GoodsOut from './pages/GoodsOut';
import PurchaseOrders from './pages/PurchaseOrders';
import SalesOrderDetail from './pages/SalesOrderDetail';
import DeviceDetail from './pages/DeviceDetail';
import NotFound from './pages/NotFound';
import './App.css';
import { Toaster } from "@/components/ui/toaster";

const App: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <Router>
      <div className="relative flex min-h-screen flex-col">
        <div className="flex flex-1">
          <Sidebar isOpen={sidebarOpen} closeSidebar={closeSidebar} />
          <main className="flex-1 p-4 md:p-6 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/products" element={<Products />} />
              <Route path="/device/:id" element={<DeviceDetail />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/suppliers" element={<Suppliers />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/purchase-orders" element={<PurchaseOrders />} />
              <Route path="/goods-out" element={<GoodsOut />} />
              <Route path="/sales/:id" element={<SalesOrderDetail />} />
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
