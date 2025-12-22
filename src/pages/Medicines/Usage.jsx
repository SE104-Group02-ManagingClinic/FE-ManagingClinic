import React, { useState, useEffect } from "react";
import { getAllUsages, createUsage, updateUsage, deleteUsage } from "../../api/usageApi";
import { useBottomSheet } from "../../contexts/BottomSheetContext";

const Usage = () => {
  const [usages, setUsages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { refreshTriggers, setBottomSheetState, setEditingUsage } = useBottomSheet();

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
      console.error("Error loading usages:", err);
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
    if (!window.confirm(`Bạn có chắc chắn muốn xóa cách dùng "${usage.TenCachDung}"?`)) {
      return;
    }

    try {
      setLoading(true);
      setError("");
      await deleteUsage(usage.MaCachDung);
      setSuccess(`Đã xóa cách dùng "${usage.TenCachDung}" thành công!`);
      await fetchUsages();
    } catch (err) {
      console.error("Error deleting usage:", err);
      setError(err.message || "Lỗi khi xóa cách dùng");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tab-content">
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

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
    </div>
  );
};

export default Usage;
