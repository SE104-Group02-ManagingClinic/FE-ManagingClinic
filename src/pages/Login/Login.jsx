import React, { useState } from "react";
import "./Login.css";
import { loginUser } from "../../api/userApi";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../contexts/ToastContext";
import { useAuth } from "../../contexts/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    TenDangNhap: "",
    MatKhau: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(""); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      console.log('🔐 Đang đăng nhập...');
      const result = await loginUser(formData.TenDangNhap, formData.MatKhau);
      
      // Debug: Kiểm tra cấu trúc result
      console.log('📦 Login result:', result);
      console.log('👤 User object:', result.user);
      console.log('🔑 Token:', result.token ? 'Có' : 'Không có');
      console.log('🔐 Permissions:', result.permissions?.length || 0);
      
      // Validate result
      if (!result || !result.user) {
        throw new Error('Response không hợp lệ từ server');
      }
      
      // Hiển thị thông báo thành công
      const username = result.user?.TenDangNhap || 'User';
      showSuccess(`Chào ${username}! Đăng nhập thành công.`);
      
      // ⚠️ Cảnh báo nếu backend chưa cập nhật
      // Lưu vào AuthContext
      console.log('💾 Lưu vào AuthContext...');
      login(result);

      // Reset form
      setFormData({
        TenDangNhap: "",
        MatKhau: "",
      });

      // Chuyển hướng đến trang chính
      console.log('🚀 Chuyển hướng đến /home');
      setTimeout(() => {
        navigate("/home");
      }, 500);
    } catch (error) {
      console.error('❌ Login error:', error);
      showError(error.message || "Đăng nhập thất bại!");
      setError(error.message || "Đăng nhập thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1 className="login-title">🏥 Quản Lý Phòng Khám</h1>
          <p className="login-subtitle">Đăng nhập hệ thống</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Tên đăng nhập</label>
            <input
              type="text"
              name="TenDangNhap"
              value={formData.TenDangNhap}
              onChange={handleChange}
              placeholder="Nhập tên đăng nhập"
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
              placeholder="Nhập mật khẩu"
              disabled={loading}
            />
          </div>

          <button
            className="login-btn"
            type="submit"
            disabled={loading}
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
