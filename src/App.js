import './App.css';
import Home from './pages/Home/Home';
import Sidebar from './components/sidebar/Sidebar';
import Examine from './pages/Examine/Examine';
import Medicines from './pages/Medicines/Medicines';
import ProfileCard from './components/profile/ProfileCard';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
      <div className="app-container" style={{display:"flex"}}>
        <div className="sidebarside">
          <ProfileCard/>
          <Sidebar/>
        </div>

        <div className="MainScreen">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/examine" element={<Examine />} />
            <Route path="/medicines" element={<Medicines/>} />
          </Routes>
        </div>
      </div>
    );
}

export default App;
