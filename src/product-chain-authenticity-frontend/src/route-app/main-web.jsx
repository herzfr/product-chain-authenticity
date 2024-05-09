import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "../components/navbar/navbar";
import Home from "../pages/Home"

function MainWeb() {
    return (
        <main >
            <Router>
                <Navbar />
                <section id="home">
                        <Routes>
                        <Route path="/" element={<Home />} />
                        {/* <Route path="/verification" element={<VerificationPage />} /> */}
                        </Routes>
                </section>
            </Router>
        </main>
    );
}

export default MainWeb;