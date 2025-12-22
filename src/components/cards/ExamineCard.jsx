import React from "react";
import "./ExamineCard.css";

const ExamineCard = ({ examForm, onClick }) => {
  // Format currency to VND
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount || 0);
  };

  // Format date to dd/MM/yyyy
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  return (
    <div className="appointment-card" onClick={onClick}>
      <div className="info">
        <div className="key">
          <p>Mã PKB:</p>
          <p>Bệnh nhân:</p>
          <p>CCCD:</p>
          <p>Ngày khám:</p>
        </div>
        <div className="value">
          <p>{examForm?.MaPKB || "N/A"}</p>
          <p>{examForm?.HoTen || "N/A"}</p>
          <p>{examForm?.CCCD || "N/A"}</p>
          <p>{formatDate(examForm?.NgayKham)}</p>
        </div>
      </div>
      <div className="exam-footer">
        <p className="exam-symptoms">
          <strong>Triệu chứng:</strong> {examForm?.TrieuChung || "Không có"}
        </p>
        <p className="exam-total">
          <strong>Tổng tiền:</strong> {formatCurrency(examForm?.TongTienThuoc)}
        </p>
      </div>
      <button className="detail-btn" onClick={(e) => { e.stopPropagation(); onClick && onClick(); }}>
        Chi tiết
      </button>
    </div>
  );
};

export default ExamineCard;
