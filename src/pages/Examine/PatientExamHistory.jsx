import React, { useState, useEffect } from "react";
import "./PatientExamHistory.css";
import ExamineCard from "../../components/cards/ExamineCard";
import SideSheet from "../SideSheet/SideSheet";
import ExamFormDetail from "./ExamFormDetail";
import { useToast } from "../../contexts/ToastContext";

const PatientExamHistory = ({ patient }) => {
  const [examForms, setExamForms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedExamForm, setSelectedExamForm] = useState(null);
  const [sideSheetOpen, setSideSheetOpen] = useState(false);
  const { showError } = useToast();

  useEffect(() => {
    if (patient && patient.MaBN) {
      fetchPatientExamHistory();
    }
  }, [patient]);

  const fetchPatientExamHistory = async () => {
    // Endpoint getExamFormsByPatient không còn tồn tại
    setExamForms([]);
    setError("");
    setLoading(false);
  };

  const handleSelectExamForm = (examForm) => {
    setSelectedExamForm(examForm);
    setSideSheetOpen(true);
  };

  const handleExamFormUpdated = () => {
    fetchPatientExamHistory();
    setSideSheetOpen(false);
  };

  const handleSideSheetClose = () => {
    setSideSheetOpen(false);
    setSelectedExamForm(null);
  };

  if (!patient) {
    return (
      <div className="patient-exam-history">
        <p style={{ color: "#999", textAlign: "center" }}>Chọn bệnh nhân để xem lịch sử khám bệnh</p>
      </div>
    );
  }

  return (
    <div className="patient-exam-history">
      <div className="exam-history-header">
        <h3>Lịch sử khám bệnh</h3>
        <p className="patient-name">{patient.HoTen}</p>
      </div>

      <div className="exam-history-content">
        {loading && <p style={{ color: "#fff", textAlign: "center" }}>Đang tải...</p>}
        {error && <p style={{ color: "#ff6b6b", textAlign: "center" }}>{error}</p>}
        {!loading && examForms.length === 0 && !error && (
          <p style={{ color: "#999", textAlign: "center" }}>Không có phiếu khám nào</p>
        )}
        {!loading && examForms.length > 0 && (
          <div className="exam-history-list">
            {examForms.map((examForm) => (
              <ExamineCard
                key={examForm.MaPKB}
                examForm={examForm}
                onClick={() => handleSelectExamForm(examForm)}
              />
            ))}
          </div>
        )}
      </div>

      <SideSheet isOpen={sideSheetOpen} onClose={handleSideSheetClose}>
        <ExamFormDetail
          maPKB={selectedExamForm?.MaPKB}
          onUpdate={handleExamFormUpdated}
          onDelete={handleExamFormUpdated}
          onClose={handleSideSheetClose}
        />
      </SideSheet>
    </div>
  );
};

export default PatientExamHistory;
