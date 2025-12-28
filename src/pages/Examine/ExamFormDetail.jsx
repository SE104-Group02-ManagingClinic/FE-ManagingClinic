import React, { useState, useEffect } from "react";
import "./ExamFormDetail.css";
import { getExamFormById, updateMedicalExamForm, deleteMedicalExamForm } from "../../api/medicalExamFormApi";
import { getAllDiseases } from "../../api/diseaseApi";
import { getAllMedicines } from "../../api/medicineApi";
import { createInvoice, getInvoicesByDate, updateInvoice, deleteInvoice } from "../../api/invoiceApi";
import { getThamSo } from "../../api/argumentApi";
import { useToast } from "../../contexts/ToastContext";
import DeleteConfirmModal from "../../components/DeleteConfirmModal";

const ExamFormDetail = ({ maPKB, onUpdate, onDelete, onClose }) => {
  const [examForm, setExamForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const { showSuccess, showError } = useToast();

  // Invoice state
  const [invoice, setInvoice] = useState(null);
  const [invoiceLoading, setInvoiceLoading] = useState(false);
  const [tienKham, setTienKham] = useState(0);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [deleteInvoiceModal, setDeleteInvoiceModal] = useState(false);

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

  // Load exam form details and invoice
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

        // Load invoice for this exam form
        await fetchInvoice(data.NgayKham);
        
        // Load TienKham from system parameters
        try {
          const thamSo = await getThamSo();
          setTienKham(thamSo.TienKham || 0);
        } catch (err) {
          console.log("Không thể tải tiền khám từ hệ thống");
        }
      } catch (err) {
        showError(err.message || "Lỗi khi tải thông tin phiếu khám");
        setError(err.message || "Lỗi khi tải thông tin phiếu khám");
      } finally {
        setLoading(false);
      }
    };

    // Fetch invoice for this exam form
    const fetchInvoice = async (ngayKham) => {
      try {
        // Try multiple dates to find the invoice
        const datesToCheck = [
          ngayKham,
          new Date().toISOString().split('T')[0],
        ];
        
        for (const date of datesToCheck) {
          if (!date) continue;
          try {
            const invoices = await getInvoicesByDate(date);
            const foundInvoice = invoices.find(inv => inv.MaPKB === maPKB);
            if (foundInvoice) {
              setInvoice(foundInvoice);
              return;
            }
          } catch (e) {
            // Continue checking other dates
          }
        }
        setInvoice(null);
      } catch (err) {
        setInvoice(null);
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

  // ========== INVOICE FUNCTIONS ==========
  
  // Create invoice (payment)
  const handleCreateInvoice = async () => {
    try {
      setInvoiceLoading(true);
      
      const today = new Date().toISOString().split('T')[0];
      const tienThuoc = examForm.TongTienThuoc || 0;
      
      const invoiceData = {
        MaPKB: maPKB,
        NgayThanhToan: today,
        TienKham: tienKham,
        TienThuoc: tienThuoc,
      };
      
      const result = await createInvoice(invoiceData);
      showSuccess(`Thanh toán thành công! Mã hóa đơn: ${result.MaHD}, Tổng tiền: ${formatCurrency(result.TongTien)}`);
      
      // Reload invoice
      const invoices = await getInvoicesByDate(today);
      const foundInvoice = invoices.find(inv => inv.MaPKB === maPKB);
      if (foundInvoice) {
        setInvoice(foundInvoice);
      }
      
      setShowInvoiceModal(false);
    } catch (err) {
      showError(err.message || "Lỗi khi tạo hóa đơn thanh toán");
    } finally {
      setInvoiceLoading(false);
    }
  };

  // Update invoice
  const handleUpdateInvoice = async () => {
    if (!invoice) return;
    
    try {
      setInvoiceLoading(true);
      
      const tienThuoc = examForm.TongTienThuoc || 0;
      
      const invoiceData = {
        TienKham: tienKham,
        TienThuoc: tienThuoc,
      };
      
      const result = await updateInvoice(invoice.MaHD, invoiceData);
      showSuccess(`Cập nhật hóa đơn thành công! Tổng tiền: ${formatCurrency(result.result.TongTien)}`);
      
      // Update local invoice state
      setInvoice({
        ...invoice,
        TienKham: result.result.TienKham,
        TienThuoc: result.result.TienThuoc,
        TongTien: result.result.TongTien,
      });
    } catch (err) {
      showError(err.message || "Lỗi khi cập nhật hóa đơn");
    } finally {
      setInvoiceLoading(false);
    }
  };

  // Delete invoice
  const handleDeleteInvoice = async () => {
    setDeleteInvoiceModal(true);
  };

  const handleDeleteInvoiceConfirm = async () => {
    if (!invoice) return;
    
    try {
      setInvoiceLoading(true);
      await deleteInvoice(invoice.MaHD);
      showSuccess("Đã xóa hóa đơn thanh toán thành công!");
      setInvoice(null);
      setDeleteInvoiceModal(false);
    } catch (err) {
      showError(err.message || "Lỗi khi xóa hóa đơn");
    } finally {
      setInvoiceLoading(false);
    }
  };

  const handleDeleteInvoiceCancel = () => {
    setDeleteInvoiceModal(false);
  };

  // Calculate total payment
  const calculateTotalPayment = () => {
    const tienThuoc = examForm?.TongTienThuoc || 0;
    return tienKham + tienThuoc;
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

        {/* Invoice/Payment Section */}
        <div className="detail-section invoice-section">
          <div className="section-header">
            <h3>💳 Thanh toán</h3>
            {invoice && !isEditing && (
              <div className="invoice-actions">
                <button 
                  className="btn-update-invoice" 
                  onClick={handleUpdateInvoice}
                  disabled={invoiceLoading}
                >
                  Cập nhật
                </button>
                <button 
                  className="btn-delete-invoice" 
                  onClick={handleDeleteInvoice}
                  disabled={invoiceLoading}
                >
                  Xóa hóa đơn
                </button>
              </div>
            )}
          </div>

          {invoice ? (
            // Display existing invoice
            <div className="invoice-info">
              <div className="invoice-badge paid">
                <span className="badge-icon">✓</span>
                Đã thanh toán
              </div>
              <div className="invoice-details">
                <div className="invoice-row">
                  <span className="invoice-label">Mã hóa đơn:</span>
                  <span className="invoice-value">{invoice.MaHD}</span>
                </div>
                <div className="invoice-row">
                  <span className="invoice-label">Ngày thanh toán:</span>
                  <span className="invoice-value">{formatDate(invoice.NgayThanhToan)}</span>
                </div>
                <div className="invoice-row">
                  <span className="invoice-label">Tiền khám:</span>
                  <span className="invoice-value">{formatCurrency(invoice.TienKham)}</span>
                </div>
                <div className="invoice-row">
                  <span className="invoice-label">Tiền thuốc:</span>
                  <span className="invoice-value">{formatCurrency(invoice.TienThuoc)}</span>
                </div>
                <div className="invoice-row total">
                  <span className="invoice-label">Tổng tiền:</span>
                  <span className="invoice-value total-value">{formatCurrency(invoice.TongTien)}</span>
                </div>
              </div>
            </div>
          ) : (
            // Show payment button if not paid
            <div className="invoice-unpaid">
              <div className="invoice-badge unpaid">
                <span className="badge-icon">⏳</span>
                Chưa thanh toán
              </div>
              <div className="payment-preview">
                <div className="payment-row">
                  <span>Tiền khám:</span>
                  <span>{formatCurrency(tienKham)}</span>
                </div>
                <div className="payment-row">
                  <span>Tiền thuốc:</span>
                  <span>{formatCurrency(examForm.TongTienThuoc || 0)}</span>
                </div>
                <div className="payment-row total">
                  <span>Tổng cộng:</span>
                  <span className="total-value">{formatCurrency(calculateTotalPayment())}</span>
                </div>
              </div>
              <button 
                className="btn-payment" 
                onClick={() => setShowInvoiceModal(true)}
                disabled={isEditing || invoiceLoading}
              >
                {invoiceLoading ? "Đang xử lý..." : "💳 Thanh toán ngay"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Payment Confirmation Modal */}
      {showInvoiceModal && (
        <div className="modal-overlay">
          <div className="modal-content invoice-modal">
            <h3>Xác nhận thanh toán</h3>
            <div className="modal-body">
              <p>Bạn đang tạo hóa đơn thanh toán cho phiếu khám <strong>{maPKB}</strong></p>
              <div className="payment-summary">
                <div className="summary-row">
                  <span>Tiền khám:</span>
                  <span>{formatCurrency(tienKham)}</span>
                </div>
                <div className="summary-row">
                  <span>Tiền thuốc:</span>
                  <span>{formatCurrency(examForm.TongTienThuoc || 0)}</span>
                </div>
                <div className="summary-row total">
                  <span>Tổng thanh toán:</span>
                  <span className="total-value">{formatCurrency(calculateTotalPayment())}</span>
                </div>
              </div>
            </div>
            <div className="modal-actions">
              <button 
                className="btn-confirm-payment" 
                onClick={handleCreateInvoice}
                disabled={invoiceLoading}
              >
                {invoiceLoading ? "Đang xử lý..." : "Xác nhận thanh toán"}
              </button>
              <button 
                className="btn-cancel-modal" 
                onClick={() => setShowInvoiceModal(false)}
                disabled={invoiceLoading}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      <DeleteConfirmModal
        isOpen={deleteModal}
        title={`Xóa phiếu khám bệnh #${maPKB}`}
        message="Hành động này không thể hoàn tác. Bạn có chắc chắn muốn xóa?"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        isLoading={loading}
      />

      <DeleteConfirmModal
        isOpen={deleteInvoiceModal}
        title={`Xóa hóa đơn #${invoice?.MaHD}`}
        message="Bạn có chắc chắn muốn xóa hóa đơn thanh toán này?"
        onConfirm={handleDeleteInvoiceConfirm}
        onCancel={handleDeleteInvoiceCancel}
        isLoading={invoiceLoading}
      />
    </div>
  );
};

export default ExamFormDetail;
