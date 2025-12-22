import React, { useState, useEffect } from "react";
import { createUnit, updateUnit } from "../../api/unitApi";

const UnitForm = ({ unit = null, onSubmit, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    TenDVT: "",
  });

  useEffect(() => {
    if (unit) {
      setFormData({
        TenDVT: unit.TenDVT,
      });
    }
  }, [unit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.TenDVT || formData.TenDVT.trim() === "") {
      setError("Tên đơn vị tính không được để trống");
      return;
    }

    try {
      setLoading(true);

      if (unit) {
        await updateUnit(unit.MaDVT, formData);
      } else {
        await createUnit(formData);
      }

      onSubmit?.();
    } catch (err) {
      console.error("Error saving unit:", err);
      setError(err.message || "Lỗi khi lưu đơn vị tính");
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
        <h3>{unit ? "Sửa đơn vị tính" : "Thêm đơn vị tính mới"}</h3>
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
            <label htmlFor="TenDVT">
              Tên đơn vị tính <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="text"
              id="TenDVT"
              name="TenDVT"
              value={formData.TenDVT}
              onChange={handleChange}
              placeholder="Nhập tên đơn vị tính (VD: Viên, Hộp, Chai...)"
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
              {loading ? "Đang lưu..." : unit ? "Cập nhật" : "Thêm mới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UnitForm;
