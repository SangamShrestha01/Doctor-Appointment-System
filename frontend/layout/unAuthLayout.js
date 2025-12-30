import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const PublicLayout = () => {
    return (
        <>
            <Navbar />
            <main style={{ padding: "1rem" }}>
                <Outlet />
            </main>
        </>
    );
};

export default PublicLayout;
