import React from "react";
import "./Home.css";
import ProfileCard from "../../components/profile/ProfileCard";
import AppointmentCard from "../../components/cards/AppointmentCard";
// removed unused chart imports
import Sidebar from "../../components/sidebar/Sidebar";
import ButtonHome from "../../components/buttons/ButtonHome";
import BottomSheet from "../BottomSheet/BottomSheet";
import { useNavigate } from 'react-router-dom';
import { useState } from "react";

const Home = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
    <div className={`home-container ${open ? "shrink" : ""}`}>
            <div className = "sidebarside">
                <ProfileCard />
                <Sidebar/>
            </div>
            <div className="MainScreen">
                    <div className = "UpcommingAppointments">
                        <AppointmentCard 
                            patient="Nguyễn Văn A" 
                            disease="Cảm cúm"
                        />
                        <AppointmentCard 
                            patient="Trần Thị B" 
                            disease="Đau đầu"
                        />
                    </div>
                    <div className="Buttons">
                    <ButtonHome label="Tạo phiếu khám bệnh mới" onClick={()=> setOpen(true)}/>
                    <ButtonHome label="Tra cứu bệnh nhân" onClick={() => {}} />
                    </div>
            </div>
    </div>
    <BottomSheet isOpen={open} onClose={() => setOpen(false)}/>
    </>
  );
};

export default Home;