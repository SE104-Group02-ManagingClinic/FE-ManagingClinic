import React, { useState, useEffect } from "react";
import { getAllUsages, createUsage, updateUsage, deleteUsage } from "../../api/usageApi";
import { useBottomSheet } from "../../contexts/BottomSheetContext";
import { useToast } from "../../contexts/ToastContext";
import DeleteConfirmModal from "../../components/DeleteConfirmModal";

const Usage = () => {
  const [usages, setUsages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, usage: null });
  const { refreshTriggers, setBottomSheetState, setEditingUsage } = useBottomSheet();
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    fetchUsages();
  }, [refreshTriggers.medicines]);

  const fetchUsages = async () => {
    try {
      setLoading(true);
      const data = await getAllUsages();
      setUsages(data);
      setError("");
    } catch (err) {
      showError(err.message || "Lỗi khi tải danh sách cách dùng");
      setError(err.message || "Lỗi khi tải danh sách cách dùng");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (usage) => {
    setEditingUsage(usage);
    setBottomSheetState(prev => ({ ...prev, usageForm: true }));
  };

  const handleDelete = async (usage) => {
    setDeleteModal({ isOpen: true, usage });
  };

  const handleDeleteConfirm = async () => {
    const usage = deleteModal.usage;
    try {
      setLoading(true);
      setError("");
      await deleteUsage(usage.MaCachDung);
      showSuccess(`Đã xóa cách dùng "${usage.TenCachDung}" thành công!`);
      setDeleteModal({ isOpen: false, usage: null });
      await fetchUsages();
    } catch (err) {
      showError(err.message || "Lỗi khi xóa cách dùng");
      setError(err.message || "Lỗi khi xóa cách dùng");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, usage: null });
  };

  return (
    <div className="tab-content">
      {error && <div className="alert alert-error">{error}</div>}

      {loading && !usages.length ? (
        <div className="loading">Đang tải...</div>
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Mã cách dùng</th>
                <th>Tên cách dùng</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {usages.length === 0 ? (
                <tr>
                  <td colSpan="3" style={{ textAlign: "center" }}>
                    Chưa có cách dùng nào
                  </td>
                </tr>
              ) : (
                usages.map((usage) => (
                  <tr key={usage.MaCachDung}>
                    <td>{usage.MaCachDung}</td>
                    <td>{usage.TenCachDung}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-edit-small"
                          onClick={() => handleEdit(usage)}
                        >
                          Sửa
                        </button>
                        <button
                          className="btn-delete-small"
                          onClick={() => handleDelete(usage)}
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
        title={`Xóa cách dùng "${deleteModal.usage?.TenCachDung || ""}"`}
        message="Hành động này không thể hoàn tác. Bạn có chắc chắn muốn xóa?"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        isLoading={loading}
      />
    </div>
  );
};

export default Usage;
