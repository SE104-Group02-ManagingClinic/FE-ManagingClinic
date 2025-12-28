import React from "react";
import "./ExamListCard.css";

/**
 * Card hiển thị thông tin bệnh nhân trong danh sách khám bệnh
 * Khác với ExamineCard (hiển thị phiếu khám bệnh)
 */
const ExamListCard = ({ patient, onClick }) => {
  // Kiểm tra trạng thái đã khám hay chưa
  const hasExamForm = !!patient?.MaPKB;
  const hasPaid = !!patient?.MaHD;

  // Xác định trạng thái
  const getStatus = () => {
    if (hasPaid) return { text: "Đã thanh toán", className: "status-paid" };
    if (hasExamForm) return { text: "Đã khám - Chờ thanh toán", className: "status-examined" };
    return { text: "Chờ khám", className: "status-waiting" };
  };

  const status = getStatus();

  return (
    <div 
      className={`exam-list-card ${hasExamForm ? 'examined' : 'waiting'} ${hasPaid ? 'paid' : ''}`} 
      onClick={onClick}
    >
      <div className="card-header">
        <span className={`status-badge ${status.className}`}>
          {status.text}
        </span>
        {patient?.MaPKB && (
          <span className="pkb-badge">PKB: {patient.MaPKB}</span>
        )}
      </div>
      
      <div className="card-body">
        <div className="info-grid">
          <div className="info-item">
            <span className="label">Mã BN:</span>
            <span className="value">{patient?.MaBN || "N/A"}</span>
          </div>
          <div className="info-item">
            <span className="label">Họ tên:</span>
            <span className="value highlight">{patient?.HoTen || "N/A"}</span>
          </div>
          <div className="info-item">
            <span className="label">CCCD:</span>
            <span className="value">{patient?.CCCD || "N/A"}</span>
          </div>
          <div className="info-item">
            <span className="label">Giới tính:</span>
            <span className="value">{patient?.GioiTinh || "N/A"}</span>
          </div>
        </div>
        {patient?.DiaChi && (
          <div className="address-row">
            <span className="label">Địa chỉ:</span>
            <span className="value">{patient.DiaChi}</span>
          </div>
        )}
      </div>

      <div className="card-footer">
        {!hasExamForm ? (
          <button className="action-btn primary" onClick={(e) => { e.stopPropagation(); onClick && onClick(); }}>
            🩺 Tạo phiếu khám
          </button>
        ) : !hasPaid ? (
          <button className="action-btn secondary" onClick={(e) => { e.stopPropagation(); onClick && onClick(); }}>
            💰 Xem chi tiết
          </button>
        ) : (
          <button className="action-btn disabled" onClick={(e) => { e.stopPropagation(); onClick && onClick(); }}>
            ✅ Xem chi tiết
          </button>
        )}
      </div>
    </div>
  );
};

export default ExamListCard;
