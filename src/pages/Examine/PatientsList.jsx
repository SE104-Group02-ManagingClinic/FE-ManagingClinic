import React, { useState, useEffect } from "react";
import { getAllPatients } from "../../api/patientApi";
import PatientTicket from "./PatientTicket";
import PatientDetail from "./PatientDetail";
import { useBottomSheet } from "../../contexts/BottomSheetContext";
import { useToast } from "../../contexts/ToastContext";
import PermissionGuard from "../../components/PermissionGuard";

const PatientsList = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
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
    // Xổ ra thông tin bệnh nhân inline
    setSelectedPatient(patient);
  };

  const handlePatientUpdated = () => {
    // Đóng chi tiết và refresh danh sách
    setIsPatientEditing(false);
    setSelectedPatient(null);
    fetchPatients();
  };

  const handlePatientDeleted = () => {
    // Đóng chi tiết ngay lập tức
    setSelectedPatient(null);
    setIsPatientEditing(false);
    // Refresh danh sách sau khi đóng
    fetchPatients();
  };

  const handleClosePatientDetail = () => {
    if (isPatientEditing) {
      const confirmClose = window.confirm('Bạn đang chỉnh sửa thông tin. Bạn có chắc muốn đóng và hủy các thay đổi?');
      if (!confirmClose) {
        return;
      }
    }
    setIsPatientEditing(false);
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

      {selectedPatient && (
        <div className="patient-detail-container" style={{
          marginTop: '20px',
          padding: '20px',
          backgroundColor: '#f9f9f9',
          borderRadius: '8px',
          border: '1px solid #ddd',
          maxHeight: '500px',
          overflowY: 'auto'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <h3 style={{ margin: 0, color: '#333' }}>Chi tiết bệnh nhân: {selectedPatient.HoTen}</h3>
            <button 
              onClick={handleClosePatientDetail}
              style={{
                padding: '8px 16px',
                backgroundColor: '#999',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Đóng
            </button>
          </div>
          <PatientDetail 
            patient={selectedPatient} 
            onPatientUpdated={handlePatientUpdated}
            onPatientDeleted={handlePatientDeleted}
            onEditStateChange={setIsPatientEditing} 
          />
        </div>
      )}
    </div>
  );
};

export default PatientsList;
