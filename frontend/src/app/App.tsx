import React, { useState } from 'react';
import { AuthProvider, useAuth } from '@shared/context/AuthContext';
import { CartProvider } from '@shared/context/CartContext';
import { Login } from '@features/auth/Login';
import { Toaster } from '@shared/ui/sonner';

// Layouts
import { ClientLayout } from '@app/layouts/ClientLayout';
import { EmployeeLayout } from '@app/layouts/EmployeeLayout';
import { AdminLayout } from '@app/layouts/AdminLayout';

// Client Pages
import { ClientHome } from '@features/client/ClientHome';
import { ProductsList } from '@features/client/ProductsList';
import { ProductDetail } from '@features/client/ProductDetail';
import { Cart } from '@features/client/Cart';
import { Checkout } from '@features/client/Checkout';
import { MyOrders } from '@features/client/MyOrders';
import { ClientProfile } from '@features/client/ClientProfile';
import { OrderTracking } from '@features/client/OrderTracking';

// Employee Pages
import { EmployeeDashboard } from '@features/employee/EmployeeDashboard';
import { OrdersManagement } from '@features/employee/OrdersManagement';
import { ProductsManagement } from '@features/employee/ProductsManagement';
import { StockManagement } from '@features/employee/StockManagement';
import { CategoriesManagement } from '@features/employee/CategoriesManagement';
import { BusinessHoursManagement } from '@features/employee/BusinessHoursManagement';

// Admin Pages
import { AdminDashboard } from '@features/admin/AdminDashboard';
import { RestaurantsManagement } from '@features/admin/RestaurantsManagement';
import { CustomersManagement } from '@features/admin/CustomersManagement';

function AppContent() {
  const { user, isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState('home');
  const [pageData, setPageData] = useState<any>(null);

  const navigate = (page: string, data?: any) => {
    setCurrentPage(page);
    setPageData(data || null);
  };

  if (!isAuthenticated) {
    return <Login onSuccess={() => navigate('home')} />;
  }

  // Client Routes
  if (user?.role === 'client') {
    let content;

    switch (currentPage) {
      case 'home':
        content = <ClientHome onNavigate={navigate} />;
        break;
      case 'products':
        content = <ProductsList onNavigate={navigate} initialCategoryId={pageData?.categoryId} />;
        break;
      case 'product-detail':
        content = <ProductDetail productId={pageData?.productId} onNavigate={navigate} />;
        break;
      case 'cart':
        content = <Cart onNavigate={navigate} />;
        break;
      case 'checkout':
        content = <Checkout onNavigate={navigate} />;
        break;
      case 'orders':
        content = <MyOrders onNavigate={navigate} />;
        break;
      case 'order-tracking':
        content = <OrderTracking orderId={pageData?.orderId} onNavigate={navigate} />;
        break;
      case 'profile':
        content = <ClientProfile />;
        break;
      default:
        content = <ClientHome onNavigate={navigate} />;
    }

    return (
      <ClientLayout currentPage={currentPage} onNavigate={navigate}>
        {content}
      </ClientLayout>
    );
  }

  // Employee Routes
  if (user?.role === 'employee') {
    let content;

    switch (currentPage) {
      case 'home':
      case 'dashboard':
        content = <EmployeeDashboard onNavigate={navigate} />;
        break;
      case 'orders':
        content = <OrdersManagement onNavigate={navigate} />;
        break;
      case 'products':
        content = <ProductsManagement onNavigate={navigate} />;
        break;
      case 'stock':
        content = <StockManagement />;
        break;
      case 'categories':
        content = <CategoriesManagement />;
        break;
      case 'hours':
        content = <BusinessHoursManagement />;
        break;
      default:
        content = <EmployeeDashboard onNavigate={navigate} />;
    }

    return (
      <EmployeeLayout currentPage={currentPage} onNavigate={navigate}>
        {content}
      </EmployeeLayout>
    );
  }

  // Admin Routes
  if (user?.role === 'admin') {
    let content;

    switch (currentPage) {
      case 'home':
      case 'dashboard':
        content = <AdminDashboard onNavigate={navigate} />;
        break;
      case 'restaurants':
        content = <RestaurantsManagement />;
        break;
      case 'customers':
        content = <CustomersManagement />;
        break;
      default:
        content = <AdminDashboard onNavigate={navigate} />;
    }

    return (
      <AdminLayout currentPage={currentPage} onNavigate={navigate}>
        {content}
      </AdminLayout>
    );
  }

  return <div>Perfil não reconhecido</div>;
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
        <Toaster position="top-right" />
      </CartProvider>
    </AuthProvider>
  );
}
