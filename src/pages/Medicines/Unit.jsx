import React, { useState, useEffect } from "react";
import { getAllUnits, createUnit, updateUnit, deleteUnit } from "../../api/unitApi";
import { useBottomSheet } from "../../contexts/BottomSheetContext";

const Unit = () => {
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { refreshTriggers, setBottomSheetState, setEditingUnit } = useBottomSheet();

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
      console.error("Error loading units:", err);
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
    if (!window.confirm(`Bạn có chắc chắn muốn xóa đơn vị tính "${unit.TenDVT}"?`)) {
      return;
    }

    try {
      setLoading(true);
      setError("");
      await deleteUnit(unit.MaDVT);
      setSuccess(`Đã xóa đơn vị tính "${unit.TenDVT}" thành công!`);
      await fetchUnits();
    } catch (err) {
      console.error("Error deleting unit:", err);
      setError(err.message || "Lỗi khi xóa đơn vị tính");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tab-content">
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

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
    </div>
  );
};

export default Unit;
