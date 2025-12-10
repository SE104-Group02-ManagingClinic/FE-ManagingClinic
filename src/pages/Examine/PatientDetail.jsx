import React from 'react';
import './PatientDetail.css';

const PatientDetail = ({ patient }) => {
  if (!patient) {
    return <div className="patient-detail">Chọn bệnh nhân để xem chi tiết</div>;
  }

  return (
    <div className="patient-detail">
      <h2>Thông tin bệnh nhân</h2>
      
      <div className="detail-section">
        <label>Mã bệnh nhân:</label>
        <p>{patient.MaBN}</p>
      </div>

      <div className="detail-section">
        <label>Họ tên:</label>
        <p>{patient.HoTen}</p>
      </div>

      <div className="detail-section">
        <label>Giới tính:</label>
        <p>{patient.GioiTinh}</p>
      </div>

      <div className="detail-section">
        <label>Ngày sinh:</label>
        <p>
          {new Date(patient.NamSinh).toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })}
        </p>
      </div>

      <div className="detail-section">
        <label>Số CCCD:</label>
        <p>{patient.CCCD}</p>
      </div>

      <div className="detail-section">
        <label>Số điện thoại:</label>
        <p>{patient.SDT}</p>
      </div>

      <div className="detail-section">
        <label>Địa chỉ:</label>
        <p>{patient.DiaChi}</p>
      </div>
    </div>
  );
};

export default PatientDetail;
