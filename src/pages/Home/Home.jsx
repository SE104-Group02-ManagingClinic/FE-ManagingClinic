import React, { useState } from "react";
import "./Home.css";
import ProfileCard from "../../components/profile/ProfileCard";
import AppointmentCard from "../../components/cards/ExamineCard";
import Sidebar from "../../components/sidebar/Sidebar";
import ButtonHome from "../../components/buttons/ButtonHome";
import { useBottomSheet } from "../../contexts/BottomSheetContext";

const Home = () => {
  const { bottomSheetState, setBottomSheetState } = useBottomSheet();

  const handleOpenExamine = () => {
    setBottomSheetState(prev => ({...prev, homeExamine: true}));
  };

  const handleOpenPatient = () => {
    setBottomSheetState(prev => ({...prev, homePatient: true}));
  };

  return (
    <div className="home-container">
      <div className="MainScreen">
        <div className="UpcommingAppointments">
          <AppointmentCard patient="Nguyễn Văn A" disease="Cảm cúm" />
          <AppointmentCard patient="Trần Thị B" disease="Đau đầu" />
        </div>

        <div className="Buttons">
          <ButtonHome label="Phiếu khám bệnh mới" onClick={handleOpenExamine} />
          <ButtonHome label="Hồ sơ bệnh nhân mới" onClick={handleOpenPatient} />
        </div>
      </div>
    </div>
  );
};

export default Home;
