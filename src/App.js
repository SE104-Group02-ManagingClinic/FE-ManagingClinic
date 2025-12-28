import './App.css';
import Home from './pages/Home/Home';
import Sidebar from './components/sidebar/Sidebar';
import Examine from './pages/Examine/Examine';
import Medicines from './pages/Medicines/Medicines';
import Reports from './pages/Reports/Reports';
import Settings from './pages/Settings/Settings';
import ProfileCard from './components/profile/ProfileCard';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { BottomSheetProvider, useBottomSheet } from './contexts/BottomSheetContext';
import { ToastProvider } from './contexts/ToastContext';
import { AuthProvider } from './contexts/AuthContext';
import BottomSheetContainer from './components/BottomSheetContainer';
import ProtectedRoute from './components/routes/ProtectedRoute';
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
                            <ProfileCard />
                            <Sidebar />
                        </div>

                        <div className="MainScreen">
                            <Routes>
                                {/* Trang chủ - public cho tất cả user đã đăng nhập */}
                                <Route path="/home" element={
                                    <ProtectedRoute>
                                        <Home data-feature="home" />
                                    </ProtectedRoute>
                                } />
                                
                                {/* Khám bệnh - không cần check, dùng checkRouteAccess */}
                                <Route path="/examine" element={
                                    <ProtectedRoute>
                                        <Examine data-feature="examine" />
                                    </ProtectedRoute>
                                } />
                                
                                {/* Quản lí thuốc - không cần check, dùng checkRouteAccess */}
                                <Route path="/medicines" element={
                                    <ProtectedRoute>
                                        <Medicines data-feature="medicines" />
                                    </ProtectedRoute>
                                } />
                                
                                {/* Báo cáo - không cần check, dùng checkRouteAccess */}
                                <Route path="/statistics" element={
                                    <ProtectedRoute>
                                        <Reports data-feature="statistics" />
                                    </ProtectedRoute>
                                } />
                                
                                {/* Cài đặt - không cần check, dùng checkRouteAccess */}
                                <Route path="/settings" element={
                                    <ProtectedRoute>
                                        <Settings data-feature="settings" />
                                    </ProtectedRoute>
                                } />
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
        <AuthProvider>
            <ToastProvider>
                <BottomSheetProvider>
                    <AppContent />
                </BottomSheetProvider>
            </ToastProvider>
        </AuthProvider>
    );
}

export default App;
