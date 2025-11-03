import React, { useState } from "react";
import "./PatientForm.css";

const PatientForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    gender: "",
    birthYear: "",
    cccd: "",
    address: "",
    phone: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(formData);
    console.log("Dữ liệu bệnh nhân mới:", formData);
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
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>CCCD:</label>
            <input
              type="text"
              name="cccd"
              value={formData.cccd}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Giới tính:</label>
            <input
              type="text"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Địa chỉ:</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Năm sinh:</label>
            <input
              type="text"
              name="birthYear"
              value={formData.birthYear}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>SĐT:</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
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
