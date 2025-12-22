import React, { useState, useEffect } from "react";
import "./ExamineForm.css";
import { createMedicalExamForm, updateMedicalExamForm } from "../../api/medicalExamFormApi";
import { getAllDiseases } from "../../api/diseaseApi";
import { getAllMedicines } from "../../api/medicineApi";
import { searchPatientByCCCD } from "../../api/patientApi";

const ExamineForm = ({ initialData, onSubmit, onCancel }) => {
  const isEditMode = !!initialData?.MaPKB;
  
  // Form state
  const [formData, setFormData] = useState({
    MaBN: initialData?.MaBN || "",
    NgayKham: initialData?.NgayKham || new Date().toISOString().split('T')[0],
    TrieuChung: initialData?.TrieuChung || "",
    CT_Benh: initialData?.CT_Benh?.map(b => b.MaBenh || b) || [],
    CT_Thuoc: initialData?.CT_Thuoc || [],
    TongTienThuoc: initialData?.TongTienThuoc || 0,
  });

  // Patient search
  const [cccdSearch, setCccdSearch] = useState(initialData?.CCCD || "");
  const [patientInfo, setPatientInfo] = useState(null);
  const [searchError, setSearchError] = useState("");

  // Dropdowns data
  const [diseases, setDiseases] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [selectedDiseases, setSelectedDiseases] = useState(formData.CT_Benh);

  // Medicine row state - reinit when initialData changes
  const [medicineRows, setMedicineRows] = useState(() => {
    if (initialData?.CT_Thuoc && initialData.CT_Thuoc.length > 0) {
      return initialData.CT_Thuoc;
    }
    return [{ MaThuoc: "", SoLuong: 1, GiaBan: 0, ThanhTien: 0 }];
  });

  // Sync medicineRows when initialData changes (for edit mode)
  useEffect(() => {
    if (initialData?.CT_Thuoc && initialData.CT_Thuoc.length > 0) {
      setMedicineRows(initialData.CT_Thuoc);
    }
  }, [initialData?.MaPKB]);

  // Loading & error
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Load diseases and medicines on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [diseasesData, medicinesData] = await Promise.all([
          getAllDiseases(),
          getAllMedicines(),
        ]);
        setDiseases(diseasesData);
        setMedicines(medicinesData);
      } catch (err) {
        console.error("Error loading data:", err);
        setError("Lỗi khi tải dữ liệu: " + err.message);
      }
    };
    loadData();
  }, []);

  // Search patient by CCCD
  const handleSearchPatient = async () => {
    if (!cccdSearch || cccdSearch.trim() === "") {
      setSearchError("Vui lòng nhập CCCD");
      return;
    }

    try {
      setSearchError("");
      const result = await searchPatientByCCCD(cccdSearch);
      
      // Handle both array and object responses
      let patient = null;
      if (Array.isArray(result) && result.length > 0) {
        patient = result[0]; // Array response
      } else if (result && typeof result === 'object' && result.MaBN) {
        patient = result; // Single object response
      }

      if (patient) {
        setPatientInfo(patient);
        setFormData(prev => ({ ...prev, MaBN: patient.MaBN }));
        setSearchError("");
      } else {
        setPatientInfo(null);
        setSearchError("Không tìm thấy bệnh nhân");
      }
    } catch (err) {
      console.error("Error searching patient:", err);
      setSearchError(err.message || "Lỗi khi tìm bệnh nhân");
      setPatientInfo(null);
    }
  };

  // Handle disease selection
  const handleDiseaseChange = (e) => {
    const options = e.target.options;
    const selected = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selected.push(options[i].value);
      }
    }
    setSelectedDiseases(selected);
    setFormData(prev => ({ ...prev, CT_Benh: selected }));
  };

  // Handle medicine row changes
  const handleMedicineChange = (index, field, value) => {
    const updatedRows = [...medicineRows];
    updatedRows[index][field] = value;

    // Auto-calculate ThanhTien when SoLuong or GiaBan changes
    if (field === "SoLuong" || field === "GiaBan") {
      const soLuong = parseFloat(updatedRows[index].SoLuong) || 0;
      const giaBan = parseFloat(updatedRows[index].GiaBan) || 0;
      updatedRows[index].ThanhTien = soLuong * giaBan;
    }

    // When medicine is selected, auto-fill price
    if (field === "MaThuoc") {
      const medicine = medicines.find(m => m.MaThuoc === value);
      if (medicine && medicine.GiaBan) {
        updatedRows[index].GiaBan = medicine.GiaBan;
        const soLuong = parseFloat(updatedRows[index].SoLuong) || 0;
        updatedRows[index].ThanhTien = soLuong * medicine.GiaBan;
      }
    }

    setMedicineRows(updatedRows);
    
    // Calculate total
    const total = updatedRows.reduce((sum, row) => sum + (parseFloat(row.ThanhTien) || 0), 0);
    setFormData(prev => ({ 
      ...prev, 
      CT_Thuoc: updatedRows.filter(row => row.MaThuoc), // Only include rows with medicine selected
      TongTienThuoc: total 
    }));
  };

  // Add medicine row
  const handleAddMedicineRow = () => {
    setMedicineRows([...medicineRows, { MaThuoc: "", SoLuong: 1, GiaBan: 0, ThanhTien: 0 }]);
  };

  // Remove medicine row
  const handleRemoveMedicineRow = (index) => {
    const updatedRows = medicineRows.filter((_, i) => i !== index);
    setMedicineRows(updatedRows.length > 0 ? updatedRows : [{ MaThuoc: "", SoLuong: 1, GiaBan: 0, ThanhTien: 0 }]);
    
    // Recalculate total
    const total = updatedRows.reduce((sum, row) => sum + (parseFloat(row.ThanhTien) || 0), 0);
    setFormData(prev => ({ 
      ...prev, 
      CT_Thuoc: updatedRows.filter(row => row.MaThuoc),
      TongTienThuoc: total 
    }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (!formData.MaBN) {
      setError("Vui lòng tìm và chọn bệnh nhân");
      return;
    }
    if (!formData.NgayKham) {
      setError("Vui lòng chọn ngày khám");
      return;
    }
    if (!formData.TrieuChung || formData.TrieuChung.trim() === "") {
      setError("Vui lòng nhập triệu chứng");
      return;
    }

    try {
      setLoading(true);
      
      let result;
      if (isEditMode) {
        result = await updateMedicalExamForm(initialData.MaPKB, formData);
        setSuccess("Cập nhật phiếu khám bệnh thành công!");
      } else {
        result = await createMedicalExamForm(formData);
        setSuccess(`Tạo phiếu khám bệnh thành công! Mã PKB: ${result.MaPKB}`);
      }

      // Call parent callback
      if (onSubmit) {
        onSubmit(result);
      }

      // Reset form if creating new
      if (!isEditMode) {
        setFormData({
          MaBN: "",
          NgayKham: new Date().toISOString().split('T')[0],
          TrieuChung: "",
          CT_Benh: [],
          CT_Thuoc: [],
          TongTienThuoc: 0,
        });
        setCccdSearch("");
        setPatientInfo(null);
        setSelectedDiseases([]);
        setMedicineRows([{ MaThuoc: "", SoLuong: 1, GiaBan: 0, ThanhTien: 0 }]);
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      setError(err.message || "Lỗi khi lưu phiếu khám bệnh");
    } finally {
      setLoading(false);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount || 0);
  };

  return (
    <div className="ticket-container">
      <div className="ticket-header">
        <h2>{isEditMode ? "Cập nhật phiếu khám bệnh" : "Phiếu khám bệnh mới"}</h2>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit}>
        {/* Patient Search Section */}
        <div className="patient-search-section">
          <div className="search-box">
            <label>Tìm bệnh nhân (CCCD):</label>
            <div className="search-input-group">
              <input
                type="text"
                value={cccdSearch}
                onChange={(e) => setCccdSearch(e.target.value)}
                placeholder="Nhập số CCCD"
                disabled={isEditMode}
              />
              <button 
                type="button" 
                onClick={handleSearchPatient}
                disabled={isEditMode || loading}
                className="btn-search"
              >
                Tìm
              </button>
            </div>
            {searchError && <p className="error-text">{searchError}</p>}
          </div>

          {patientInfo && (
            <div className="patient-info-box">
              <h3>Thông tin bệnh nhân</h3>
              <p><strong>Mã BN:</strong> {patientInfo.MaBN}</p>
              <p><strong>Họ tên:</strong> {patientInfo.HoTen}</p>
              <p><strong>CCCD:</strong> {patientInfo.CCCD}</p>
              <p><strong>Giới tính:</strong> {patientInfo.GioiTinh}</p>
              <p><strong>Năm sinh:</strong> {new Date(patientInfo.NamSinh).getFullYear()}</p>
            </div>
          )}
        </div>

        {/* Ticket Info */}
        <div className="ticket-info">
          <div className="left">
            <label>
              Ngày khám: *
              <input
                type="date"
                value={formData.NgayKham}
                onChange={(e) => setFormData(prev => ({ ...prev, NgayKham: e.target.value }))}
                required
              />
            </label>

            <label>
              Triệu chứng: *
              <textarea
                rows="2"
                value={formData.TrieuChung}
                onChange={(e) => setFormData(prev => ({ ...prev, TrieuChung: e.target.value }))}
                placeholder="Nhập triệu chứng"
                style={{ resize: 'none' }}
                required
              />
            </label>

            <label>
              Chọn bệnh:
              <select
                multiple
                value={selectedDiseases}
                onChange={handleDiseaseChange}
                size="5"
                className="disease-select"
              >
                {diseases.map((disease) => (
                  <option key={disease.MaBenh} value={disease.MaBenh}>
                    {disease.TenBenh}
                  </option>
                ))}
              </select>
              <small className="help-text">Giữ Ctrl để chọn nhiều bệnh</small>
            </label>
          </div>
        </div>

        {/* Medicine Table */}
        <div className="medicine-section">
          <div className="section-header">
            <h3>Danh sách thuốc</h3>
            <button type="button" onClick={handleAddMedicineRow} className="btn-add">
              + Thêm thuốc
            </button>
          </div>

          <table className="ticket-table">
            <thead>
              <tr>
                <th>STT</th>
                <th>Thuốc *</th>
                <th>Số lượng *</th>
                <th>Đơn giá</th>
                <th>Thành tiền</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {medicineRows.map((row, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>
                    <select
                      value={row.MaThuoc}
                      onChange={(e) => handleMedicineChange(index, "MaThuoc", e.target.value)}
                    >
                      <option value="">-- Chọn thuốc --</option>
                      {medicines.map((medicine) => (
                        <option key={medicine.MaThuoc} value={medicine.MaThuoc}>
                          {medicine.TenThuoc}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      value={row.SoLuong}
                      onChange={(e) => handleMedicineChange(index, "SoLuong", e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      value={row.GiaBan}
                      onChange={(e) => handleMedicineChange(index, "GiaBan", e.target.value)}
                    />
                  </td>
                  <td>{formatCurrency(row.ThanhTien)}</td>
                  <td>
                    <button
                      type="button"
                      onClick={() => handleRemoveMedicineRow(index)}
                      className="btn-remove"
                      disabled={medicineRows.length === 1}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Total */}
        <div className="ticket-total">
          <strong>Tổng tiền thuốc:</strong>
          <span className="total-amount">{formatCurrency(formData.TongTienThuoc)}</span>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button type="submit" disabled={loading} className="btn-submit">
            {loading ? "Đang xử lý..." : (isEditMode ? "Cập nhật" : "Tạo phiếu")}
          </button>
          {onCancel && (
            <button type="button" onClick={onCancel} className="btn-cancel">
              Hủy
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ExamineForm;
