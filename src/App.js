import './App.css';
import Home from './pages/Home/Home';
import Sidebar from './components/sidebar/Sidebar';
import Examine from './pages/Examine/Examine';
import Medicines from './pages/Medicines/Medicines';
import ProfileCard from './components/profile/ProfileCard';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { BottomSheetProvider, useBottomSheet } from './contexts/BottomSheetContext';
import BottomSheetContainer from './components/BottomSheetContainer';

function AppContent() {
    const { isBottomSheetOpen } = useBottomSheet();

    return (
        <>
            {isBottomSheetOpen && <div className="app-backdrop"></div>}
            <div className={`app-container ${isBottomSheetOpen ? "shrink" : ""}`} style={{ display: "flex" }}>
                <div className="sidebarside">
                    <ProfileCard />
                    <Sidebar />
                </div>

                <div className="MainScreen">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/examine" element={<Examine />} />
                        <Route path="/medicines" element={<Medicines />} />
                    </Routes>
                </div>
            </div>
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
