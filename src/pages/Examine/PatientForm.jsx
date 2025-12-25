import React, { useState } from "react";
import "./PatientForm.css";
import { useBottomSheet } from "../../contexts/BottomSheetContext";
import { useToast } from "../../contexts/ToastContext";

const PatientForm = ({ onSubmit }) => {
      const { addPendingPatient, triggerRefresh } = useBottomSheet();
      const { showSuccess, showError, showWarning } = useToast();
      const [formData, setFormData] = useState({
            HoTen: "",
            GioiTinh: "",
            NamSinh: "",
            CCCD: "",
            DiaChi: "",
            SDT: "",
      });
      const [showConfirmPopup, setShowConfirmPopup] = useState(false);

      const handleChange = (e) => {
            const { name, value } = e.target;
            setFormData((prev) => ({ ...prev, [name]: value }));
      };

      const handleSubmit = async (e) => {
            e.preventDefault();

            // Validate required fields
            if (!formData.HoTen.trim() || !formData.CCCD.trim() || !formData.SDT.trim() || !formData.NamSinh || !formData.GioiTinh) {
                  showWarning("Vui lòng điền đầy đủ các trường bắt buộc!");
                  return;
            }

            // Validate CCCD (12 số)
            if (!/^\d{12}$/.test(formData.CCCD)) {
                  showWarning("CCCD phải gồm đúng 12 số!");
                  return;
            }

            // Validate SDT (10 số)
            if (!/^\d{10}$/.test(formData.SDT)) {
                  showWarning("Số điện thoại phải gồm đúng 10 số!");
                  return;
            }

            // Hiển thị popup xác nhận
            setShowConfirmPopup(true);
      };

      const handleConfirmRegister = async () => {
            try {
                  // Lưu bệnh nhân tạm trong frontend (chưa gọi API)
                  const pendingPatient = addPendingPatient(formData);
                  showSuccess(`Đã thêm bệnh nhân "${formData.HoTen}" vào danh sách chờ`);

                  // Reset form
                  setFormData({
                        HoTen: "",
                        GioiTinh: "",
                        NamSinh: "",
                        CCCD: "",
                        DiaChi: "",
                        SDT: "",
                  });

                  // Đóng popup
                  setShowConfirmPopup(false);

                  // Trigger refresh để cập nhật danh sách bệnh nhân
                  triggerRefresh("patients");

                  // Notify parent component
                  if (onSubmit) {
                        onSubmit(pendingPatient);
                  }
            } catch (error) {
                  showError("Thêm bệnh nhân thất bại!");
            }
      };
      
      return (
            <div className="patient-form-container">
                  <h2 className="form-title">🩺 Nhập thông tin bệnh nhân</h2>
                  <form className="patient-form" onSubmit={handleSubmit}>
                        <div className="form-row">
                              <div className="form-group">
                                    <label>Họ tên:</label>
                                    <input
                                          type="text"
                                          name="HoTen"
                                          value={formData.HoTen}
                                          onChange={handleChange}
                                    />
                              </div>
                              <div className="form-group">
                                    <label>Giới tính:</label>
                                    <select
                                          name="GioiTinh"
                                          value={formData.GioiTinh}
                                          onChange={handleChange}
                                          required
                                    >
                                          <option value="">-- Chọn giới tính --</option>
                                          <option value="Nam">Nam</option>
                                          <option value="Nữ">Nữ</option>
                                    </select>
                              </div>
                        </div>

                        <div className="form-row">
                              <div className="form-group">
                                    <label>Ngày sinh:</label>
                                    <input
                                          type="date"
                                          name="NamSinh"
                                          value={formData.NamSinh}
                                          onChange={handleChange}
                                          required
                                    />
                              </div>
                              <div className="form-group">
                                    <label>CCCD:</label>
                                    <input
                                          type="text"
                                          name="CCCD"
                                          value={formData.CCCD}
                                          onChange={handleChange}
                                    />
                              </div>
                        </div>

                        <div className="form-row">
                              <div className="form-group">
                                    <label>Địa chỉ:</label>
                                    <input
                                          type="text"
                                          name="DiaChi"
                                          value={formData.DiaChi}
                                          onChange={handleChange}
                                    />
                              </div>
                              <div className="form-group">
                                    <label>Số điện thoại:</label>
                                    <input
                                          type="text"
                                          name="SDT"
                                          value={formData.SDT}
                                          onChange={handleChange}
                                    />
                              </div>
                        </div>

                        <button className="submit-btn" type="submit">
                              Lưu thông tin
                        </button>
                  </form>

                  {/* Popup xác nhận */}
                  {showConfirmPopup && (
                        <div className="confirm-popup-overlay" onClick={() => setShowConfirmPopup(false)}>
                              <div className="confirm-popup" onClick={(e) => e.stopPropagation()}>
                                    <h3>Xác nhận thông tin bệnh nhân</h3>
                                    <div className="confirm-info">
                                          <div className="info-row">
                                                <span className="info-label">Họ tên:</span>
                                                <span className="info-value">{formData.HoTen}</span>
                                          </div>
                                          <div className="info-row">
                                                <span className="info-label">Giới tính:</span>
                                                <span className="info-value">{formData.GioiTinh}</span>
                                          </div>
                                          <div className="info-row">
                                                <span className="info-label">Ngày sinh:</span>
                                                <span className="info-value">{formData.NamSinh}</span>
                                          </div>
                                          <div className="info-row">
                                                <span className="info-label">CCCD:</span>
                                                <span className="info-value">{formData.CCCD}</span>
                                          </div>
                                          <div className="info-row">
                                                <span className="info-label">Địa chỉ:</span>
                                                <span className="info-value">{formData.DiaChi || "(Không có)"}</span>
                                          </div>
                                          <div className="info-row">
                                                <span className="info-label">Số điện thoại:</span>
                                                <span className="info-value">{formData.SDT}</span>
                                          </div>
                                    </div>
                                    <div className="popup-buttons">
                                          <button className="cancel-btn" onClick={() => setShowConfirmPopup(false)}>
                                                Hủy
                                          </button>
                                          <button className="confirm-btn" onClick={handleConfirmRegister}>
                                                Xác nhận đăng ký
                                          </button>
                                    </div>
                              </div>
                        </div>
                  )}
            </div>
      );
};

export default PatientForm;
