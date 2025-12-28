import React, { useState } from "react";
import "./PatientReception.css";
import { searchPatientByCCCD, createPatient } from "../../api/patientApi";
import { addPatientToExamList } from "../../api/listExamApi";
import { useToast } from "../../contexts/ToastContext";
import { useBottomSheet } from "../../contexts/BottomSheetContext";

/**
 * Component tiếp nhận bệnh nhân (dành cho lễ tân)
 * Luồng: CCCD → Tìm bệnh nhân → Tạo mới nếu chưa có → Thêm vào danh sách khám bệnh
 */
const PatientReception = ({ onSuccess, onCancel }) => {
  const { showSuccess, showError, showWarning, showInfo } = useToast();
  const { triggerRefresh } = useBottomSheet();

  // State
  const [step, setStep] = useState(1); // 1: Tìm CCCD, 2: Tạo mới, 3: Xác nhận
  const [loading, setLoading] = useState(false);
  const [cccd, setCCCD] = useState("");
  const [patientInfo, setPatientInfo] = useState(null);
  const [isNewPatient, setIsNewPatient] = useState(false);

  // Form data cho bệnh nhân mới
  const [newPatientData, setNewPatientData] = useState({
    HoTen: "",
    CCCD: "",
    GioiTinh: "",
    NamSinh: "",
    DiaChi: "",
    SDT: "",
  });

  // Ngày khám mặc định là hôm nay
  const today = new Date().toISOString().split('T')[0];

  // Bước 1: Tìm bệnh nhân theo CCCD
  const handleSearchPatient = async () => {
    if (!cccd || cccd.trim() === "") {
      showWarning("Vui lòng nhập số CCCD");
      return;
    }

    if (!/^\d{12}$/.test(cccd)) {
      showWarning("CCCD phải gồm đúng 12 số");
      return;
    }

    setLoading(true);
    try {
      const result = await searchPatientByCCCD(cccd);
      
      // Xử lý response (có thể là array hoặc object)
      let patient = null;
      if (Array.isArray(result) && result.length > 0) {
        patient = result[0];
      } else if (result && typeof result === 'object' && result.MaBN) {
        patient = result;
      }

      if (patient) {
        // Tìm thấy bệnh nhân
        setPatientInfo(patient);
        setIsNewPatient(false);
        setStep(3); // Chuyển sang bước xác nhận
        showSuccess(`Tìm thấy bệnh nhân: ${patient.HoTen}`);
      } else {
        // Không tìm thấy → Chuyển sang bước tạo mới
        setPatientInfo(null);
        setIsNewPatient(true);
        setNewPatientData(prev => ({ ...prev, CCCD: cccd }));
        setStep(2);
        showInfo("Không tìm thấy bệnh nhân. Vui lòng tạo hồ sơ mới.");
      }
    } catch (err) {
      showError(err.message || "Lỗi khi tìm kiếm bệnh nhân");
    } finally {
      setLoading(false);
    }
  };

  // Bước 2: Tạo bệnh nhân mới
  const handleCreatePatient = async () => {
    // Validate
    if (!newPatientData.HoTen.trim()) {
      showWarning("Vui lòng nhập họ tên");
      return;
    }
    if (!newPatientData.CCCD.trim() || !/^\d{12}$/.test(newPatientData.CCCD)) {
      showWarning("CCCD phải gồm đúng 12 số");
      return;
    }
    if (!newPatientData.GioiTinh) {
      showWarning("Vui lòng chọn giới tính");
      return;
    }
    if (!newPatientData.NamSinh) {
      showWarning("Vui lòng nhập năm sinh");
      return;
    }
    if (!newPatientData.SDT.trim() || !/^\d{10}$/.test(newPatientData.SDT)) {
      showWarning("Số điện thoại phải gồm đúng 10 số");
      return;
    }

    setLoading(true);
    try {
      const createdPatient = await createPatient(newPatientData);
      setPatientInfo(createdPatient);
      setStep(3); // Chuyển sang bước xác nhận
      showSuccess(`Đã tạo bệnh nhân: ${createdPatient.HoTen}`);
    } catch (err) {
      showError(err.message || "Lỗi khi tạo bệnh nhân");
    } finally {
      setLoading(false);
    }
  };

  // Bước 3: Thêm vào danh sách khám bệnh
  const handleAddToExamList = async () => {
    if (!patientInfo?.MaBN) {
      showError("Không tìm thấy thông tin bệnh nhân");
      return;
    }

    setLoading(true);
    try {
      await addPatientToExamList({
        NgayKham: today,
        MaBN: patientInfo.MaBN,
      });

      showSuccess(`Đã thêm ${patientInfo.HoTen} vào danh sách khám ngày ${new Date(today).toLocaleDateString('vi-VN')}`);
      
      // Trigger refresh danh sách khám
      triggerRefresh('examList');
      triggerRefresh('examForms');

      // Callback và reset
      if (onSuccess) {
        onSuccess(patientInfo);
      }
      handleReset();
    } catch (err) {
      // Có thể bệnh nhân đã có trong danh sách
      showError(err.message || "Lỗi khi thêm vào danh sách khám");
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const handleReset = () => {
    setStep(1);
    setCCCD("");
    setPatientInfo(null);
    setIsNewPatient(false);
    setNewPatientData({
      HoTen: "",
      CCCD: "",
      GioiTinh: "",
      NamSinh: "",
      DiaChi: "",
      SDT: "",
    });
  };

  // Quay lại bước trước
  const handleBack = () => {
    if (step === 2) {
      setStep(1);
      setIsNewPatient(false);
    } else if (step === 3 && isNewPatient) {
      setStep(2);
    } else if (step === 3) {
      setStep(1);
      setPatientInfo(null);
    }
  };

  return (
    <div className="patient-reception">
      <div className="reception-header">
        <h2>🏥 Tiếp nhận bệnh nhân</h2>
        <div className="step-indicator">
          <span className={`step ${step >= 1 ? 'active' : ''}`}>1. Tra cứu</span>
          <span className="step-arrow">→</span>
          <span className={`step ${step >= 2 ? 'active' : ''} ${!isNewPatient && step > 1 ? 'skipped' : ''}`}>
            2. Tạo hồ sơ
          </span>
          <span className="step-arrow">→</span>
          <span className={`step ${step >= 3 ? 'active' : ''}`}>3. Xác nhận</span>
        </div>
      </div>

      {/* Bước 1: Tìm CCCD */}
      {step === 1 && (
        <div className="step-content">
          <h3>📋 Nhập số CCCD của bệnh nhân</h3>
          <div className="form-group">
            <label>Số CCCD:</label>
            <input
              type="text"
              value={cccd}
              onChange={(e) => setCCCD(e.target.value.replace(/\D/g, '').slice(0, 12))}
              placeholder="Nhập 12 số CCCD"
              maxLength="12"
              disabled={loading}
              onKeyPress={(e) => e.key === 'Enter' && handleSearchPatient()}
            />
          </div>
          <div className="form-actions">
            <button 
              type="button" 
              onClick={handleSearchPatient} 
              disabled={loading}
              className="btn-primary"
            >
              {loading ? "Đang tìm..." : "🔍 Tra cứu"}
            </button>
            {onCancel && (
              <button type="button" onClick={onCancel} className="btn-secondary">
                Hủy
              </button>
            )}
          </div>
        </div>
      )}

      {/* Bước 2: Tạo bệnh nhân mới */}
      {step === 2 && (
        <div className="step-content">
          <h3>📝 Tạo hồ sơ bệnh nhân mới</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Họ tên: <span className="required">*</span></label>
              <input
                type="text"
                value={newPatientData.HoTen}
                onChange={(e) => setNewPatientData(prev => ({ ...prev, HoTen: e.target.value }))}
                placeholder="Nhập họ tên"
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label>CCCD: <span className="required">*</span></label>
              <input
                type="text"
                value={newPatientData.CCCD}
                onChange={(e) => setNewPatientData(prev => ({ ...prev, CCCD: e.target.value.replace(/\D/g, '').slice(0, 12) }))}
                placeholder="12 số"
                maxLength="12"
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label>Giới tính: <span className="required">*</span></label>
              <select
                value={newPatientData.GioiTinh}
                onChange={(e) => setNewPatientData(prev => ({ ...prev, GioiTinh: e.target.value }))}
                disabled={loading}
              >
                <option value="">-- Chọn --</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
              </select>
            </div>
            <div className="form-group">
              <label>Năm sinh: <span className="required">*</span></label>
              <input
                type="date"
                value={newPatientData.NamSinh}
                onChange={(e) => setNewPatientData(prev => ({ ...prev, NamSinh: e.target.value }))}
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label>Số điện thoại: <span className="required">*</span></label>
              <input
                type="text"
                value={newPatientData.SDT}
                onChange={(e) => setNewPatientData(prev => ({ ...prev, SDT: e.target.value.replace(/\D/g, '').slice(0, 10) }))}
                placeholder="10 số"
                maxLength="10"
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label>Địa chỉ:</label>
              <input
                type="text"
                value={newPatientData.DiaChi}
                onChange={(e) => setNewPatientData(prev => ({ ...prev, DiaChi: e.target.value }))}
                placeholder="Địa chỉ"
                disabled={loading}
              />
            </div>
          </div>
          <div className="form-actions">
            <button type="button" onClick={handleBack} className="btn-secondary" disabled={loading}>
              ← Quay lại
            </button>
            <button type="button" onClick={handleCreatePatient} className="btn-primary" disabled={loading}>
              {loading ? "Đang tạo..." : "✓ Tạo hồ sơ"}
            </button>
          </div>
        </div>
      )}

      {/* Bước 3: Xác nhận thêm vào danh sách khám */}
      {step === 3 && patientInfo && (
        <div className="step-content">
          <h3>✅ Xác nhận thông tin</h3>
          <div className="patient-preview">
            <div className="preview-header">
              <span className="patient-name">{patientInfo.HoTen}</span>
              {isNewPatient && <span className="new-badge">Mới tạo</span>}
            </div>
            <div className="preview-grid">
              <div className="preview-item">
                <span className="label">Mã BN:</span>
                <span className="value">{patientInfo.MaBN}</span>
              </div>
              <div className="preview-item">
                <span className="label">CCCD:</span>
                <span className="value">{patientInfo.CCCD}</span>
              </div>
              <div className="preview-item">
                <span className="label">Giới tính:</span>
                <span className="value">{patientInfo.GioiTinh}</span>
              </div>
              <div className="preview-item">
                <span className="label">Năm sinh:</span>
                <span className="value">{patientInfo.NamSinh ? new Date(patientInfo.NamSinh).getFullYear() : 'N/A'}</span>
              </div>
              <div className="preview-item">
                <span className="label">SĐT:</span>
                <span className="value">{patientInfo.SDT || 'N/A'}</span>
              </div>
              <div className="preview-item">
                <span className="label">Địa chỉ:</span>
                <span className="value">{patientInfo.DiaChi || 'N/A'}</span>
              </div>
            </div>
          </div>
          
          <div className="exam-date-info">
            <p>📅 Ngày khám: <strong>{new Date(today).toLocaleDateString('vi-VN')}</strong></p>
          </div>

          <div className="form-actions">
            <button type="button" onClick={handleBack} className="btn-secondary" disabled={loading}>
              ← Quay lại
            </button>
            <button type="button" onClick={handleAddToExamList} className="btn-success" disabled={loading}>
              {loading ? "Đang xử lý..." : "✓ Thêm vào danh sách khám"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientReception;
