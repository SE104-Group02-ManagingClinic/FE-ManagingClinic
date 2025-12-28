import React, { useState, useEffect } from "react";
import { useToast } from "../../contexts/ToastContext";
import { getAllGroupUsers } from "../../api/groupUserApi";
import { getFunctionNameList } from "../../api/functionApi";
import { getFunctionsOfGroupUser, updatePermission } from "../../api/permissionApi";

const PermissionManagementTab = () => {
  const { showSuccess, showError } = useToast();
  const [groups, setGroups] = useState([]);
  const [allFunctions, setAllFunctions] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [groupFunctions, setGroupFunctions] = useState([]);
  const [selectedFunctions, setSelectedFunctions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchGroups();
    fetchAllFunctions();
  }, []);

  useEffect(() => {
    if (selectedGroup) {
      fetchGroupFunctions(selectedGroup);
    } else {
      setGroupFunctions([]);
      setSelectedFunctions([]);
    }
  }, [selectedGroup]);

  const fetchGroups = async () => {
    try {
      const data = await getAllGroupUsers();
      setGroups(data);
    } catch (err) {
      showError(err.message || "Lỗi khi tải danh sách nhóm");
    }
  };

  const fetchAllFunctions = async () => {
    try {
      const data = await getFunctionNameList();
      setAllFunctions(data);
    } catch (err) {
      showError(err.message || "Lỗi khi tải danh sách chức năng");
    }
  };

  const fetchGroupFunctions = async (maNhom) => {
    try {
      setLoading(true);
      const data = await getFunctionsOfGroupUser(maNhom);
      setGroupFunctions(data);
      // Set selected checkboxes
      const functionCodes = data.map((f) => f.MaChucNang);
      setSelectedFunctions(functionCodes);
    } catch (err) {
      // Nhóm chưa có phân quyền
      setGroupFunctions([]);
      setSelectedFunctions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFunctionToggle = (maChucNang) => {
    setSelectedFunctions((prev) => {
      if (prev.includes(maChucNang)) {
        return prev.filter((code) => code !== maChucNang);
      } else {
        return [...prev, maChucNang];
      }
    });
  };

  const handleSavePermissions = async () => {
    if (!selectedGroup) {
      showError("Vui lòng chọn nhóm");
      return;
    }

    if (selectedFunctions.length === 0) {
      showError("Vui lòng chọn ít nhất một chức năng");
      return;
    }

    try {
      setLoading(true);
      await updatePermission(selectedGroup, selectedFunctions);
      showSuccess("Cập nhật phân quyền thành công!");
      fetchGroupFunctions(selectedGroup); // Refresh
    } catch (err) {
      showError(err.message || "Lỗi khi cập nhật phân quyền");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = () => {
    const allCodes = allFunctions.map((f) => f.MaChucNang);
    setSelectedFunctions(allCodes);
  };

  const handleDeselectAll = () => {
    setSelectedFunctions([]);
  };

  return (
    <div className="permission-management-tab">
      <div className="tab-section">
        <h3>🔐 Phân quyền cho nhóm người dùng</h3>
        <div className="info-box">
          <p>
            📝 Chọn nhóm người dùng và các chức năng mà nhóm đó được phép sử dụng. 
            Tất cả người dùng trong nhóm sẽ có các quyền này.
          </p>
        </div>

        <div className="form-group">
          <label>Chọn nhóm *</label>
          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            disabled={loading}
          >
            <option value="">-- Chọn nhóm để phân quyền --</option>
            {groups.map((group) => (
              <option key={group.MaNhom} value={group.MaNhom}>
                {group.TenNhom} ({group.MaNhom})
              </option>
            ))}
          </select>
        </div>

        {selectedGroup && (
          <>
            <div className="divider"></div>

            <div className="tab-section">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
                <h3 style={{ margin: 0 }}>
                  Chọn các chức năng ({selectedFunctions.length}/{allFunctions.length})
                </h3>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={handleSelectAll}
                    disabled={loading}
                  >
                    ✅ Chọn tất cả
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleDeselectAll}
                    disabled={loading}
                  >
                    ❌ Bỏ chọn tất cả
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="loading-spinner">Đang tải...</div>
              ) : allFunctions.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">📭</div>
                  <div className="empty-state-text">Chưa có chức năng nào</div>
                </div>
              ) : (
                <div className="checkbox-group">
                  {allFunctions.map((func) => (
                    <div key={func.MaChucNang} className="checkbox-item">
                      <input
                        type="checkbox"
                        id={`func-${func.MaChucNang}`}
                        checked={selectedFunctions.includes(func.MaChucNang)}
                        onChange={() => handleFunctionToggle(func.MaChucNang)}
                        disabled={loading}
                      />
                      <label htmlFor={`func-${func.MaChucNang}`}>
                        <strong>{func.MaChucNang}</strong> - {func.TenChucNang}
                      </label>
                    </div>
                  ))}
                </div>
              )}

              <div className="form-actions" style={{ marginTop: "20px" }}>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSavePermissions}
                  disabled={loading || selectedFunctions.length === 0}
                >
                  {loading ? "Đang lưu..." : "💾 Lưu phân quyền"}
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {selectedGroup && groupFunctions.length > 0 && (
        <>
          <div className="divider"></div>
          <div className="tab-section">
            <h3>✅ Quyền hiện tại của nhóm</h3>
            <div className="info-box">
              <p>Danh sách các chức năng đã được phân quyền cho nhóm này:</p>
              <ul style={{ marginTop: "10px", paddingLeft: "20px" }}>
                {groupFunctions.map((func) => (
                  <li key={func.MaChucNang}>
                    <strong>{func.MaChucNang}</strong> - {func.TenChucNang}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PermissionManagementTab;
