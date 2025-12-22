import './App.css';
import Home from './pages/Home/Home';
import Sidebar from './components/sidebar/Sidebar';
import Examine from './pages/Examine/Examine';
import Medicines from './pages/Medicines/Medicines';
import ProfileCard from './components/profile/ProfileCard';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { BottomSheetProvider, useBottomSheet } from './contexts/BottomSheetContext';
import BottomSheetContainer from './components/BottomSheetContainer';
import Login from './pages/Login/Login';
import Register from './pages/Login/Register';

function AppContent() {
    const { isBottomSheetOpen } = useBottomSheet();
    const location = useLocation();
    const isLoginPage = location.pathname === '/' || location.pathname === '/register';

    return (
        <>
            {isLoginPage ? (
                // Login/Register Page Layout - không có Sidebar và ProfileCard
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Routes>
            ) : (
                // Main App Layout - có Sidebar và ProfileCard
                <>
                    {isBottomSheetOpen && <div className="app-backdrop"></div>}
                    <div className={`app-container ${isBottomSheetOpen ? "shrink" : ""}`} style={{ display: "flex" }}>
                        <div className="sidebarside">
                            <ProfileCard key={localStorage.getItem("user")} />
                            <Sidebar />
                        </div>

                        <div className="MainScreen">
                            <Routes>
                                <Route path="/home" element={<Home />} />
                                <Route path="/examine" element={<Examine />} />
                                <Route path="/medicines" element={<Medicines />} />
                            </Routes>
                        </div>
                    </div>
                </>
            )}
            <BottomSheetContainer />
        </>
    );
}

function App() {
    return (
        <BottomSheetProvider>
            <AppContent />
        </BottomSheetProvider>
    );
}

export default App;
