import React, { useState, useEffect } from "react";
import { createUsage, updateUsage } from "../../api/usageApi";

const UsageForm = ({ usage = null, onSubmit, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    TenCachDung: "",
  });

  useEffect(() => {
    if (usage) {
      setFormData({
        TenCachDung: usage.TenCachDung,
      });
    }
  }, [usage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.TenCachDung || formData.TenCachDung.trim() === "") {
      setError("Tên cách dùng không được để trống");
      return;
    }

    try {
      setLoading(true);

      if (usage) {
        await updateUsage(usage.MaCachDung, formData);
      } else {
        await createUsage(formData);
      }

      onSubmit?.();
    } catch (err) {
      console.error("Error saving usage:", err);
      setError(err.message || "Lỗi khi lưu cách dùng");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="medicine-form-container">
      <div className="medicine-form-header">
        <h3>{usage ? "Sửa cách dùng" : "Thêm cách dùng mới"}</h3>
        <button className="btn-close" onClick={onCancel}>
          ×
        </button>
      </div>

      <div className="medicine-form-body">
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="alert alert-error" style={{ marginBottom: "16px" }}>
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="TenCachDung">
              Tên cách dùng <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="text"
              id="TenCachDung"
              name="TenCachDung"
              value={formData.TenCachDung}
              onChange={handleChange}
              placeholder="Nhập cách dùng (VD: Uống sau ăn, Ngày 2 lần...)"
              disabled={loading}
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={onCancel}
              disabled={loading}
            >
              Hủy
            </button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? "Đang lưu..." : usage ? "Cập nhật" : "Thêm mới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UsageForm;
