import React, { useState } from "react";
import "./Login.css";
import { loginUser } from "../../api/userApi";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    TenDangNhap: "",
    MatKhau: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(""); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const result = await loginUser(formData.TenDangNhap, formData.MatKhau);
      console.log("✅ Đăng nhập thành công:", result);

      setSuccess(`Chào ${result.TenDangNhap}! Đăng nhập thành công.`);

      // Lưu thông tin vào localStorage
      localStorage.setItem("user", JSON.stringify(result));

      // Reset form
      setFormData({
        TenDangNhap: "",
        MatKhau: "",
      });

      // Chuyển hướng đến trang chính sau 1 giây
      setTimeout(() => {
        navigate("/home");
      }, 500);
    } catch (error) {
      console.error("❌ Lỗi khi đăng nhập:", error);
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
        {success && <div className="alert alert-success">{success}</div>}

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

        <div className="login-footer">
          <p>Chưa có tài khoản? <a href="/register">Tạo tài khoản mới</a></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
