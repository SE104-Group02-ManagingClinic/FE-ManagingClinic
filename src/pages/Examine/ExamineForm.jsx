import React, { useState, useEffect } from "react";
import "./ExamineForm.css";
import { createMedicalExamForm, updateMedicalExamForm } from "../../api/medicalExamFormApi";
import { getAllDiseases } from "../../api/diseaseApi";
import { getAllMedicines } from "../../api/medicineApi";
import { searchPatientByCCCD, createPatient } from "../../api/patientApi";
import { useBottomSheet } from "../../contexts/BottomSheetContext";
import { useToast } from "../../contexts/ToastContext";

const ExamineForm = ({ initialData, onSubmit, onCancel }) => {
  const isEditMode = !!initialData?.MaPKB;
  const { getPendingPatientByCCCD, removePendingPatient, addPendingPatient, refreshTriggers } = useBottomSheet();
  const { showSuccess, showError, showInfo, showWarning } = useToast();
  
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

  // Loading state
  const [loading, setLoading] = useState(false);
  const [showNewPatientForm, setShowNewPatientForm] = useState(false);
  const [newPatientData, setNewPatientData] = useState({
    HoTen: "",
    GioiTinh: "",
    NamSinh: "",
    CCCD: "",
    DiaChi: "",
    SDT: "",
  });

  // Load diseases and medicines on mount and when they change
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
        showError("Lỗi khi tải dữ liệu: " + err.message);
      }
    };
    loadData();
  }, [refreshTriggers.medicines, refreshTriggers.diseases]);

  // Search patient by CCCD
  const handleSearchPatient = async () => {
    if (!cccdSearch || cccdSearch.trim() === "") {
      setSearchError("Vui lòng nhập CCCD");
      return;
    }

    try {
      setSearchError("");
      
      // Kiểm tra bệnh nhân pending trước
      const pendingPatient = getPendingPatientByCCCD(cccdSearch);
      if (pendingPatient) {
        setPatientInfo({ ...pendingPatient, isPending: true });
        setFormData(prev => ({ ...prev, MaBN: pendingPatient.MaBN }));
        setSearchError("");
        return;
      }

      // Nếu không có pending, tìm trong database
      const result = await searchPatientByCCCD(cccdSearch);
      
      // Handle both array and object responses
      let patient = null;
      if (Array.isArray(result) && result.length > 0) {
        patient = result[0]; // Array response
      } else if (result && typeof result === 'object' && result.MaBN) {
        patient = result; // Single object response
      }

      if (patient) {
        setPatientInfo({ ...patient, isPending: false });
        setFormData(prev => ({ ...prev, MaBN: patient.MaBN }));
        setSearchError("");
        setShowNewPatientForm(false);
      } else {
        // Không tìm thấy bệnh nhân - hiển thị thông báo và nút tạo mới
        setPatientInfo(null);
        setSearchError("Không tìm thấy bệnh nhân. Vui lòng tạo hồ sơ mới.");
        setShowNewPatientForm(false); // Không tự động mở form, đợi user bấm nút
        setNewPatientData(prev => ({ ...prev, CCCD: cccdSearch }));
      }
    } catch (err) {
      showError(err.message || "Lỗi khi tìm bệnh nhân");
      setSearchError(err.message || "Lỗi khi tìm bệnh nhân");
      setPatientInfo(null);
      setShowNewPatientForm(false);
    }
  };

  // Handle creating new patient temporarily
  const handleCreateNewPatient = () => {
    if (!newPatientData.HoTen.trim() || !newPatientData.CCCD.trim() || !newPatientData.SDT.trim() || !newPatientData.NamSinh || !newPatientData.GioiTinh) {
      showWarning("Vui lòng điền đầy đủ các trường bắt buộc!");
      return;
    }

    if (!/^\d{12}$/.test(newPatientData.CCCD)) {
      showWarning("CCCD phải gồm đúng 12 số!");
      return;
    }

    if (!/^\d{10}$/.test(newPatientData.SDT)) {
      showWarning("Số điện thoại phải gồm đúng 10 số!");
      return;
    }

    // Thêm vào pending patients từ context
    const pendingPatient = addPendingPatient(newPatientData);
    
    setPatientInfo({ ...pendingPatient, isPending: true });
    setFormData(prev => ({ ...prev, MaBN: pendingPatient.MaBN }));
    setShowNewPatientForm(false);
    setSearchError("");
    showSuccess(`Đã thêm bệnh nhân "${newPatientData.HoTen}" vào danh sách chờ`);
    
    // Reset new patient form
    setNewPatientData({
      HoTen: "",
      GioiTinh: "",
      NamSinh: "",
      CCCD: "",
      DiaChi: "",
      SDT: "",
    });
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

    // Validation
    if (!formData.MaBN) {
      showWarning("Vui lòng tìm và chọn bệnh nhân");
      return;
    }
    if (!formData.NgayKham) {
      showWarning("Vui lòng chọn ngày khám");
      return;
    }
    if (!formData.TrieuChung || formData.TrieuChung.trim() === "") {
      showWarning("Vui lòng nhập triệu chứng");
      return;
    }

    try {
      setLoading(true);
      
      let actualMaBN = formData.MaBN;
      
      // Kiểm tra nếu bệnh nhân là pending (chưa lưu database)
      if (patientInfo?.isPending) {
        showInfo("Đang tạo bệnh nhân mới trong hệ thống...");
        
        // Tạo bệnh nhân thật trong database
        const patientPayload = {
          HoTen: patientInfo.HoTen,
          CCCD: patientInfo.CCCD,
          GioiTinh: patientInfo.GioiTinh,
          NamSinh: patientInfo.NamSinh,
          DiaChi: patientInfo.DiaChi,
          SDT: patientInfo.SDT,
        };
        
        const createdPatient = await createPatient(patientPayload);
        showSuccess("Đã tạo bệnh nhân thành công!");
        
        // Cập nhật MaBN thật từ database
        actualMaBN = createdPatient.MaBN;
        
        // Xóa bệnh nhân pending khỏi context
        removePendingPatient(patientInfo.MaBN);
        
        // Cập nhật patientInfo với thông tin thật
        setPatientInfo(prev => ({ ...prev, MaBN: actualMaBN, isPending: false }));
      }
      
      // Cập nhật formData với MaBN thật
      const submitData = { ...formData, MaBN: actualMaBN };
      
      let result;
      if (isEditMode) {
        result = await updateMedicalExamForm(initialData.MaPKB, submitData);
        showSuccess("Cập nhật phiếu khám bệnh thành công!");
      } else {
        result = await createMedicalExamForm(submitData);
        showSuccess(`Tạo phiếu khám bệnh thành công! Mã PKB: ${result.MaPKB}`);
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
      showError(err.message || "Lỗi khi lưu phiếu khám bệnh");
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
            {searchError && (
              <div className="search-error-box">
                <p className="error-text">{searchError}</p>
                {searchError.includes("Không tìm thấy") && (
                  <button 
                    type="button" 
                    onClick={() => setShowNewPatientForm(true)}
                    className="btn-create-patient"
                  >
                    ✓ Tạo hồ sơ mới
                  </button>
                )}
              </div>
            )}
          </div>

          {patientInfo && (
            <div className={`patient-info-box ${patientInfo.isPending ? 'pending' : ''}`}>
              <h3>
                Thông tin bệnh nhân
                {patientInfo.isPending && (
                  <span className="pending-badge">⏳ Chờ lưu</span>
                )}
              </h3>
              <p><strong>Mã BN:</strong> {patientInfo.isPending ? '(Tạm thời)' : patientInfo.MaBN}</p>
              <p><strong>Họ tên:</strong> {patientInfo.HoTen}</p>
              <p><strong>CCCD:</strong> {patientInfo.CCCD}</p>
              <p><strong>Giới tính:</strong> {patientInfo.GioiTinh}</p>
              <p><strong>Năm sinh:</strong> {new Date(patientInfo.NamSinh).getFullYear()}</p>
              {patientInfo.isPending && (
                <p className="pending-note">
                  <em>* Bệnh nhân sẽ được lưu vào hệ thống khi tạo phiếu khám</em>
                </p>
              )}
            </div>
          )}

          {showNewPatientForm && !patientInfo && (
            <div className="new-patient-form">
              <h3>🩺 Tạo bệnh nhân mới</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Họ tên: <span className="required">*</span></label>
                  <input
                    type="text"
                    value={newPatientData.HoTen}
                    onChange={(e) => setNewPatientData(prev => ({ ...prev, HoTen: e.target.value }))}
                    placeholder="Nhập họ tên"
                  />
                </div>
                <div className="form-group">
                  <label>Giới tính: <span className="required">*</span></label>
                  <select
                    value={newPatientData.GioiTinh}
                    onChange={(e) => setNewPatientData(prev => ({ ...prev, GioiTinh: e.target.value }))}
                  >
                    <option value="">-- Chọn --</option>
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Năm sinh: <span className="required">*</span></label>
                  <input
                    type="date"
                    value={newPatientData.NamSinh}
                    onChange={(e) => setNewPatientData(prev => ({ ...prev, NamSinh: e.target.value }))}
                  />
                </div>
                <div className="form-group">
                  <label>CCCD: <span className="required">*</span></label>
                  <input
                    type="text"
                    value={newPatientData.CCCD}
                    onChange={(e) => setNewPatientData(prev => ({ ...prev, CCCD: e.target.value }))}
                    placeholder="12 số"
                    maxLength="12"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Số điện thoại: <span className="required">*</span></label>
                  <input
                    type="text"
                    value={newPatientData.SDT}
                    onChange={(e) => setNewPatientData(prev => ({ ...prev, SDT: e.target.value }))}
                    placeholder="10 số"
                    maxLength="10"
                  />
                </div>
                <div className="form-group">
                  <label>Địa chỉ:</label>
                  <input
                    type="text"
                    value={newPatientData.DiaChi}
                    onChange={(e) => setNewPatientData(prev => ({ ...prev, DiaChi: e.target.value }))}
                    placeholder="Địa chỉ"
                  />
                </div>
              </div>
              <div className="form-actions-inline">
                <button type="button" onClick={handleCreateNewPatient} className="btn-primary">
                  ✓ Thêm vào danh sách chờ
                </button>
                <button type="button" onClick={() => setShowNewPatientForm(false)} className="btn-secondary">
                  ✗ Hủy
                </button>
              </div>
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

            {/* Hiển thị chi tiết các bệnh đã chọn */}
            {selectedDiseases.length > 0 && (
              <div className="selected-diseases-details">
                <h4>📋 Chi tiết bệnh đã chọn:</h4>
                {selectedDiseases.map((diseaseId) => {
                  const disease = diseases.find(d => d.MaBenh === diseaseId);
                  if (!disease) return null;
                  return (
                    <div key={disease.MaBenh} className="disease-detail-card">
                      <div className="disease-header">
                        <strong>{disease.TenBenh}</strong>
                        <button 
                          type="button" 
                          className="btn-remove-disease"
                          onClick={() => {
                            const newSelected = selectedDiseases.filter(id => id !== diseaseId);
                            setSelectedDiseases(newSelected);
                            setFormData(prev => ({ ...prev, CT_Benh: newSelected }));
                          }}
                        >
                          ✕
                        </button>
                      </div>
                      {disease.TrieuChung && (
                        <p><span className="label">Triệu chứng:</span> {disease.TrieuChung}</p>
                      )}
                      {disease.NguyenNhan && (
                        <p><span className="label">Nguyên nhân:</span> {disease.NguyenNhan}</p>
                      )}
                      {disease.BienPhapChanDoan && (
                        <p><span className="label">Biện pháp chẩn đoán:</span> {disease.BienPhapChanDoan}</p>
                      )}
                      {disease.CachDieuTri && (
                        <p><span className="label">Cách điều trị:</span> {disease.CachDieuTri}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
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
