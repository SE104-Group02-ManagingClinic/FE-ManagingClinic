import React, { useState, useEffect } from "react";
import { getExamFormsByDate } from "../../api/medicalExamFormApi";
import ExamineCard from "../../components/cards/ExamineCard";
import SideSheet from "../SideSheet/SideSheet";
import ExamFormDetail from "./ExamFormDetail";
import { useBottomSheet } from "../../contexts/BottomSheetContext";

const ExamFormsList = () => {
  const [examForms, setExamForms] = useState([]);
  const [loadingExams, setLoadingExams] = useState(true);
  const [examError, setExamError] = useState("");
  const [selectedExamForm, setSelectedExamForm] = useState(null);
  const [sideSheetOpen, setSideSheetOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const { refreshTriggers } = useBottomSheet();

  useEffect(() => {
    fetchExamForms();
  }, [selectedDate, refreshTriggers.examForms]);

  const fetchExamForms = async () => {
    try {
      setLoadingExams(true);
      const data = await getExamFormsByDate(selectedDate);
      setExamForms(data);
      setExamError("");
    } catch (err) {
      console.error("Lỗi khi load phiếu khám:", err);
      setExamError(err.message || "Lỗi khi load danh sách phiếu khám");
      setExamForms([]);
    } finally {
      setLoadingExams(false);
    }
  };

  const handleSelectExamForm = (examForm) => {
    setSelectedExamForm(examForm);
    setSideSheetOpen(true);
  };

  const handleExamFormUpdated = () => {
    fetchExamForms();
    setSideSheetOpen(false);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  return (
    <div className="tab-content">
      <div className="date-filter" style={{ marginBottom: "16px" }}>
        <input 
          type="date" 
          value={selectedDate} 
          onChange={handleDateChange}
          className="date-picker"
        />
      </div>

      <div className="scroll-list">
        {loadingExams && <p style={{ color: "#fff", textAlign: "center" }}>Đang tải...</p>}
        {examError && <p style={{ color: "#ff6b6b", textAlign: "center" }}>{examError}</p>}
        {!loadingExams && examForms.length === 0 && !examError && (
          <p style={{ color: "#fff", textAlign: "center" }}>
            Không có phiếu khám nào vào ngày {new Date(selectedDate).toLocaleDateString("vi-VN")}
          </p>
        )}
        {examForms.map((examForm) => (
          <ExamineCard
            key={examForm.MaPKB}
            examForm={examForm}
            onClick={() => handleSelectExamForm(examForm)}
          />
        ))}
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

export default ExamFormsList;
