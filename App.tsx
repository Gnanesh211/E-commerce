import React from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductListPage from './pages/ProductListPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import AdminPage from './pages/AdminPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminRoute from './components/AdminRoute';
import ProductEditPage from './pages/ProductEditPage';

const AppContent: React.FC = () => {
    const location = useLocation();
    const noHeaderFooterPaths = ['/login', '/forgot-password', '/reset-password', '/admin/login'];
    const showHeaderFooter = !noHeaderFooterPaths.includes(location.pathname);

    return (
        <div className="flex flex-col min-h-screen font-sans text-gray-800 dark:text-gray-200">
            {showHeaderFooter && <Header />}
            <main className="flex-grow">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/products" element={<ProductListPage />} />
                    <Route path="/products/:id" element={<ProductDetailPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="/reset-password" element={<ResetPasswordPage />} />
                    <Route path="/admin/login" element={<AdminLoginPage />} />
                    <Route path="/admin" element={
                        <AdminRoute>
                            <AdminPage />
                        </AdminRoute>
                    } />
                    <Route path="/admin/product/new" element={
                        <AdminRoute>
                            <ProductEditPage />
                        </AdminRoute>
                    } />
                    <Route path="/admin/product/edit/:id" element={
                        <AdminRoute>
                            <ProductEditPage />
                        </AdminRoute>
                    } />
                </Routes>
            </main>
            {showHeaderFooter && <Footer />}
        </div>
    );
};

const App: React.FC = () => {
  return (
    <AppProvider>
        <HashRouter>
            <AppContent />
        </HashRouter>
    </AppProvider>
  );
};

export default App;