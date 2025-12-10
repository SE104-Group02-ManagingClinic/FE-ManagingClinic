import React, { useState } from "react";
import "./Home.css";
import ProfileCard from "../../components/profile/ProfileCard";
import AppointmentCard from "../../components/cards/ExamineCard";
import Sidebar from "../../components/sidebar/Sidebar";
import ButtonHome from "../../components/buttons/ButtonHome";
import BottomSheet from "../BottomSheet/BottomSheet";
import ExamineTicket from "../Examine/ExamineTicket";
import ExamineForm from "../Examine/ExamineForm";
import Patient from "../Examine/PatientForm";
import PatientForm from "../Examine/PatientForm";

const Home = () => {
  const [openExamine, setOpenExamine] = useState(false);
  const [openPatient, setOpenPatient] = useState(false);

  return (
    <>
      <div className={`home-container ${openExamine || openPatient ? "shrink" : ""}`}>
        <div className="MainScreen">
          <div className="UpcommingAppointments">
            <AppointmentCard patient="Nguyễn Văn A" disease="Cảm cúm" />
            <AppointmentCard patient="Trần Thị B" disease="Đau đầu" />
          </div>

          <div className="Buttons">
            <ButtonHome label="Phiếu khám bệnh mới" onClick={() => setOpenExamine(true)} />
            <ButtonHome label="Hồ sơ bệnh nhân mới" onClick={() => setOpenPatient(true)} />
          </div>
        </div>
      </div>

      {/* BottomSheet 1 - Phiếu khám */}
      <BottomSheet isOpen={openExamine} onClose={() => setOpenExamine(false)}>
        <ExamineForm/>
      </BottomSheet>

      {/* BottomSheet 2 - Tra cứu */}
      <BottomSheet isOpen={openPatient} onClose={() => setOpenPatient(false)}>
        <PatientForm/>
      </BottomSheet>
    </>
  );
};

export default Home;
