import React, { useState, useEffect } from "react";
import { getAllDiseases, deleteDisease } from "../../api/diseaseApi";
import { useBottomSheet } from "../../contexts/BottomSheetContext";
import { useToast } from "../../contexts/ToastContext";
import DeleteConfirmModal from "../../components/DeleteConfirmModal";

const Disease = () => {
  const [diseases, setDiseases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, disease: null });
  const { refreshTriggers, setBottomSheetState, setEditingDisease } = useBottomSheet();
  const { showSuccess, showError } = useToast();

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
      showError(err.message || "Lỗi khi tải danh sách bệnh");
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
    setDeleteModal({ isOpen: true, disease });
  };

  const handleDeleteConfirm = async () => {
    const disease = deleteModal.disease;
    try {
      setLoading(true);
      setError("");
      await deleteDisease(disease.MaBenh);
      showSuccess(`Đã xóa bệnh "${disease.TenBenh}" thành công!`);
      setDeleteModal({ isOpen: false, disease: null });
      await fetchDiseases();
    } catch (err) {
      showError(err.message || "Lỗi khi xóa bệnh");
      setError(err.message || "Lỗi khi xóa bệnh");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, disease: null });
  };

  return (
    <div className="tab-content">
      {error && <div className="alert alert-error">{error}</div>}

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

      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        title={`Xóa bệnh "${deleteModal.disease?.TenBenh || ""}"`}
        message="Hành động này không thể hoàn tác. Bạn có chắc chắn muốn xóa?"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        isLoading={loading}
      />
    </div>
  );
};

export default Disease;
