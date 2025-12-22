import React, { useState, useEffect } from "react";
import { createDisease, updateDisease } from "../../api/diseaseApi";

const DiseaseFormExamine = ({ disease = null, onSubmit, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    TenBenh: "",
    TrieuChung: "",
    NguyenNhan: "",
    BienPhapChanDoan: "",
    CachDieuTri: "",
  });

  useEffect(() => {
    if (disease) {
      setFormData({
        TenBenh: disease.TenBenh,
        TrieuChung: disease.TrieuChung || "",
        NguyenNhan: disease.NguyenNhan || "",
        BienPhapChanDoan: disease.BienPhapChanDoan || "",
        CachDieuTri: disease.CachDieuTri || "",
      });
    }
  }, [disease]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.TenBenh || formData.TenBenh.trim() === "") {
      setError("Tên bệnh không được để trống");
      return;
    }

    try {
      setLoading(true);

      if (disease) {
        await updateDisease(disease.MaBenh, formData);
      } else {
        await createDisease(formData);
      }

      onSubmit?.();
    } catch (err) {
      console.error("Error saving disease:", err);
      setError(err.message || "Lỗi khi lưu bệnh");
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
        <h3>{disease ? "Sửa thông tin bệnh" : "Thêm bệnh mới"}</h3>
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
            <label htmlFor="TenBenh">
              Tên bệnh <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="text"
              id="TenBenh"
              name="TenBenh"
              value={formData.TenBenh}
              onChange={handleChange}
              placeholder="Nhập tên bệnh (VD: Cúm, Viêm họng...)"
              disabled={loading || !!disease}
            />
            {disease && (
              <small style={{ color: "#999", fontSize: "12px" }}>
                Không thể thay đổi tên bệnh
              </small>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="TrieuChung">Triệu chứng</label>
            <textarea
              id="TrieuChung"
              name="TrieuChung"
              value={formData.TrieuChung}
              onChange={handleChange}
              placeholder="Nhập triệu chứng (VD: Sốt, ho, đau đầu...)"
              disabled={loading}
              rows="3"
            />
          </div>

          <div className="form-group">
            <label htmlFor="NguyenNhan">Nguyên nhân</label>
            <textarea
              id="NguyenNhan"
              name="NguyenNhan"
              value={formData.NguyenNhan}
              onChange={handleChange}
              placeholder="Nhập nguyên nhân (VD: Virus, vi khuẩn...)"
              disabled={loading}
              rows="3"
            />
          </div>

          <div className="form-group">
            <label htmlFor="BienPhapChanDoan">Biện pháp chẩn đoán</label>
            <textarea
              id="BienPhapChanDoan"
              name="BienPhapChanDoan"
              value={formData.BienPhapChanDoan}
              onChange={handleChange}
              placeholder="Nhập biện pháp chẩn đoán"
              disabled={loading}
              rows="3"
            />
          </div>

          <div className="form-group">
            <label htmlFor="CachDieuTri">Cách điều trị</label>
            <textarea
              id="CachDieuTri"
              name="CachDieuTri"
              value={formData.CachDieuTri}
              onChange={handleChange}
              placeholder="Nhập cách điều trị"
              disabled={loading}
              rows="3"
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
              {loading ? "Đang lưu..." : disease ? "Cập nhật" : "Thêm mới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DiseaseFormExamine;
