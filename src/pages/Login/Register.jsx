import React, { useState, useEffect } from "react";
import "./Register.css";
import { createAccount } from "../../api/userApi";
import { getAllGroupUsers } from "../../api/groupUserApi";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../contexts/ToastContext";

const Register = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  
  const [formData, setFormData] = useState({
    TenDangNhap: "",
    MatKhau: "",
    MatKhauConfirm: "",
    MaNhom: "", // Sẽ được set mặc định sau khi load groups
  });

  const [loading, setLoading] = useState(false);
  const [loadingGroups, setLoadingGroups] = useState(true);
  const [error, setError] = useState("");
  const [groups, setGroups] = useState([]);

  // Fetch danh sách nhóm người dùng từ database
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setLoadingGroups(true);
        const groupsData = await getAllGroupUsers();
        
        // Xử lý response - có thể là array hoặc object chứa array
        const groupsList = Array.isArray(groupsData) ? groupsData : [];
        
        if (groupsList.length > 0) {
          setGroups(groupsList);
          // Set giá trị mặc định là nhóm đầu tiên
          setFormData((prev) => ({
            ...prev,
            MaNhom: groupsList[0].MaNhom,
          }));
        } else {
          setError("Không tìm thấy nhóm người dùng trong hệ thống");
        }
      } catch (err) {
        console.error("Lỗi khi lấy danh sách nhóm người dùng:", err);
        showError("Không thể tải danh sách nhóm người dùng");
        setError("Không thể tải danh sách nhóm người dùng");
      } finally {
        setLoadingGroups(false);
      }
    };

    fetchGroups();
  }, [showError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(""); // Clear error when user types
  };

  const validateForm = () => {
    if (!formData.TenDangNhap.trim()) {
      throw new Error("Tên đăng nhập không được để trống");
    }

    if (formData.TenDangNhap.length < 3) {
      throw new Error("Tên đăng nhập phải ít nhất 3 ký tự");
    }

    if (!formData.MatKhau.trim()) {
      throw new Error("Mật khẩu không được để trống");
    }

    if (formData.MatKhau.length < 6) {
      throw new Error("Mật khẩu phải ít nhất 6 ký tự");
    }

    if (formData.MatKhau !== formData.MatKhauConfirm) {
      throw new Error("Mật khẩu xác nhận không khớp");
    }

    if (!formData.MaNhom.trim()) {
      throw new Error("Vui lòng chọn nhóm người dùng");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      validateForm();

      const result = await createAccount({
        TenDangNhap: formData.TenDangNhap,
        MatKhau: formData.MatKhau,
        MaNhom: formData.MaNhom,
      });

      showSuccess("Tạo tài khoản thành công! Đang chuyển hướng...");

      // Reset form
      setFormData({
        TenDangNhap: "",
        MatKhau: "",
        MatKhauConfirm: "",
        MaNhom: "GR001",
      });

      // Chuyển hướng về Login sau 2 giây
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      showError(error.message || "Tạo tài khoản thất bại!");
      setError(error.message || "Tạo tài khoản thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <h1 className="register-title">🏥 Quản Lý Phòng Khám</h1>
          <p className="register-subtitle">Tạo tài khoản mới</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form className="register-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Tên đăng nhập</label>
            <input
              type="text"
              name="TenDangNhap"
              value={formData.TenDangNhap}
              onChange={handleChange}
              placeholder="Nhập tên đăng nhập (ít nhất 3 ký tự)"
              disabled={loading}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>Mật khẩu</label>
            <input
              type="password"
              name="MatKhau"
              value={formData.MatKhau}
              onChange={handleChange}
              placeholder="Nhập mật khẩu (ít nhất 6 ký tự)"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Xác nhận mật khẩu</label>
            <input
              type="password"
              name="MatKhauConfirm"
              value={formData.MatKhauConfirm}
              onChange={handleChange}
              placeholder="Xác nhận lại mật khẩu"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Chọn nhóm người dùng</label>
            {loadingGroups ? (
              <div className="select-loading">Đang tải danh sách nhóm...</div>
            ) : groups.length > 0 ? (
              <select
                name="MaNhom"
                value={formData.MaNhom}
                onChange={handleChange}
                disabled={loading}
              >
                {groups.map((group) => (
                  <option key={group.MaNhom} value={group.MaNhom}>
                    {group.TenNhom}
                  </option>
                ))}
              </select>
            ) : (
              <div className="select-error">
                Không có nhóm người dùng nào trong hệ thống
              </div>
            )}
          </div>

          <button
            className="register-btn"
            type="submit"
            disabled={loading}
          >
            {loading ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
          </button>
        </form>

        <div className="register-footer">
          <p>Đã có tài khoản? <a href="/">Đăng nhập</a></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
