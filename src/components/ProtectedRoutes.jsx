import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useUserAuth } from '../context/userAuth';

const ProtectedRoutes = () => {
    const { user, loading } = useUserAuth();

    if (loading) {
        // Basic spinner or loading text
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoutes;
