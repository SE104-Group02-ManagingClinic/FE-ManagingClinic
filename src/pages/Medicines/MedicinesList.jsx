import React, { useState, useEffect } from "react";
import { getAllMedicines, deleteMedicine, searchMedicines } from "../../api/medicineApi";
import { deleteMedicineImportByBatchId } from "../../api/medicineImportApi";
import { useBottomSheet } from "../../contexts/BottomSheetContext";
import { useToast } from "../../contexts/ToastContext";
import DeleteConfirmModal from "../../components/DeleteConfirmModal";
import PermissionGuard from "../../components/PermissionGuard";
import BottomSheet from "../BottomSheet/BottomSheet";

const MedicinesList = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, medicine: null });
  const [deleteBatchModal, setDeleteBatchModal] = useState({ isOpen: false, batch: null, medicineName: "" });
  const [searchTenThuoc, setSearchTenThuoc] = useState("");
  const [searchCongDung, setSearchCongDung] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  
  const { setBottomSheetState, refreshTriggers, setEditingMedicine } = useBottomSheet();
  const { showSuccess, showError } = useToast();
  
  // BottomSheet state for viewing details
  const [showMedicineDetail, setShowMedicineDetail] = useState(false);
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

  const handleEditMedicine = (medicine) => {
    setEditingMedicine(medicine);
    setBottomSheetState(prev => ({ ...prev, medicinesForm: true }));
  };

  const handleViewDetail = (medicine) => {
    setViewingMedicine(medicine);
    setShowMedicineDetail(true);
  };

  const handleCloseMedicineDetail = () => {
    setShowMedicineDetail(false);
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

  const handleDeleteBatch = (batch, medicineName) => {
    setDeleteBatchModal({ isOpen: true, batch, medicineName });
  };

  const handleDeleteBatchConfirm = async () => {
    const batch = deleteBatchModal.batch;
    try {
      setLoading(true);
      setError("");
      await deleteMedicineImportByBatchId(batch.MaLo);
      showSuccess(`Đã xóa lô thuốc "${batch.MaLo}" thành công!`);
      setDeleteBatchModal({ isOpen: false, batch: null, medicineName: "" });
      await fetchMedicines();
    } catch (err) {
      showError(err.message || "Lỗi khi xóa lô thuốc");
      setError(err.message || "Lỗi khi xóa lô thuốc");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBatchCancel = () => {
    setDeleteBatchModal({ isOpen: false, batch: null, medicineName: "" });
  };

  const handleSearch = async () => {
    if (!searchTenThuoc.trim() && !searchCongDung.trim()) {
      showError("Vui lòng nhập tên thuốc hoặc công dụng để tìm kiếm");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setIsSearching(true);
      const data = await searchMedicines(searchTenThuoc, searchCongDung);
      setMedicines(data);
    } catch (err) {
      showError(err.message || "Lỗi khi tìm kiếm thuốc");
      setError(err.message || "Lỗi khi tìm kiếm thuốc");
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = async () => {
    setSearchTenThuoc("");
    setSearchCongDung("");
    setIsSearching(false);
    await fetchMedicines();
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount || 0);
  };

  return (
    <PermissionGuard 
      feature="medicine-list"
      fallback={
        <div className="tab-content">
          <div className="alert alert-warning">
            Bạn không có quyền xem danh sách thuốc
          </div>
        </div>
      }
    >
      <div className="tab-content" data-feature="medicine-list">
        {error && <div className="alert alert-error">{error}</div>}

        {/* Search Section */}
        <div className="medicine-search-container">
          <div className="search-form">
            <div className="search-input-group">
              <input
                type="text"
                placeholder="Nhập tên thuốc..."
                value={searchTenThuoc}
                onChange={(e) => setSearchTenThuoc(e.target.value)}
                onKeyPress={handleKeyPress}
                className="search-input"
              />
            </div>
            <div className="search-input-group">
              <input
                type="text"
                placeholder="Nhập công dụng..."
                value={searchCongDung}
                onChange={(e) => setSearchCongDung(e.target.value)}
                onKeyPress={handleKeyPress}
                className="search-input"
              />
            </div>
            <button
              className="btn-search"
              onClick={handleSearch}
              disabled={loading}
            >
              Tìm kiếm
            </button>
            {isSearching && (
              <button
                className="btn-clear"
                onClick={handleClearSearch}
                disabled={loading}
              >
                Xóa tìm kiếm
              </button>
            )}
          </div>
        </div>

        {loading && !medicines.length ? (
          <div className="loading">Đang tải...</div>
        ) : (
          <div className="medicines-table-wrapper" style={{ maxHeight: "600px", overflowY: "auto" }}>
            <table className="medicines-table">
              <thead>
                <tr>
                  <th>Mã thuốc</th>
                  <th>Tên thuốc</th>
                  <th>Công dụng</th>
                  <th>Đơn vị tính</th>
                  <th>Cách dùng</th>
                  <th>Tác dụng phụ</th>
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
                      <td onClick={() => handleViewDetail(medicine)} style={{ cursor: 'pointer' }} title={medicine.CongDung || "N/A"}>{medicine.CongDung ? medicine.CongDung.substring(0, 30) + (medicine.CongDung.length > 30 ? "..." : "") : "N/A"}</td>
                      <td onClick={() => handleViewDetail(medicine)} style={{ cursor: 'pointer' }}>{medicine.TenDVT || "N/A"}</td>
                      <td onClick={() => handleViewDetail(medicine)} style={{ cursor: 'pointer' }}>{medicine.TenCachDung || "N/A"}</td>
                      <td onClick={() => handleViewDetail(medicine)} style={{ cursor: 'pointer' }} title={medicine.TacDungPhu || "N/A"}>{medicine.TacDungPhu ? medicine.TacDungPhu.substring(0, 30) + (medicine.TacDungPhu.length > 30 ? "..." : "") : "N/A"}</td>
                      <td>
                        <div className="action-buttons">
                          <PermissionGuard feature="medicine-edit" hide>
                            <button
                              className="btn-edit-small"
                              onClick={() => handleEditMedicine(medicine)}
                              data-feature="medicine-edit"
                            >
                              Sửa
                            </button>
                          </PermissionGuard>
                          <PermissionGuard feature="medicine-delete" hide>
                            <button
                              className="btn-delete-small"
                              onClick={() => handleDelete(medicine)}
                              data-feature="medicine-delete"
                            >
                              Xóa
                            </button>
                          </PermissionGuard>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* BottomSheet for View Details */}
        <BottomSheet isOpen={showMedicineDetail} onClose={handleCloseMedicineDetail}>
          {viewingMedicine && (
            <div className="medicine-detail-content">
              <div className="detail-header">
                <h3>Chi tiết loại thuốc</h3>
              </div>

              <div className="detail-body" style ={{ maxHeight: "75vh", overflowY: "auto" }}>
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

                {viewingMedicine.LoThuoc && viewingMedicine.LoThuoc.length > 0 && (
                  <div className="detail-row full-width batches-section">
                    <span className="detail-label">📦 Danh sách các lô thuốc:</span>
                    <div className="batches-container">
                      {viewingMedicine.LoThuoc.map((batch) => (
                        <div key={batch.MaLo} className="batch-card">
                          <div className="batch-card-header">
                            <span className="batch-code">Lô: <strong>{batch.MaLo}</strong></span>
                            <PermissionGuard feature="medicine-import" hide>
                              <button
                                className="btn-delete-batch"
                                onClick={() => handleDeleteBatch(batch, viewingMedicine.TenThuoc)}
                                title="Xóa phiếu nhập thuốc"
                                data-feature="medicine-import"
                              >
                                ✕
                              </button>
                            </PermissionGuard>
                          </div>
                          <div className="batch-card-body">
                            <div className="batch-info-item">
                              <span className="batch-info-label">Số lượng tồn:</span>
                              <span className="batch-info-value">{batch.SoLuongTon}</span>
                            </div>
                            <div className="batch-info-item">
                              <span className="batch-info-label">Giá bán:</span>
                              <span className="batch-info-value">{formatCurrency(batch.GiaBan)}</span>
                            </div>
                            <div className="batch-info-item">
                              <span className="batch-info-label">Hạn sử dụng:</span>
                              <span className="batch-info-value">{new Date(batch.HanSuDung).toLocaleDateString('vi-VN')}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(!viewingMedicine.LoThuoc || viewingMedicine.LoThuoc.length === 0) && (
                  <div className="detail-row full-width">
                    <span className="detail-label">📦 Lô thuốc:</span>
                    <span className="detail-value">Chưa có lô thuốc nào</span>
                  </div>
                )}

                <div className="detail-actions">
                  <PermissionGuard feature="medicine-edit" hide>
                    <button 
                      className="btn-edit" 
                      onClick={() => {
                        handleCloseMedicineDetail();
                        handleEditMedicine(viewingMedicine);
                      }}
                      data-feature="medicine-edit"
                    >
                      Chỉnh sửa
                    </button>
                  </PermissionGuard>
                  <PermissionGuard feature="medicine-delete" hide>
                    <button 
                      className="btn-delete" 
                      onClick={() => {
                        handleCloseMedicineDetail();
                        handleDelete(viewingMedicine);
                      }}
                      data-feature="medicine-delete"
                    >
                      Xóa
                    </button>
                  </PermissionGuard>
                </div>
              </div>
            </div>
          )}
        </BottomSheet>

        <DeleteConfirmModal
          isOpen={deleteModal.isOpen}
          title={`Xóa thuốc "${deleteModal.medicine?.TenThuoc || ""}"`}
          message="Hành động này không thể hoàn tác. Bạn có chắc chắn muốn xóa?"
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
          isLoading={loading}
        />

        <DeleteConfirmModal
          isOpen={deleteBatchModal.isOpen}
          title={`Xóa phiếu nhập thuốc - Lô ${deleteBatchModal.batch?.MaLo || ""}`}
          message={`Bạn có chắc chắn muốn xóa lô thuốc này? Hành động này không thể hoàn tác.\n\nThuốc: ${deleteBatchModal.medicineName}`}
          onConfirm={handleDeleteBatchConfirm}
          onCancel={handleDeleteBatchCancel}
          isLoading={loading}
        />
      </div>
    </PermissionGuard>
  );
};

export default MedicinesList;
