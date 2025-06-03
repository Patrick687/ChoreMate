import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import type { RootState } from "../store/store";

const ProtectedRoute: React.FC = () => {
    const token = useSelector((state: RootState) => state.auth.token);
    return token ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;