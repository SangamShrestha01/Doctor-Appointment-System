import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { ROUTES } from "../routes/routes";
import AuthContext from "../context/auth-context";

const AuthLayout = () => {
    const { isAuthenticated, isLoading } = useContext(AuthContext);

    if (isLoading) return <p>Loading...</p>;

    if (!isAuthenticated) {
        return <Navigate to={ROUTES.LOGIN} replace />;
    }

    return (
        <div className="auth-layout">
            {/* you can add Sidebar here later */}
            <main style={{ padding: "1rem" }}>
                <Outlet />
            </main>
        </div>
    );
};

export default AuthLayout;
