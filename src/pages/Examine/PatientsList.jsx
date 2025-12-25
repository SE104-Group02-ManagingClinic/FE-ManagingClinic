import React, { useState, useEffect } from "react";
import { getAllPatients } from "../../api/patientApi";
import PatientTicket from "./PatientTicket";
import SideSheet from "../SideSheet/SideSheet";
import PatientDetail from "./PatientDetail";
import { useBottomSheet } from "../../contexts/BottomSheetContext";
import { useToast } from "../../contexts/ToastContext";

const PatientsList = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [sideSheetOpen, setSideSheetOpen] = useState(false);
  const [isPatientEditing, setIsPatientEditing] = useState(false);
  const { refreshTriggers, pendingPatients } = useBottomSheet();
  const { showError } = useToast();

  useEffect(() => {
    fetchPatients();
  }, [refreshTriggers.patients]);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const data = await getAllPatients();
      setPatients(data);
      setError("");
    } catch (err) {
      showError(err.message || "Lỗi khi load danh sách bệnh nhân");
      setError(err.message || "Lỗi khi load danh sách bệnh nhân");
      setPatients([]);
    } finally {
      setLoading(false);
    }
  };

  // Gộp bệnh nhân pending với bệnh nhân từ database
  const allPatients = [...pendingPatients, ...patients];

  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
    setSideSheetOpen(true);
  };

  const handlePatientUpdated = () => {
    // Close first so UI updates immediately
    setIsPatientEditing(false);
    setSideSheetOpen(false);
    setSelectedPatient(null);
    fetchPatients();
  };

  const handlePatientDeleted = () => {
    // Close immediately on delete
    setSideSheetOpen(false);
    setSelectedPatient(null);
    setIsPatientEditing(false);
    // Refresh list after closing
    fetchPatients();
  };

  const handleSideSheetClose = () => {
    if (isPatientEditing) {
      const confirmClose = window.confirm('Bạn đang chỉnh sửa thông tin. Bạn có chắc muốn đóng và hủy các thay đổi?');
      if (!confirmClose) {
        return;
      }
    }
    setIsPatientEditing(false);
    setSideSheetOpen(false);
    setSelectedPatient(null);
  };

  return (
    <div className="tab-content">
      <div className="scroll-list">
        {loading && <p style={{ color: "#fff", textAlign: "center" }}>Đang tải...</p>}
        {error && <p style={{ color: "#ff6b6b", textAlign: "center" }}>{error}</p>}
        {!loading && allPatients.length === 0 && !error && (
          <p style={{ color: "#fff", textAlign: "center" }}>Không có bệnh nhân</p>
        )}
        {allPatients.map((patient) => (
          <PatientTicket
            key={patient.MaBN}
            patient={patient}
            name={patient.HoTen}
            gender={patient.GioiTinh}
            age={patient.NamSinh}
            isPending={patient.isPending}
            onClick={() => handleSelectPatient(patient)}
          />
        ))}
      </div>

      <SideSheet isOpen={sideSheetOpen} onClose={handleSideSheetClose}>
        <PatientDetail 
          patient={selectedPatient} 
          onPatientUpdated={handlePatientUpdated}
          onPatientDeleted={handlePatientDeleted}
          onEditStateChange={setIsPatientEditing} 
        />
      </SideSheet>
    </div>
  );
};

export default PatientsList;
