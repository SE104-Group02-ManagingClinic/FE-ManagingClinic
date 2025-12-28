import React, { useState, useEffect } from "react";
import { useToast } from "../../contexts/ToastContext";
import { getAllGroupUsers, createGroupUser, deleteGroupUser } from "../../api/groupUserApi";

const GroupManagementTab = () => {
  const { showSuccess, showError } = useToast();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [createForm, setCreateForm] = useState({
    TenNhom: "",
  });

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const data = await getAllGroupUsers();
      setGroups(data);
    } catch (err) {
      showError(err.message || "Lỗi khi tải danh sách nhóm");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!createForm.TenNhom) {
      showError("Vui lòng nhập tên nhóm");
      return;
    }

    try {
      setLoading(true);
      await createGroupUser(createForm);
      showSuccess(`Tạo nhóm "${createForm.TenNhom}" thành công!`);
      setCreateForm({ TenNhom: "" });
      fetchGroups(); // Refresh list
    } catch (err) {
      showError(err.message || "Lỗi khi tạo nhóm");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGroup = async (group) => {
    if (group.MaNhom === "GR001") {
      showError("Không thể xóa nhóm Admin!");
      return;
    }

    if (!window.confirm(`Bạn có chắc chắn muốn xóa nhóm "${group.TenNhom}"?`)) {
      return;
    }

    try {
      setLoading(true);
      await deleteGroupUser(group.MaNhom);
      showSuccess(`Xóa nhóm "${group.TenNhom}" thành công!`);
      fetchGroups(); // Refresh list
    } catch (err) {
      showError(err.message || "Lỗi khi xóa nhóm");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="group-management-tab">
      <div className="tab-section">
        <h3>➕ Tạo nhóm người dùng mới</h3>
        <div className="info-box">
          <p>📝 Tạo nhóm người dùng mới. Sau khi tạo, bạn có thể phân quyền cho nhóm ở tab "Phân quyền".</p>
        </div>
        <form onSubmit={handleCreateGroup}>
          <div className="form-group">
            <label>Tên nhóm *</label>
            <input
              type="text"
              value={createForm.TenNhom}
              onChange={(e) => setCreateForm({ TenNhom: e.target.value })}
              placeholder="Nhập tên nhóm (VD: Bác sĩ, Y tá, Lễ tân...)"
              disabled={loading}
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Đang tạo..." : "✅ Tạo nhóm"}
            </button>
          </div>
        </form>
      </div>

      <div className="divider"></div>

      <div className="tab-section">
        <h3>📦 Danh sách nhóm người dùng</h3>
        {loading ? (
          <div className="loading-spinner">Đang tải...</div>
        ) : groups.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📭</div>
            <div className="empty-state-text">Chưa có nhóm nào</div>
          </div>
        ) : (
          <ul className="list-group">
            {groups.map((group) => (
              <li key={group.MaNhom} className="list-item">
                <div className="list-item-info">
                  <h4>{group.TenNhom}</h4>
                  <p>
                    Mã nhóm: <strong>{group.MaNhom}</strong>
                    {group.MaNhom === "GR001" && (
                      <span className="badge badge-danger" style={{ marginLeft: "10px" }}>
                        Admin
                      </span>
                    )}
                  </p>
                </div>
                <div className="list-item-actions">
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDeleteGroup(group)}
                    disabled={loading || group.MaNhom === "GR001"}
                    title={group.MaNhom === "GR001" ? "Không thể xóa nhóm Admin" : "Xóa nhóm"}
                  >
                    🗑️ Xóa
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default GroupManagementTab;
