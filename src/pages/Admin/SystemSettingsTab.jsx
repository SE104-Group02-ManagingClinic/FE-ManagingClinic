import React, { useState, useEffect } from "react";
import { useToast } from "../../contexts/ToastContext";
import {
  getThamSo,
  updateSoBenhNhanToiDa,
  updateTiLeTinhDonGiaBan,
  updateTienKham,
} from "../../api/argumentApi";

const SystemSettingsTab = () => {
  const { showSuccess, showError } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [thamSo, setThamSo] = useState({
    SoBenhNhanToiDa: 0,
    TiLeTinhDonGiaBan: 0,
    TienKham: 0,
  });

  // Editing states
  const [editingSoBenhNhan, setEditingSoBenhNhan] = useState(false);
  const [editingTiLe, setEditingTiLe] = useState(false);
  const [editingTienKham, setEditingTienKham] = useState(false);

  const [tempSoBenhNhan, setTempSoBenhNhan] = useState(0);
  const [tempTiLe, setTempTiLe] = useState(0);
  const [tempTienKham, setTempTienKham] = useState(0);

  useEffect(() => {
    fetchThamSo();
  }, []);

  const fetchThamSo = async () => {
    try {
      setLoading(true);
      const data = await getThamSo();
      setThamSo(data);
      setTempSoBenhNhan(data.SoBenhNhanToiDa);
      setTempTiLe(data.TiLeTinhDonGiaBan);
      setTempTienKham(data.TienKham);
    } catch (err) {
      showError(err.message || "Lỗi khi tải thông tin tham số hệ thống");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSoBenhNhan = async () => {
    if (tempSoBenhNhan <= 0) {
      showError("Số bệnh nhân tối đa phải lớn hơn 0");
      return;
    }

    try {
      setSaving(true);
      const updatedData = await updateSoBenhNhanToiDa(tempSoBenhNhan);
      setThamSo(updatedData);
      setEditingSoBenhNhan(false);
      showSuccess("Cập nhật số bệnh nhân tối đa thành công");
    } catch (err) {
      showError(err.message || "Lỗi khi cập nhật số bệnh nhân tối đa");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateTiLe = async () => {
    if (tempTiLe <= 0) {
      showError("Tỉ lệ tính đơn giá bán phải lớn hơn 0");
      return;
    }

    try {
      setSaving(true);
      const updatedData = await updateTiLeTinhDonGiaBan(tempTiLe);
      setThamSo(updatedData);
      setEditingTiLe(false);
      showSuccess("Cập nhật tỉ lệ tính đơn giá bán thành công");
    } catch (err) {
      showError(err.message || "Lỗi khi cập nhật tỉ lệ tính đơn giá bán");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateTienKham = async () => {
    if (tempTienKham <= 0) {
      showError("Tiền khám phải lớn hơn 0");
      return;
    }

    try {
      setSaving(true);
      const updatedData = await updateTienKham(tempTienKham);
      setThamSo(updatedData);
      setEditingTienKham(false);
      showSuccess("Cập nhật tiền khám thành công");
    } catch (err) {
      showError(err.message || "Lỗi khi cập nhật tiền khám");
    } finally {
      setSaving(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  if (loading) {
    return <div className="loading-spinner">Đang tải thông tin tham số...</div>;
  }

  return (
    <div className="system-settings-tab">
      <div className="tab-section">
        <h3>⚙️ Tham số hệ thống</h3>
        <div className="info-box">
          <p>📝 Quản lý các tham số cấu hình hệ thống phòng khám.</p>
        </div>
      </div>

      {/* Số bệnh nhân tối đa */}
      <div className="tab-section">
        <div className="list-item">
          <div className="list-item-info">
            <h4>👥 Số bệnh nhân tối đa mỗi ngày</h4>
            <p>
              Giá trị hiện tại: <strong>{thamSo.SoBenhNhanToiDa}</strong> bệnh nhân
            </p>
          </div>
          <div className="list-item-actions">
            {!editingSoBenhNhan ? (
              <button
                className="btn btn-primary"
                onClick={() => setEditingSoBenhNhan(true)}
                disabled={saving}
              >
                ✏️ Sửa
              </button>
            ) : (
              <>
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setEditingSoBenhNhan(false);
                    setTempSoBenhNhan(thamSo.SoBenhNhanToiDa);
                  }}
                  disabled={saving}
                >
                  ❌ Hủy
                </button>
                <button
                  className="btn btn-success"
                  onClick={handleUpdateSoBenhNhan}
                  disabled={saving}
                >
                  {saving ? "Đang lưu..." : "💾 Lưu"}
                </button>
              </>
            )}
          </div>
        </div>
        {editingSoBenhNhan && (
          <div className="form-group" style={{ marginTop: "10px" }}>
            <input
              type="number"
              value={tempSoBenhNhan}
              onChange={(e) => setTempSoBenhNhan(parseInt(e.target.value) || 0)}
              min="1"
              disabled={saving}
            />
          </div>
        )}
      </div>

      {/* Tỉ lệ tính đơn giá bán */}
      <div className="tab-section">
        <div className="list-item">
          <div className="list-item-info">
            <h4>💰 Tỉ lệ tính đơn giá bán thuốc</h4>
            <p>
              Giá trị hiện tại: <strong>{thamSo.TiLeTinhDonGiaBan}</strong> (Giá bán = Giá nhập × Tỉ lệ)
            </p>
          </div>
          <div className="list-item-actions">
            {!editingTiLe ? (
              <button
                className="btn btn-primary"
                onClick={() => setEditingTiLe(true)}
                disabled={saving}
              >
                ✏️ Sửa
              </button>
            ) : (
              <>
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setEditingTiLe(false);
                    setTempTiLe(thamSo.TiLeTinhDonGiaBan);
                  }}
                  disabled={saving}
                >
                  ❌ Hủy
                </button>
                <button
                  className="btn btn-success"
                  onClick={handleUpdateTiLe}
                  disabled={saving}
                >
                  {saving ? "Đang lưu..." : "💾 Lưu"}
                </button>
              </>
            )}
          </div>
        </div>
        {editingTiLe && (
          <div className="form-group" style={{ marginTop: "10px" }}>
            <input
              type="number"
              step="0.01"
              value={tempTiLe}
              onChange={(e) => setTempTiLe(parseFloat(e.target.value) || 0)}
              min="0.01"
              disabled={saving}
            />
          </div>
        )}
      </div>

      {/* Tiền khám */}
      <div className="tab-section">
        <div className="list-item">
          <div className="list-item-info">
            <h4>🏥 Tiền khám bệnh</h4>
            <p>
              Giá trị hiện tại: <strong>{formatCurrency(thamSo.TienKham)}</strong>
            </p>
          </div>
          <div className="list-item-actions">
            {!editingTienKham ? (
              <button
                className="btn btn-primary"
                onClick={() => setEditingTienKham(true)}
                disabled={saving}
              >
                ✏️ Sửa
              </button>
            ) : (
              <>
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setEditingTienKham(false);
                    setTempTienKham(thamSo.TienKham);
                  }}
                  disabled={saving}
                >
                  ❌ Hủy
                </button>
                <button
                  className="btn btn-success"
                  onClick={handleUpdateTienKham}
                  disabled={saving}
                >
                  {saving ? "Đang lưu..." : "💾 Lưu"}
                </button>
              </>
            )}
          </div>
        </div>
        {editingTienKham && (
          <div className="form-group" style={{ marginTop: "10px" }}>
            <input
              type="number"
              value={tempTienKham}
              onChange={(e) => setTempTienKham(parseInt(e.target.value) || 0)}
              min="1"
              step="1000"
              disabled={saving}
            />
            <p style={{ fontSize: "12px", color: "#666", marginTop: "5px" }}>
              Xem trước: {formatCurrency(tempTienKham)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemSettingsTab;
