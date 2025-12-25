import React, { useState, useEffect } from "react";
import { getAllMedicines, deleteMedicine } from "../../api/medicineApi";
import SideSheet from "../SideSheet/SideSheet";
import { useBottomSheet } from "../../contexts/BottomSheetContext";
import { useToast } from "../../contexts/ToastContext";
import DeleteConfirmModal from "../../components/DeleteConfirmModal";

const MedicinesList = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, medicine: null });
  
  const { setBottomSheetState, refreshTriggers } = useBottomSheet();
  const { showSuccess, showError } = useToast();
  
  // SideSheet state for viewing details
  const [showSideSheet, setShowSideSheet] = useState(false);
  const [viewingMedicine, setViewingMedicine] = useState(null);

  // Load medicines on mount and on refresh
  useEffect(() => {
    fetchMedicines();
  }, [refreshTriggers.medicines]);

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      const data = await getAllMedicines();
      setMedicines(data);
      setError("");
    } catch (err) {
      showError(err.message || "Lỗi khi tải danh sách thuốc");
      setError(err.message || "Lỗi khi tải danh sách thuốc");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    setBottomSheetState(prev => ({ ...prev, medicinesForm: true }));
  };

  const handleViewDetail = (medicine) => {
    setViewingMedicine(medicine);
    setShowSideSheet(true);
  };

  const handleCloseSideSheet = () => {
    setShowSideSheet(false);
    setViewingMedicine(null);
  };

  const handleDelete = async (medicine) => {
    setDeleteModal({ isOpen: true, medicine });
  };

  const handleDeleteConfirm = async () => {
    const medicine = deleteModal.medicine;
    try {
      setLoading(true);
      setError("");
      await deleteMedicine(medicine.MaThuoc);
      showSuccess(`Đã xóa thuốc "${medicine.TenThuoc}" thành công!`);
      setDeleteModal({ isOpen: false, medicine: null });
      await fetchMedicines();
    } catch (err) {
      showError(err.message || "Lỗi khi xóa thuốc");
      setError(err.message || "Lỗi khi xóa thuốc");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, medicine: null });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount || 0);
  };

  return (
    <div className="tab-content">
      {error && <div className="alert alert-error">{error}</div>}

      {loading && !medicines.length ? (
        <div className="loading">Đang tải...</div>
      ) : (
        <div className="medicines-table-wrapper">
          <table className="medicines-table">
            <thead>
              <tr>
                <th>Mã thuốc</th>
                <th>Tên thuốc</th>
                <th>Đơn vị tính</th>
                <th>Cách dùng</th>
                <th>Số lượng tồn</th>
                <th>Giá bán</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {medicines.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center" }}>
                    Chưa có thuốc nào
                  </td>
                </tr>
              ) : (
                medicines.map((medicine) => (
                  <tr key={medicine.MaThuoc}>
                    <td onClick={() => handleViewDetail(medicine)} style={{ cursor: 'pointer' }}>{medicine.MaThuoc}</td>
                    <td onClick={() => handleViewDetail(medicine)} style={{ cursor: 'pointer' }}>{medicine.TenThuoc}</td>
                    <td onClick={() => handleViewDetail(medicine)} style={{ cursor: 'pointer' }}>{medicine.TenDVT || "N/A"}</td>
                    <td onClick={() => handleViewDetail(medicine)} style={{ cursor: 'pointer' }}>{medicine.TenCachDung || "N/A"}</td>
                    <td onClick={() => handleViewDetail(medicine)} style={{ cursor: 'pointer' }}>{medicine.SoLuongTon}</td>
                    <td onClick={() => handleViewDetail(medicine)} style={{ cursor: 'pointer' }}>{formatCurrency(medicine.GiaBan)}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-edit-small"
                          onClick={() => handleOpenModal()}
                        >
                          Sửa
                        </button>
                        <button
                          className="btn-delete-small"
                          onClick={() => handleDelete(medicine)}
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* SideSheet for View Details */}
      <SideSheet isOpen={showSideSheet} onClose={handleCloseSideSheet}>
        {viewingMedicine && (
          <div className="medicine-detail-container">
            <div className="medicine-detail-header">
              <h3>Chi tiết thuốc</h3>
              <button className="btn-close" onClick={handleCloseSideSheet}>
                ×
              </button>
            </div>

            <div className="medicine-detail-body">
              <div className="detail-row">
                <span className="detail-label">Mã thuốc:</span>
                <span className="detail-value">{viewingMedicine.MaThuoc}</span>
              </div>

              <div className="detail-row">
                <span className="detail-label">Tên thuốc:</span>
                <span className="detail-value">{viewingMedicine.TenThuoc}</span>
              </div>

              <div className="detail-row">
                <span className="detail-label">Đơn vị tính:</span>
                <span className="detail-value">{viewingMedicine.TenDVT || "N/A"}</span>
              </div>

              <div className="detail-row">
                <span className="detail-label">Cách dùng:</span>
                <span className="detail-value">{viewingMedicine.TenCachDung || "N/A"}</span>
              </div>

              <div className="detail-row">
                <span className="detail-label">Số lượng tồn:</span>
                <span className="detail-value">{viewingMedicine.SoLuongTon}</span>
              </div>

              <div className="detail-row">
                <span className="detail-label">Giá bán:</span>
                <span className="detail-value">{formatCurrency(viewingMedicine.GiaBan)}</span>
              </div>

              {viewingMedicine.CongDung && (
                <div className="detail-row full-width">
                  <span className="detail-label">Công dụng:</span>
                  <span className="detail-value">{viewingMedicine.CongDung}</span>
                </div>
              )}

              {viewingMedicine.TacDungPhu && (
                <div className="detail-row full-width">
                  <span className="detail-label">Tác dụng phụ:</span>
                  <span className="detail-value">{viewingMedicine.TacDungPhu}</span>
                </div>
              )}

              <div className="detail-actions">
                <button 
                  className="btn-edit" 
                  onClick={() => {
                    handleCloseSideSheet();
                    handleOpenModal();
                  }}
                >
                  Chỉnh sửa
                </button>
                <button 
                  className="btn-delete" 
                  onClick={() => {
                    handleCloseSideSheet();
                    handleDelete(viewingMedicine);
                  }}
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>
        )}
      </SideSheet>

      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        title={`Xóa thuốc "${deleteModal.medicine?.TenThuoc || ""}"`}
        message="Hành động này không thể hoàn tác. Bạn có chắc chắn muốn xóa?"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        isLoading={loading}
      />
    </div>
  );
};

export default MedicinesList;
