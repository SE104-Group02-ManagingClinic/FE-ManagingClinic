import React, { useState, useEffect } from "react";
import "./Home.css";
import ProfileCard from "../../components/profile/ProfileCard";
import AppointmentCard from "../../components/cards/ExamineCard";
import Sidebar from "../../components/sidebar/Sidebar";
import ButtonHome from "../../components/buttons/ButtonHome";
import { useBottomSheet } from "../../contexts/BottomSheetContext";
import { getUpcomingExamForms } from "../../api/medicalExamFormApi";
import SideSheet from "../SideSheet/SideSheet";
import ExamFormDetail from "../Examine/ExamFormDetail";
import { useToast } from "../../contexts/ToastContext";
import PermissionGuard from "../../components/PermissionGuard";

const Home = () => {
  const { bottomSheetState, setBottomSheetState, refreshTriggers } = useBottomSheet();
  const [upcomingExams, setUpcomingExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedExamForm, setSelectedExamForm] = useState(null);
  const [sideSheetOpen, setSideSheetOpen] = useState(false);
  const { showError } = useToast();

  useEffect(() => {
    fetchUpcomingExams();
  }, [refreshTriggers.examForms]);

  const fetchUpcomingExams = async () => {
    try {
      setLoading(true);
      const data = await getUpcomingExamForms();
      setUpcomingExams(data);
      setError("");
    } catch (err) {
      showError(err.message || "Lỗi khi tải danh sách phiếu khám sắp tới");
      setError(err.message || "Lỗi khi tải danh sách phiếu khám sắp tới");
      setUpcomingExams([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectExamForm = (examForm) => {
    setSelectedExamForm(examForm);
    setSideSheetOpen(true);
  };

  const handleExamFormUpdated = () => {
    fetchUpcomingExams();
    setSideSheetOpen(false);
  };

  const handleOpenExamine = () => {
    setBottomSheetState(prev => ({...prev, homeExamine: true}));
  };

  const handleOpenPatient = () => {
    setBottomSheetState(prev => ({...prev, homePatient: true}));
  };

  return (
    <div className="home-container">
      <div className="MainScreen">
        <h2 className="home-title">📅 Phiếu khám bệnh sắp tới</h2>
        
        <div className="UpcommingAppointments">
          {loading && <p className="loading-text">Đang tải...</p>}
          {error && <p className="error-text">{error}</p>}
          {!loading && upcomingExams.length === 0 && !error && (
            <p className="empty-text">Không có phiếu khám nào sắp tới trong 7 ngày tới</p>
          )}
          {upcomingExams.slice(0, 10).map((examForm) => (
            <AppointmentCard
              key={examForm.MaPKB}
              examForm={examForm}
              onClick={() => handleSelectExamForm(examForm)}
            />
          ))}
        </div>

        <div className="Buttons">
          <ButtonHome label="Phiếu khám bệnh mới" onClick={handleOpenExamine} data-feature="examine.create" />
          <ButtonHome label="Hồ sơ bệnh nhân mới" onClick={handleOpenPatient} data-feature="patient.create" />
        </div>
      </div>

      <SideSheet isOpen={sideSheetOpen} onClose={() => setSideSheetOpen(false)}>
        {selectedExamForm && (
          <ExamFormDetail
            maPKB={selectedExamForm.MaPKB}
            onUpdate={handleExamFormUpdated}
            onDelete={handleExamFormUpdated}
            onClose={() => setSideSheetOpen(false)}
          />
        )}
      </SideSheet>
    </div>
  );
};

export default Home;
