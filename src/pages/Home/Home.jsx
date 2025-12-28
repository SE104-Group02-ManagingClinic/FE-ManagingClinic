import React, { useState, useEffect } from "react";
import "./Home.css";
import ProfileCard from "../../components/profile/ProfileCard";
import ExamListCard from "../../components/cards/ExamListCard";
import Sidebar from "../../components/sidebar/Sidebar";
import ButtonHome from "../../components/buttons/ButtonHome";
import { useBottomSheet } from "../../contexts/BottomSheetContext";
import { getDailyExamList } from "../../api/listExamApi";
import SideSheet from "../SideSheet/SideSheet";
import ExamFormDetail from "../Examine/ExamFormDetail";
import { useToast } from "../../contexts/ToastContext";
import PermissionGuard from "../../components/PermissionGuard";

const Home = () => {
  const { bottomSheetState, setBottomSheetState, refreshTriggers } = useBottomSheet();
  const [examList, setExamList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [sideSheetOpen, setSideSheetOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const { showError } = useToast();

  useEffect(() => {
    fetchDailyExamList();
  }, [selectedDate, refreshTriggers.examForms, refreshTriggers.examList]);

  const fetchDailyExamList = async () => {
    try {
      setLoading(true);
      const data = await getDailyExamList(selectedDate);
      // API trả về { NgayKham, TongSoBenhNhan, DanhSachBenhNhan: [...] }
      setExamList(data?.DanhSachBenhNhan || []);
      setError("");
    } catch (err) {
      showError(err.message || "Lỗi khi tải danh sách khám bệnh");
      setError(err.message || "Lỗi khi tải danh sách khám bệnh");
      setExamList([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
    // Nếu đã có phiếu khám, mở chi tiết phiếu khám
    // Nếu chưa có, mở form tạo phiếu khám với thông tin bệnh nhân
    if (patient.MaPKB) {
      setSideSheetOpen(true);
    } else {
      // Mở bottom sheet để tạo phiếu khám với thông tin bệnh nhân đã có
      setBottomSheetState(prev => ({
        ...prev, 
        homeExamine: true,
        examinePatientData: patient // Truyền thông tin bệnh nhân
      }));
    }
  };

  const handleExamFormUpdated = () => {
    fetchDailyExamList();
    setSideSheetOpen(false);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleOpenExamine = () => {
    setBottomSheetState(prev => ({...prev, homeExamine: true}));
  };

  const handleOpenReception = () => {
    setBottomSheetState(prev => ({...prev, homeReception: true}));
  };

  return (
    <div className="home-container">
      <div className="MainScreen">
        <div className="home-header">
          <h2 className="home-title">📋 Danh sách khám bệnh</h2>
          <div className="date-filter">
            <input 
              type="date" 
              value={selectedDate} 
              onChange={handleDateChange}
              className="date-picker"
            />
          </div>
        </div>
        
        <div className="exam-list-summary">
          <span className="summary-text">
            Ngày {new Date(selectedDate).toLocaleDateString('vi-VN')} - 
            Tổng: <strong>{examList.length}</strong> bệnh nhân | 
            Đã khám: <strong>{examList.filter(p => p.MaPKB).length}</strong> | 
            Chờ khám: <strong>{examList.filter(p => !p.MaPKB).length}</strong>
          </span>
        </div>
        
        <div className="UpcommingAppointments">
          {loading && <p className="loading-text">Đang tải...</p>}
          {error && <p className="error-text">{error}</p>}
          {!loading && examList.length === 0 && !error && (
            <p className="empty-text">Không có bệnh nhân nào trong danh sách khám ngày {new Date(selectedDate).toLocaleDateString('vi-VN')}</p>
          )}
          {examList.map((patient) => (
            <ExamListCard
              key={patient.MaBN}
              patient={patient}
              onClick={() => handleSelectPatient(patient)}
            />
          ))}
        </div>

        <div className="Buttons">
          <ButtonHome label="Tiếp nhận bệnh nhân" onClick={handleOpenReception} data-feature="patient.reception" />
          <ButtonHome label="Phiếu khám bệnh mới" onClick={handleOpenExamine} data-feature="examine.create" />
        </div>
      </div>

      <SideSheet isOpen={sideSheetOpen} onClose={() => setSideSheetOpen(false)}>
        {selectedPatient?.MaPKB && (
          <ExamFormDetail
            maPKB={selectedPatient.MaPKB}
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
