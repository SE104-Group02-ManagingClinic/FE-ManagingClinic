import React, { useState, useEffect } from "react";
import "./ExamFormDetail.css";
import { getExamFormById, updateMedicalExamForm, deleteMedicalExamForm } from "../../api/medicalExamFormApi";
import { getAllDiseases } from "../../api/diseaseApi";
import { getAllMedicines } from "../../api/medicineApi";
import { useToast } from "../../contexts/ToastContext";
import DeleteConfirmModal from "../../components/DeleteConfirmModal";

const ExamFormDetail = ({ maPKB, onUpdate, onDelete, onClose }) => {
  const [examForm, setExamForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const { showSuccess, showError } = useToast();

  // Edit mode state
  const [editData, setEditData] = useState({
    MaBN: "",
    NgayKham: "",
    TrieuChung: "",
    CT_Benh: [],
    CT_Thuoc: [],
    TongTienThuoc: 0,
  });

  const [diseases, setDiseases] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [medicineRows, setMedicineRows] = useState([]);

  // Load exam form details
  useEffect(() => {
    const fetchExamForm = async () => {
      try {
        setLoading(true);
        const data = await getExamFormById(maPKB);
        setExamForm(data);
        
        // Initialize edit data
        setEditData({
          MaBN: data.MaBN,
          NgayKham: data.NgayKham,
          TrieuChung: data.TrieuChung,
          CT_Benh: data.CT_Benh?.map(b => b.MaBenh) || [],
          CT_Thuoc: data.CT_Thuoc || [],
          TongTienThuoc: data.TongTienThuoc,
        });
        setMedicineRows(data.CT_Thuoc || []);
        setError("");
      } catch (err) {
        showError(err.message || "Lỗi khi tải thông tin phiếu khám");
        setError(err.message || "Lỗi khi tải thông tin phiếu khám");
      } finally {
        setLoading(false);
      }
    };

    if (maPKB) {
      fetchExamForm();
    }
  }, [maPKB]);

  // Load diseases and medicines for editing
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
        showError("Lỗi khi tải dữ liệu tham chiếu");
      }
    };

    if (isEditing) {
      loadData();
    }
  }, [isEditing]);

  // Handle edit mode toggle
  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel edit - reset to original data
      setEditData({
        MaBN: examForm.MaBN,
        NgayKham: examForm.NgayKham,
        TrieuChung: examForm.TrieuChung,
        CT_Benh: examForm.CT_Benh?.map(b => b.MaBenh) || [],
        CT_Thuoc: examForm.CT_Thuoc || [],
        TongTienThuoc: examForm.TongTienThuoc,
      });
      setMedicineRows(examForm.CT_Thuoc || []);
    }
    setIsEditing(!isEditing);
    setError("");
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
    setEditData(prev => ({ ...prev, CT_Benh: selected }));
  };

  // Handle medicine row changes
  const handleMedicineChange = (index, field, value) => {
    const updatedRows = [...medicineRows];
    updatedRows[index][field] = value;

    if (field === "SoLuong" || field === "GiaBan") {
      const soLuong = parseFloat(updatedRows[index].SoLuong) || 0;
      const giaBan = parseFloat(updatedRows[index].GiaBan) || 0;
      updatedRows[index].ThanhTien = soLuong * giaBan;
    }

    if (field === "MaThuoc") {
      const medicine = medicines.find(m => m.MaThuoc === value);
      if (medicine && medicine.GiaBan) {
        updatedRows[index].GiaBan = medicine.GiaBan;
        const soLuong = parseFloat(updatedRows[index].SoLuong) || 0;
        updatedRows[index].ThanhTien = soLuong * medicine.GiaBan;
      }
    }

    setMedicineRows(updatedRows);
    
    const total = updatedRows.reduce((sum, row) => sum + (parseFloat(row.ThanhTien) || 0), 0);
    setEditData(prev => ({ 
      ...prev, 
      CT_Thuoc: updatedRows.filter(row => row.MaThuoc),
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
    setMedicineRows(updatedRows);
    
    const total = updatedRows.reduce((sum, row) => sum + (parseFloat(row.ThanhTien) || 0), 0);
    setEditData(prev => ({ 
      ...prev, 
      CT_Thuoc: updatedRows.filter(row => row.MaThuoc),
      TongTienThuoc: total 
    }));
  };

  // Handle update
  const handleUpdate = async () => {
    try {
      setLoading(true);
      setError("");

      await updateMedicalExamForm(maPKB, editData);
      showSuccess("Cập nhật phiếu khám bệnh thành công!");
      
      // Reload data
      const updatedData = await getExamFormById(maPKB);
      setExamForm(updatedData);
      setIsEditing(false);

      if (onUpdate) {
        onUpdate(updatedData);
      }
    } catch (err) {
      showError(err.message || "Lỗi khi cập nhật phiếu khám");
      setError(err.message || "Lỗi khi cập nhật phiếu khám");
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    setDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      setLoading(true);
      setError("");
      await deleteMedicalExamForm(maPKB);
      setDeleteModal(false);
      
      if (onDelete) {
        onDelete(maPKB);
      }
      
      if (onClose) {
        onClose();
      }
      
      showSuccess("Đã xóa phiếu khám bệnh thành công!");
    } catch (err) {
      showError(err.message || "Lỗi khi xóa phiếu khám");
      setError(err.message || "Lỗi khi xóa phiếu khám");
      setLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal(false);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount || 0);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  if (loading && !examForm) {
    return <div className="exam-form-detail loading">Đang tải...</div>;
  }

  if (error && !examForm) {
    return <div className="exam-form-detail error">{error}</div>;
  }

  if (!examForm) {
    return <div className="exam-form-detail">Không tìm thấy phiếu khám</div>;
  }

  return (
    <div className="exam-form-detail">
      <div className="detail-header">
        <h2>{isEditing ? "Chỉnh sửa phiếu khám" : "Chi tiết phiếu khám"}</h2>
        <div className="header-actions">
          {!isEditing && (
            <>
              <button className="btn-edit" onClick={handleEditToggle}>
                Sửa
              </button>
              <button className="btn-delete" onClick={handleDelete}>
                Xóa
              </button>
            </>
          )}
          {isEditing && (
            <>
              <button className="btn-save" onClick={handleUpdate} disabled={loading}>
                {loading ? "Đang lưu..." : "Lưu"}
              </button>
              <button className="btn-cancel" onClick={handleEditToggle}>
                Hủy
              </button>
            </>
          )}
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="detail-content">
        {/* Patient Information */}
        <div className="detail-section">
          <h3>Thông tin bệnh nhân</h3>
          <div className="info-grid">
            <div className="info-item">
              <label>Mã PKB:</label>
              <p>{examForm.MaPKB}</p>
            </div>
            <div className="info-item">
              <label>Mã BN:</label>
              <p>{examForm.MaBN}</p>
            </div>
            <div className="info-item">
              <label>Họ tên:</label>
              <p>{examForm.HoTen}</p>
            </div>
            <div className="info-item">
              <label>CCCD:</label>
              <p>{examForm.CCCD}</p>
            </div>
          </div>
        </div>

        {/* Examination Information */}
        <div className="detail-section">
          <h3>Thông tin khám</h3>
          
          <div className="info-item">
            <label>Ngày khám:</label>
            {isEditing ? (
              <input
                type="date"
                value={editData.NgayKham}
                onChange={(e) => setEditData(prev => ({ ...prev, NgayKham: e.target.value }))}
              />
            ) : (
              <p>{formatDate(examForm.NgayKham)}</p>
            )}
          </div>

          <div className="info-item">
            <label>Triệu chứng:</label>
            {isEditing ? (
              <textarea
                rows="3"
                value={editData.TrieuChung}
                onChange={(e) => setEditData(prev => ({ ...prev, TrieuChung: e.target.value }))}
              />
            ) : (
              <p>{examForm.TrieuChung}</p>
            )}
          </div>

          <div className="info-item">
            <label>Danh sách bệnh:</label>
            {isEditing ? (
              <select
                multiple
                value={editData.CT_Benh}
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
            ) : (
              <div className="disease-list">
                {examForm.CT_Benh && examForm.CT_Benh.length > 0 ? (
                  examForm.CT_Benh.map((disease, index) => (
                    <span key={index} className="disease-tag">
                      {disease.TenBenh}
                    </span>
                  ))
                ) : (
                  <p>Chưa có bệnh nào</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Medicine List */}
        <div className="detail-section">
          <div className="section-header">
            <h3>Danh sách thuốc</h3>
            {isEditing && (
              <button className="btn-add-small" onClick={handleAddMedicineRow}>
                + Thêm
              </button>
            )}
          </div>

          {isEditing ? (
            <table className="medicine-table">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Thuốc</th>
                  <th>Số lượng</th>
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
                        className="btn-remove-small"
                        onClick={() => handleRemoveMedicineRow(index)}
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="medicine-table">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Tên thuốc</th>
                  <th>Số lượng</th>
                  <th>Đơn giá</th>
                  <th>Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {examForm.CT_Thuoc && examForm.CT_Thuoc.length > 0 ? (
                  examForm.CT_Thuoc.map((medicine, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{medicine.TenThuoc}</td>
                      <td>{medicine.SoLuong}</td>
                      <td>{formatCurrency(medicine.GiaBan)}</td>
                      <td>{formatCurrency(medicine.ThanhTien)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center" }}>
                      Chưa có thuốc nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Total */}
        <div className="detail-total">
          <strong>Tổng tiền thuốc:</strong>
          <span className="total-amount">
            {formatCurrency(isEditing ? editData.TongTienThuoc : examForm.TongTienThuoc)}
          </span>
        </div>
      </div>

      <DeleteConfirmModal
        isOpen={deleteModal}
        title={`Xóa phiếu khám bệnh #${maPKB}`}
        message="Hành động này không thể hoàn tác. Bạn có chắc chắn muốn xóa?"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        isLoading={loading}
      />
    </div>
  );
};

export default ExamFormDetail;
