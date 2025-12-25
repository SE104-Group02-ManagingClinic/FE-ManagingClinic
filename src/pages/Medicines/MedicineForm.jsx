import React, { useState, useEffect } from "react";
import { createMedicine, updateMedicine } from "../../api/medicineApi";
import { getAllUnits } from "../../api/unitApi";
import { getAllUsages } from "../../api/usageApi";
import { useBottomSheet } from "../../contexts/BottomSheetContext";
import { useToast } from "../../contexts/ToastContext";

const MedicineForm = ({ medicine = null, onSubmit, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [units, setUnits] = useState([]);
  const [usages, setUsages] = useState([]);
  const [formData, setFormData] = useState({
    TenThuoc: "",
    CongDung: "",
    MaCachDung: "",
    MaDVT: "",
    TacDungPhu: "",
  });

  const { refreshTriggers } = useBottomSheet();
  const { showError } = useToast();

  useEffect(() => {
    // Load units and usages
    const fetchData = async () => {
      try {
        const [unitsData, usagesData] = await Promise.all([
          getAllUnits(),
          getAllUsages()
        ]);
        setUnits(unitsData);
        setUsages(usagesData);
      } catch (err) {
        showError("Lỗi khi tải dữ liệu đơn vị tính/cách dùng");
      }
    };
    fetchData();
  }, [refreshTriggers.medicines]);

  useEffect(() => {
    if (medicine) {
      setFormData({
        TenThuoc: medicine.TenThuoc,
        CongDung: medicine.CongDung || "",
        MaCachDung: medicine.MaCachDung || "",
        MaDVT: medicine.MaDVT || "",
        TacDungPhu: medicine.TacDungPhu || "",
      });
    }
  }, [medicine]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.TenThuoc || formData.TenThuoc.trim() === "") {
      setError("Tên thuốc không được để trống");
      return;
    }

    try {
      setLoading(true);

      if (medicine) {
        await updateMedicine(medicine.MaThuoc, formData);
      } else {
        await createMedicine(formData);
      }

      onSubmit?.();
    } catch (err) {
      showError(err.message || "Lỗi khi lưu thuốc");
      setError(err.message || "Lỗi khi lưu thuốc");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="medicine-form-container">
      <div className="medicine-form-header">
        <h3>{medicine ? "Cập nhật thuốc" : "Thêm thuốc mới"}</h3>
        <button className="btn-close" onClick={onCancel}>
          ×
        </button>
      </div>

      <div className="medicine-form-body">
        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Tên thuốc *</label>
            <input
              type="text"
              value={formData.TenThuoc}
              onChange={(e) => setFormData({ ...formData, TenThuoc: e.target.value })}
              placeholder="VD: Paracetamol 500mg"
              required
            />
          </div>

          <div className="form-group">
            <label>Công dụng</label>
            <textarea
              rows="2"
              value={formData.CongDung}
              onChange={(e) => setFormData({ ...formData, CongDung: e.target.value })}
              placeholder="VD: Giảm đau, hạ sốt"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Cách dùng</label>
              <select
                value={formData.MaCachDung}
                onChange={(e) => setFormData({ ...formData, MaCachDung: e.target.value })}
              >
                <option value="">-- Chọn cách dùng --</option>
                {usages.map((usage) => (
                  <option key={usage.MaCachDung} value={usage.MaCachDung}>
                    {usage.TenCachDung}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Đơn vị tính</label>
              <select
                value={formData.MaDVT}
                onChange={(e) => setFormData({ ...formData, MaDVT: e.target.value })}
              >
                <option value="">-- Chọn đơn vị tính --</option>
                {units.map((unit) => (
                  <option key={unit.MaDVT} value={unit.MaDVT}>
                    {unit.TenDVT}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Tác dụng phụ</label>
            <textarea
              rows="2"
              value={formData.TacDungPhu}
              onChange={(e) => setFormData({ ...formData, TacDungPhu: e.target.value })}
              placeholder="VD: Buồn nôn, chóng mặt"
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? "Đang xử lý..." : (medicine ? "Cập nhật" : "Thêm mới")}
            </button>
            <button type="button" className="btn-cancel" onClick={onCancel}>
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MedicineForm;
