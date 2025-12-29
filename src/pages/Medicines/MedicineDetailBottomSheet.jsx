import React from "react";
import BottomSheet from "../BottomSheet/BottomSheet";
import PermissionGuard from "../../components/PermissionGuard";
import "./MedicineDetailBottomSheet.css";

const MedicineDetailBottomSheet = ({ isOpen, medicine, onClose, onEdit, onDelete }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount || 0);
  };

  if (!medicine) return null;

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <div className="medicine-detail-bottom-sheet">
        <div className="medicine-detail-header">
          <h3>Chi tiết loại thuốc</h3>
          <button className="btn-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="medicine-detail-body" >
          <div className="detail-row">
            <span className="detail-label">Mã thuốc:</span>
            <span className="detail-value">{medicine.MaThuoc}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Tên thuốc:</span>
            <span className="detail-value">{medicine.TenThuoc}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Đơn vị tính:</span>
            <span className="detail-value">{medicine.TenDVT || "N/A"}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Cách dùng:</span>
            <span className="detail-value">{medicine.TenCachDung || "N/A"}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Giá bán:</span>
            <span className="detail-value">{formatCurrency(medicine.GiaBan)}</span>
          </div>

          {medicine.CongDung && (
            <div className="detail-row full-width">
              <span className="detail-label">Công dụng:</span>
              <span className="detail-value">{medicine.CongDung}</span>
            </div>
          )}

          {medicine.TacDungPhu && (
            <div className="detail-row full-width">
              <span className="detail-label">Tác dụng phụ:</span>
              <span className="detail-value">{medicine.TacDungPhu}</span>
            </div>
          )}

          {medicine.LoThuoc && medicine.LoThuoc.length > 0 && (
            <div className="detail-row full-width batches-section">
              <span className="detail-label">📦 Danh sách các lô thuốc:</span>
              <div className="batches-container">
                {medicine.LoThuoc.map((batch) => (
                  <div key={batch.MaLo} className="batch-card">
                    <div className="batch-card-header">
                      <span className="batch-code">Lô: <strong>{batch.MaLo}</strong></span>
                    </div>
                    <div className="batch-card-body">
                      <div className="batch-info-item">
                        <span className="batch-info-label">Số lượng tồn:</span>
                        <span className="batch-info-value">{batch.SoLuongTon}</span>
                      </div>
                      <div className="batch-info-item">
                        <span className="batch-info-label">Giá bán:</span>
                        <span className="batch-info-value">{formatCurrency(batch.GiaBan)}</span>
                      </div>
                      <div className="batch-info-item">
                        <span className="batch-info-label">Hạn sử dụng:</span>
                        <span className="batch-info-value">{new Date(batch.HanSuDung).toLocaleDateString('vi-VN')}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(!medicine.LoThuoc || medicine.LoThuoc.length === 0) && (
            <div className="detail-row full-width">
              <span className="detail-label">📦 Lô thuốc:</span>
              <span className="detail-value">Chưa có lô thuốc nào</span>
            </div>
          )}

          <div className="detail-actions">
            <PermissionGuard feature="medicine-edit" hide>
              <button 
                className="btn-edit" 
                onClick={onEdit}
                data-feature="medicine-edit"
              >
                Chỉnh sửa
              </button>
            </PermissionGuard>
            <PermissionGuard feature="medicine-delete" hide>
              <button 
                className="btn-delete" 
                onClick={onDelete}
                data-feature="medicine-delete"
              >
                Xóa
              </button>
            </PermissionGuard>
          </div>
        </div>
      </div>
    </BottomSheet>
  );
};

export default MedicineDetailBottomSheet;
