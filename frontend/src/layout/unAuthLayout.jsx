import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../component/navbar";
import Footer from "../component/footer";

const PublicLayout = () => {
    return (
        <>
            <Header />
            <main style={{ padding: "1rem" }}>
                <Outlet />
            </main>
            <Footer />
        </>
    );
};

export default PublicLayout;
