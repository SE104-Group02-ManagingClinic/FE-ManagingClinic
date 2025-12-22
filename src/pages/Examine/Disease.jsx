import React, { useState, useEffect } from "react";
import { getAllDiseases, deleteDisease } from "../../api/diseaseApi";
import { useBottomSheet } from "../../contexts/BottomSheetContext";

const Disease = () => {
  const [diseases, setDiseases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { refreshTriggers, setBottomSheetState, setEditingDisease } = useBottomSheet();

  useEffect(() => {
    fetchDiseases();
  }, [refreshTriggers.diseases]);

  const fetchDiseases = async () => {
    try {
      setLoading(true);
      const data = await getAllDiseases();
      setDiseases(data);
      setError("");
    } catch (err) {
      console.error("Error loading diseases:", err);
      setError(err.message || "Lỗi khi tải danh sách bệnh");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (disease) => {
    setEditingDisease(disease);
    setBottomSheetState(prev => ({ ...prev, diseaseForm: true }));
  };

  const handleDelete = async (disease) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa bệnh "${disease.TenBenh}"?`)) {
      return;
    }

    try {
      setLoading(true);
      setError("");
      await deleteDisease(disease.MaBenh);
      setSuccess(`Đã xóa bệnh "${disease.TenBenh}" thành công!`);
      await fetchDiseases();
    } catch (err) {
      console.error("Error deleting disease:", err);
      setError(err.message || "Lỗi khi xóa bệnh");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tab-content">
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {loading && !diseases.length ? (
        <div className="loading">Đang tải...</div>
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Mã bệnh</th>
                <th>Tên bệnh</th>
                <th>Triệu chứng</th>
                <th>Nguyên nhân</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {diseases.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center" }}>
                    Chưa có bệnh nào
                  </td>
                </tr>
              ) : (
                diseases.map((disease) => (
                  <tr key={disease.MaBenh}>
                    <td>{disease.MaBenh}</td>
                    <td>{disease.TenBenh}</td>
                    <td>{disease.TrieuChung || "N/A"}</td>
                    <td>{disease.NguyenNhan || "N/A"}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-edit-small"
                          onClick={() => handleEdit(disease)}
                        >
                          Sửa
                        </button>
                        <button
                          className="btn-delete-small"
                          onClick={() => handleDelete(disease)}
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

export default Disease;
