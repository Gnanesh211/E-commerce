import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

interface AdminRouteProps {
    children: React.ReactElement;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
    const { user } = useAppContext();

    if (!user) {
        return <Navigate to="/admin/login" replace />;
    }

    if (user.role !== 'Admin' && user.role !== 'Chairman') {
        // User is logged in but not an admin, redirect them to the home page
        return <Navigate to="/" replace />;
    }

    return children;
};

export default AdminRoute;