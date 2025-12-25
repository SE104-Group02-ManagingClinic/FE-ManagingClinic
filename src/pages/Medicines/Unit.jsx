import React, { useState, useEffect } from "react";
import { getAllUnits, createUnit, updateUnit, deleteUnit } from "../../api/unitApi";
import { useBottomSheet } from "../../contexts/BottomSheetContext";
import { useToast } from "../../contexts/ToastContext";
import DeleteConfirmModal from "../../components/DeleteConfirmModal";

const Unit = () => {
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, unit: null });
  const { refreshTriggers, setBottomSheetState, setEditingUnit } = useBottomSheet();
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    fetchUnits();
  }, [refreshTriggers.medicines]);

  const fetchUnits = async () => {
    try {
      setLoading(true);
      const data = await getAllUnits();
      setUnits(data);
      setError("");
    } catch (err) {
      showError(err.message || "Lỗi khi tải danh sách đơn vị tính");
      setError(err.message || "Lỗi khi tải danh sách đơn vị tính");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (unit) => {
    setEditingUnit(unit);
    setBottomSheetState(prev => ({ ...prev, unitForm: true }));
  };

  const handleDelete = async (unit) => {
    setDeleteModal({ isOpen: true, unit });
  };

  const handleDeleteConfirm = async () => {
    const unit = deleteModal.unit;
    try {
      setLoading(true);
      setError("");
      await deleteUnit(unit.MaDVT);
      showSuccess(`Đã xóa đơn vị tính "${unit.TenDVT}" thành công!`);
      setDeleteModal({ isOpen: false, unit: null });
      await fetchUnits();
    } catch (err) {
      showError(err.message || "Lỗi khi xóa đơn vị tính");
      setError(err.message || "Lỗi khi xóa đơn vị tính");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, unit: null });
  };

  return (
    <div className="tab-content">
      {error && <div className="alert alert-error">{error}</div>}

      {loading && !units.length ? (
        <div className="loading">Đang tải...</div>
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Mã đơn vị tính</th>
                <th>Tên đơn vị tính</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {units.length === 0 ? (
                <tr>
                  <td colSpan="3" style={{ textAlign: "center" }}>
                    Chưa có đơn vị tính nào
                  </td>
                </tr>
              ) : (
                units.map((unit) => (
                  <tr key={unit.MaDVT}>
                    <td>{unit.MaDVT}</td>
                    <td>{unit.TenDVT}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-edit-small"
                          onClick={() => handleEdit(unit)}
                        >
                          Sửa
                        </button>
                        <button
                          className="btn-delete-small"
                          onClick={() => handleDelete(unit)}
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

      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        title={`Xóa đơn vị tính "${deleteModal.unit?.TenDVT || ""}"`}
        message="Hành động này không thể hoàn tác. Bạn có chắc chắn muốn xóa?"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        isLoading={loading}
      />
    </div>
  );
};

export default Unit;
