import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SideBar from "../components/sidebar/sidebar";
import HomeDashboard from '../pages//home-dashboard/home-dashboard';

function MainApp() {
    return (
        <main className='w-full'>
            <Router>
                <div className="flex flex-row min-h-screen w-full">
                    <SideBar />
                    <main className='w-full m-4'>
                        <Routes>
                            <Route path="/" element={<HomeDashboard />} />
                        </Routes>
                    </main>
                </div>
            </Router>
        </main>
    )
}

export default MainApp;