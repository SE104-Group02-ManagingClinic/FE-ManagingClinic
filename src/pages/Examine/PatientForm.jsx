import React, { useState } from "react";
import "./PatientForm.css";
import { createPatient } from "../../api/patientApi";
const PatientForm = ({ onSubmit }) => {
      const [formData, setFormData] = useState({
            HoTen: "",
            GioiTinh: "",
            NamSinh: "",
            CCCD: "",
            DiaChi: "",
            SDT: "",
      });

      const handleChange = (e) => {
            const { name, value } = e.target;
            setFormData((prev) => ({ ...prev, [name]: value }));
      };

      const handleSubmit = async (e) => {
            e.preventDefault();

            // Validate required fields
            if (!formData.HoTen.trim() || !formData.CCCD.trim() || !formData.SDT.trim() || !formData.NamSinh) {
                  alert("Vui lòng điền đầy đủ các trường bắt buộc!");
                  return;
            }

            try {
                  const result = await createPatient(formData);
                  console.log("✅ Tạo bệnh nhân thành công:", result);
                  alert("Tạo bệnh nhân thành công!");

                  // Reset form
                  setFormData({
                        HoTen: "",
                        GioiTinh: "",
                        NamSinh: "",
                        CCCD: "",
                        DiaChi: "",
                        SDT: "",
                  });

                  // Notify parent component
                  if (onSubmit) {
                        onSubmit(result);
                  }
            } catch (error) {
                  console.error("❌ Lỗi khi tạo bệnh nhân:", error);
                  alert("Tạo bệnh nhân thất bại!");
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
                                    <input
                                          type="text"
                                          name="GioiTinh"
                                          value={formData.GioiTinh}
                                          onChange={handleChange}
                                    />
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
            </div>
      );
};

export default PatientForm;
