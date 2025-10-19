import React from "react";
import "./Appointments.css";
import ProfileCard from "../../components/profile/ProfileCard";
import AppointmentCard from "../../components/cards/AppointmentCard";
import IncomeChart from "../../components/charts/IncomeChart";
import MedicineReportChart from "../../components/charts/MedicineReportChart";
import Sidebar from "../../components/sidebar/Sidebar";
import ButtonHome from "../../components/buttons/ButtonHome";
const Appointments = () => {
    return (
        <div className="appointments-container">
            <div className = "sidebarside">
                <ProfileCard />
                <Sidebar/>
            </div>
            <div className="MainScreenAppointments">
                    <div className = "AllAppointments">
                        <AppointmentCard
                            patient="Nguyễn Văn A" 
                            disease="Cảm cúm"
                        /> 
                        <AppointmentCard
                            patient="Trần Thị B"
                            disease="Đau đầu"
                        />
                        <AppointmentCard
                            patient="Lê Thị C"
                            disease="Sốt cao"
                        />
                        <AppointmentCard
                            patient="Phạm Văn D"
                            disease="Tiêu chảy"
                        />
                    </div>
                    <div className="ButtonsAppointments">
                        <ButtonHome label="Tạo phiếu khám bệnh mới" onClick={() => {}} />
                        <ButtonHome label="Tra cứu bệnh nhân" onClick={() => {}} />
                    </div>
            </div>
    </div>
    );
}