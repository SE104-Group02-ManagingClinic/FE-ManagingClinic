import React, { useState, useEffect } from "react";
import "./Settings.css";
import {
  getThamSo,
  updateSoBenhNhanToiDa,
  updateTiLeTinhDonGiaBan,
  updateTienKham,
} from "../../api/argumentApi";
import { useToast } from "../../contexts/ToastContext";
import { useAuth } from "../../contexts/AuthContext";
import PermissionGuard from "../../components/PermissionGuard";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("argument"); // Default tab
  const { checkFeature } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [thamSo, setThamSo] = useState({
    SoBenhNhanToiDa: 0,
    TiLeTinhDonGiaBan: 0,
    TienKham: 0,
  });

  // Check quyền xem từng tab
  const canViewArgument = checkFeature('argument-manage');
  const canViewDisease = checkFeature('disease-list') || checkFeature('disease-create');
  const canViewUnits = checkFeature('unit-list') || checkFeature('unit-create');
  const canViewUsages = checkFeature('usage-list') || checkFeature('usage-create');
  const canViewCatalog = canViewDisease || canViewUnits || canViewUsages;

  // Nếu không có tab nào, set activeTab = ""
  // Nếu tab hiện tại không còn quyền, chuyển sang tab đầu tiên có quyền
  useEffect(() => {
    const visibleTabs = [];
    if (canViewArgument) visibleTabs.push('argument');
    if (canViewCatalog) visibleTabs.push('catalog');

    if (visibleTabs.length === 0) {
      setActiveTab('');
    } else if (!visibleTabs.includes(activeTab)) {
      setActiveTab(visibleTabs[0]);
    }
  }, [canViewArgument, canViewCatalog]);

  // Form states for editing
  const [editingSoBenhNhan, setEditingSoBenhNhan] = useState(false);
  const [editingTiLe, setEditingTiLe] = useState(false);
  const [editingTienKham, setEditingTienKham] = useState(false);

  const [tempSoBenhNhan, setTempSoBenhNhan] = useState(0);
  const [tempTiLe, setTempTiLe] = useState(0);
  const [tempTienKham, setTempTienKham] = useState(0);

  const { showSuccess, showError } = useToast();

  // Fetch tham so on mount
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

  // Handle updating So Benh Nhan Toi Da
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

  // Handle updating Ti Le Tinh Don Gia Ban
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

  // Handle updating Tien Kham
  const handleUpdateTienKham = async () => {
    if (tempTienKham < 0) {
      showError("Tiền khám không được âm");
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

  // Cancel editing
  const handleCancelSoBenhNhan = () => {
    setTempSoBenhNhan(thamSo.SoBenhNhanToiDa);
    setEditingSoBenhNhan(false);
  };

  const handleCancelTiLe = () => {
    setTempTiLe(thamSo.TiLeTinhDonGiaBan);
    setEditingTiLe(false);
  };

  const handleCancelTienKham = () => {
    setTempTienKham(thamSo.TienKham);
    setEditingTienKham(false);
  };

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const settingsContent = (
    <div className="settings-container">
      <div className="settings-header">
        <h2>⚙️ Cài đặt hệ thống</h2>
      </div>

      {/* Tab Navigation */}
      {(canViewArgument || canViewCatalog) && (
        <div className="settings-tabs">
          {canViewArgument && (
            <button
              className={`settings-tab ${activeTab === 'argument' ? 'active' : ''}`}
              onClick={() => setActiveTab('argument')}
              data-feature="argument-manage"
            >
              🔧 Tham số hệ thống
            </button>
          )}
          {canViewCatalog && (
            <button
              className={`settings-tab ${activeTab === 'catalog' ? 'active' : ''}`}
              onClick={() => setActiveTab('catalog')}
              data-feature="disease-list,unit-list,usage-list"
            >
              📚 Danh mục
            </button>
          )}
        </div>
      )}

      {/* Tab Content */}
      {activeTab === 'argument' && (
        <PermissionGuard
          feature="argument-manage"
          fallback={
            <div className="settings-loading">
              Bạn không có quyền truy cập tham số hệ thống
            </div>
          }
        >
        <div className="settings-content">
          <div className="settings-section">
            <h3>Tham số quy định</h3>

            {/* Số bệnh nhân tối đa */}
            <div className="setting-item">
              <div className="setting-info">
                <label>Số bệnh nhân tối đa mỗi ngày</label>
                <p className="setting-description">
                  Giới hạn số lượng bệnh nhân có thể khám trong một ngày
                </p>
              </div>
              <div className="setting-value">
                {editingSoBenhNhan ? (
                  <div className="setting-edit">
                    <input
                      type="number"
                      value={tempSoBenhNhan}
                      onChange={(e) => setTempSoBenhNhan(parseInt(e.target.value) || 0)}
                      min="1"
                      disabled={saving}
                    />
                    <div className="setting-actions">
                      <button
                        className="btn-save"
                        onClick={handleUpdateSoBenhNhan}
                        disabled={saving}
                      >
                        {saving ? "Đang lưu..." : "Lưu"}
                      </button>
                      <button
                        className="btn-cancel"
                        onClick={handleCancelSoBenhNhan}
                        disabled={saving}
                      >
                        Hủy
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="setting-display">
                    <span className="value-text">{thamSo.SoBenhNhanToiDa} bệnh nhân</span>
                    <button
                      className="btn-edit"
                      onClick={() => setEditingSoBenhNhan(true)}
                    >
                      Sửa
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Tỉ lệ tính đơn giá bán */}
            <div className="setting-item">
              <div className="setting-info">
                <label>Tỉ lệ tính đơn giá bán</label>
                <p className="setting-description">
                  Hệ số nhân với giá nhập để tính giá bán thuốc (VD: 1.2 = 120% giá nhập)
                </p>
              </div>
              <div className="setting-value">
                {editingTiLe ? (
                  <div className="setting-edit">
                    <input
                      type="number"
                      step="0.01"
                      value={tempTiLe}
                      onChange={(e) => setTempTiLe(parseFloat(e.target.value) || 0)}
                      min="0.01"
                      disabled={saving}
                    />
                    <div className="setting-actions">
                      <button
                        className="btn-save"
                        onClick={handleUpdateTiLe}
                        disabled={saving}
                      >
                        {saving ? "Đang lưu..." : "Lưu"}
                      </button>
                      <button
                        className="btn-cancel"
                        onClick={handleCancelTiLe}
                        disabled={saving}
                      >
                        Hủy
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="setting-display">
                    <span className="value-text">x{thamSo.TiLeTinhDonGiaBan}</span>
                    <button
                      className="btn-edit"
                      onClick={() => setEditingTiLe(true)}
                    >
                      Sửa
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Tiền khám */}
            <div className="setting-item">
              <div className="setting-info">
                <label>Tiền khám bệnh</label>
                <p className="setting-description">
                  Phí khám bệnh cơ bản cho mỗi lần khám
                </p>
              </div>
              <div className="setting-value">
                {editingTienKham ? (
                  <div className="setting-edit">
                    <input
                      type="number"
                      value={tempTienKham}
                      onChange={(e) => setTempTienKham(parseInt(e.target.value) || 0)}
                      min="0"
                      step="1000"
                      disabled={saving}
                    />
                    <div className="setting-actions">
                      <button
                        className="btn-save"
                        onClick={handleUpdateTienKham}
                        disabled={saving}
                      >
                        {saving ? "Đang lưu..." : "Lưu"}
                      </button>
                      <button
                        className="btn-cancel"
                        onClick={handleCancelTienKham}
                        disabled={saving}
                      >
                        Hủy
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="setting-display">
                    <span className="value-text">{formatCurrency(thamSo.TienKham)}</span>
                    <button
                      className="btn-edit"
                      onClick={() => setEditingTienKham(true)}
                    >
                      Sửa
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <PermissionGuard
      feature={['disease-list', 'disease-create', 'disease-edit', 'disease-delete', 'unit-list', 'unit-create', 'unit-edit', 'unit-delete', 'usage-list', 'usage-create', 'usage-edit', 'usage-delete', 'argument-manage']}
      mode="any"
      fallback={
        <div className="settings-container">
          <div className="settings-header">
            <h2>⚙️ Cài đặt hệ thống</h2>
          </div>
          <div className="settings-loading">
            Bạn không có quyền truy cập cài đặt hệ thống
          </div>
        </div>
      }
    >
      {settingsContent}
    </PermissionGuard>
  );
};

export default Settings;
