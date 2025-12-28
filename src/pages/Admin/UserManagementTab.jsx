import React, { useState, useEffect } from "react";
import { useToast } from "../../contexts/ToastContext";
import { createAccount, updatePassword, updateGroup, deleteUser } from "../../api/userApi";
import { getAllGroupUsers } from "../../api/groupUserApi";

const UserManagementTab = () => {
  const { showSuccess, showError } = useToast();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);

  // Create user form
  const [createForm, setCreateForm] = useState({
    TenDangNhap: "",
    MatKhau: "",
    MaNhom: "",
  });

  // Update/Delete user form
  const [manageForm, setManageForm] = useState({
    TenDangNhap: "",
    MatKhauMoi: "",
    MaNhomMoi: "",
  });

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const data = await getAllGroupUsers();
      setGroups(data);
    } catch (err) {
      showError(err.message || "Lỗi khi tải danh sách nhóm");
    }
  };

  // Handle create user
  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!createForm.TenDangNhap || !createForm.MatKhau || !createForm.MaNhom) {
      showError("Vui lòng điền đầy đủ thông tin");
      return;
    }

    try {
      setLoading(true);
      await createAccount(createForm);
      showSuccess(`Tạo tài khoản "${createForm.TenDangNhap}" thành công!`);
      setCreateForm({ TenDangNhap: "", MatKhau: "", MaNhom: "" });
    } catch (err) {
      showError(err.message || "Lỗi khi tạo tài khoản");
    } finally {
      setLoading(false);
    }
  };

  // Handle update password
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!manageForm.TenDangNhap || !manageForm.MatKhauMoi) {
      showError("Vui lòng nhập tên đăng nhập và mật khẩu mới");
      return;
    }

    try {
      setLoading(true);
      await updatePassword(manageForm.TenDangNhap, manageForm.MatKhauMoi);
      showSuccess(`Đổi mật khẩu cho "${manageForm.TenDangNhap}" thành công!`);
      setManageForm({ ...manageForm, MatKhauMoi: "" });
    } catch (err) {
      showError(err.message || "Lỗi khi đổi mật khẩu");
    } finally {
      setLoading(false);
    }
  };

  // Handle update group
  const handleUpdateGroup = async (e) => {
    e.preventDefault();
    if (!manageForm.TenDangNhap || !manageForm.MaNhomMoi) {
      showError("Vui lòng nhập tên đăng nhập và chọn nhóm mới");
      return;
    }

    try {
      setLoading(true);
      await updateGroup(manageForm.TenDangNhap, manageForm.MaNhomMoi);
      showSuccess(`Chuyển "${manageForm.TenDangNhap}" sang nhóm mới thành công!`);
      setManageForm({ ...manageForm, MaNhomMoi: "" });
    } catch (err) {
      showError(err.message || "Lỗi khi đổi nhóm");
    } finally {
      setLoading(false);
    }
  };

  // Handle delete user
  const handleDeleteUser = async () => {
    if (!manageForm.TenDangNhap) {
      showError("Vui lòng nhập tên đăng nhập cần xóa");
      return;
    }

    if (!window.confirm(`Bạn có chắc chắn muốn xóa tài khoản "${manageForm.TenDangNhap}"?`)) {
      return;
    }

    try {
      setLoading(true);
      await deleteUser(manageForm.TenDangNhap);
      showSuccess(`Xóa tài khoản "${manageForm.TenDangNhap}" thành công!`);
      setManageForm({ TenDangNhap: "", MatKhauMoi: "", MaNhomMoi: "" });
    } catch (err) {
      showError(err.message || "Lỗi khi xóa tài khoản");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-management-tab">
      {/* Create User Section */}
      <div className="tab-section">
        <h3>➕ Tạo người dùng mới</h3>
        <div className="info-box">
          <p>📝 Tạo tài khoản mới cho người dùng và gán vào nhóm. Quyền của người dùng sẽ được thừa kế từ nhóm.</p>
        </div>
        <form onSubmit={handleCreateUser}>
          <div className="form-grid">
            <div className="form-group">
              <label>Tên đăng nhập *</label>
              <input
                type="text"
                value={createForm.TenDangNhap}
                onChange={(e) => setCreateForm({ ...createForm, TenDangNhap: e.target.value })}
                placeholder="Nhập tên đăng nhập"
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label>Mật khẩu *</label>
              <input
                type="password"
                value={createForm.MatKhau}
                onChange={(e) => setCreateForm({ ...createForm, MatKhau: e.target.value })}
                placeholder="Nhập mật khẩu"
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label>Nhóm người dùng *</label>
              <select
                value={createForm.MaNhom}
                onChange={(e) => setCreateForm({ ...createForm, MaNhom: e.target.value })}
                disabled={loading}
              >
                <option value="">-- Chọn nhóm --</option>
                {groups.map((group) => (
                  <option key={group.MaNhom} value={group.MaNhom}>
                    {group.TenNhom} ({group.MaNhom})
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Đang tạo..." : "✅ Tạo tài khoản"}
            </button>
          </div>
        </form>
      </div>

      <div className="divider"></div>

      {/* Manage User Section */}
      <div className="tab-section">
        <h3>🔧 Quản lý người dùng</h3>
        <div className="warning-box">
          <p>⚠️ Nhập tên đăng nhập của người dùng bạn muốn quản lý. Bạn có thể đổi mật khẩu, chuyển nhóm, hoặc xóa tài khoản.</p>
        </div>
        
        <div className="form-group">
          <label>Tên đăng nhập</label>
          <input
            type="text"
            value={manageForm.TenDangNhap}
            onChange={(e) => setManageForm({ ...manageForm, TenDangNhap: e.target.value })}
            placeholder="Nhập tên đăng nhập cần quản lý"
            disabled={loading}
          />
        </div>

        {/* Update Password */}
        <div className="tab-section" style={{ marginTop: "20px" }}>
          <h4>🔑 Đổi mật khẩu</h4>
          <form onSubmit={handleUpdatePassword}>
            <div className="form-group">
              <label>Mật khẩu mới</label>
              <input
                type="password"
                value={manageForm.MatKhauMoi}
                onChange={(e) => setManageForm({ ...manageForm, MatKhauMoi: e.target.value })}
                placeholder="Nhập mật khẩu mới"
                disabled={loading || !manageForm.TenDangNhap}
              />
            </div>
            <div className="form-actions">
              <button
                type="submit"
                className="btn btn-success"
                disabled={loading || !manageForm.TenDangNhap}
              >
                {loading ? "Đang cập nhật..." : "💾 Đổi mật khẩu"}
              </button>
            </div>
          </form>
        </div>

        {/* Update Group */}
        <div className="tab-section" style={{ marginTop: "20px" }}>
          <h4>👥 Chuyển nhóm</h4>
          <form onSubmit={handleUpdateGroup}>
            <div className="form-group">
              <label>Nhóm mới</label>
              <select
                value={manageForm.MaNhomMoi}
                onChange={(e) => setManageForm({ ...manageForm, MaNhomMoi: e.target.value })}
                disabled={loading || !manageForm.TenDangNhap}
              >
                <option value="">-- Chọn nhóm mới --</option>
                {groups.map((group) => (
                  <option key={group.MaNhom} value={group.MaNhom}>
                    {group.TenNhom} ({group.MaNhom})
                  </option>
                ))}
              </select>
            </div>
            <div className="form-actions">
              <button
                type="submit"
                className="btn btn-success"
                disabled={loading || !manageForm.TenDangNhap}
              >
                {loading ? "Đang cập nhật..." : "💾 Chuyển nhóm"}
              </button>
            </div>
          </form>
        </div>

        {/* Delete User */}
        <div className="tab-section" style={{ marginTop: "20px" }}>
          <h4>🗑️ Xóa tài khoản</h4>
          <div className="warning-box">
            <p>⚠️ Hành động này không thể hoàn tác! Vui lòng cân nhắc kỹ trước khi xóa.</p>
          </div>
          <div className="form-actions">
            <button
              type="button"
              className="btn btn-danger"
              onClick={handleDeleteUser}
              disabled={loading || !manageForm.TenDangNhap}
            >
              {loading ? "Đang xóa..." : "🗑️ Xóa tài khoản"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagementTab;
