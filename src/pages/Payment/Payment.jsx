import React, { useState, useEffect } from "react";
import "./Payment.css";
import { getExamFormsByDate, getExamFormById } from "../../api/medicalExamFormApi";
import { createInvoice } from "../../api/invoiceApi";
import { getThamSo } from "../../api/argumentApi";
import { useToast } from "../../contexts/ToastContext";
import { useBottomSheet } from "../../contexts/BottomSheetContext";
import SideSheet from "../SideSheet/SideSheet";

/**
 * Trang Thanh toán - Hiển thị danh sách phiếu khám bệnh theo ngày
 * Phân biệt đã thanh toán / chưa thanh toán
 * Cho phép thanh toán với lựa chọn lấy/không lấy thuốc
 */
const Payment = () => {
  const { showSuccess, showError, showWarning, showInfo } = useToast();
  const { refreshTriggers, triggerRefresh } = useBottomSheet();

  // State
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [examForms, setExamForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Payment modal state
  const [selectedExamForm, setSelectedExamForm] = useState(null);
  const [examFormDetail, setExamFormDetail] = useState(null);
  const [sideSheetOpen, setSideSheetOpen] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [takeMedicine, setTakeMedicine] = useState(true); // Mặc định lấy thuốc
  const [tienKham, setTienKham] = useState(0); // Tiền khám từ tham số hệ thống

  // Load tiền khám từ tham số hệ thống
  useEffect(() => {
    const loadThamSo = async () => {
      try {
        const thamSo = await getThamSo();
        setTienKham(thamSo.TienKham || 0);
      } catch (err) {
        console.error("Lỗi khi lấy tham số:", err);
        setTienKham(30000); // Giá mặc định
      }
    };
    loadThamSo();
  }, []);

  // Load danh sách phiếu khám
  useEffect(() => {
    fetchExamForms();
  }, [selectedDate, refreshTriggers.examForms, refreshTriggers.invoices]);

  const fetchExamForms = async () => {
    try {
      setLoading(true);
      const data = await getExamFormsByDate(selectedDate);
      setExamForms(data || []);
      setError("");
    } catch (err) {
      showError(err.message || "Lỗi khi tải danh sách phiếu khám");
      setError(err.message || "Lỗi khi tải danh sách phiếu khám");
      setExamForms([]);
    } finally {
      setLoading(false);
    }
  };

  // Mở chi tiết phiếu khám để thanh toán
  const handleSelectExamForm = async (examForm) => {
    setSelectedExamForm(examForm);
    setTakeMedicine(true); // Reset về mặc định
    
    // Load chi tiết phiếu khám
    try {
      const detail = await getExamFormById(examForm.MaPKB);
      setExamFormDetail(detail);
      setSideSheetOpen(true);
    } catch (err) {
      showError("Lỗi khi tải chi tiết phiếu khám");
    }
  };

  // Xử lý thanh toán
  const handlePayment = async () => {
    if (!examFormDetail) return;

    // Kiểm tra đã thanh toán chưa
    if (examFormDetail.MaHD) {
      showWarning("Phiếu khám này đã được thanh toán!");
      return;
    }

    setPaymentLoading(true);
    try {
      const invoiceData = {
        MaPKB: examFormDetail.MaPKB,
        NgayThanhToan: new Date().toISOString().split('T')[0],
        TienKham: tienKham,
        // Nếu lấy thuốc: tính tiền thuốc, không lấy: tiền thuốc = 0
        TienThuoc: takeMedicine ? (examFormDetail.TongTienThuoc || 0) : 0,
      };

      const result = await createInvoice(invoiceData);
      
      const tongTien = invoiceData.TienKham + invoiceData.TienThuoc;
      showSuccess(`Thanh toán thành công! Mã hóa đơn: ${result.MaHD}. Tổng tiền: ${formatCurrency(tongTien)}`);
      
      if (!takeMedicine) {
        showInfo("Đã hoàn thuốc vào kho do bệnh nhân không lấy thuốc.");
      }

      // Refresh danh sách
      triggerRefresh('invoices');
      triggerRefresh('examForms');
      
      // Đóng side sheet
      setSideSheetOpen(false);
      setSelectedExamForm(null);
      setExamFormDetail(null);
    } catch (err) {
      showError(err.message || "Lỗi khi thanh toán");
    } finally {
      setPaymentLoading(false);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount || 0);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  // Thống kê
  const stats = {
    total: examForms.length,
    paid: examForms.filter(e => e.MaHD).length,
    unpaid: examForms.filter(e => !e.MaHD).length,
  };

  return (
    <div className="payment-container">
      <div className="payment-header">
        <h2>💰 Thanh toán</h2>
        <div className="date-filter">
          <input 
            type="date" 
            value={selectedDate} 
            onChange={(e) => setSelectedDate(e.target.value)}
            className="date-picker"
          />
        </div>
      </div>

      {/* Thống kê */}
      <div className="payment-stats">
        <div className="stat-item total">
          <span className="stat-value">{stats.total}</span>
          <span className="stat-label">Tổng phiếu</span>
        </div>
        <div className="stat-item paid">
          <span className="stat-value">{stats.paid}</span>
          <span className="stat-label">Đã thanh toán</span>
        </div>
        <div className="stat-item unpaid">
          <span className="stat-value">{stats.unpaid}</span>
          <span className="stat-label">Chưa thanh toán</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="payment-tabs">
        <button 
          className="tab-btn active" 
          onClick={() => {/* Show all */}}
        >
          Tất cả ({stats.total})
        </button>
      </div>

      {/* Danh sách phiếu khám */}
      <div className="exam-forms-list">
        {loading && <p className="loading-text">Đang tải...</p>}
        {error && <p className="error-text">{error}</p>}
        {!loading && examForms.length === 0 && !error && (
          <p className="empty-text">Không có phiếu khám nào trong ngày {formatDate(selectedDate)}</p>
        )}
        
        {examForms.map((examForm) => (
          <div 
            key={examForm.MaPKB} 
            className={`exam-form-card ${examForm.MaHD ? 'paid' : 'unpaid'}`}
            onClick={() => handleSelectExamForm(examForm)}
          >
            <div className="card-header">
              <span className="pkb-code">{examForm.MaPKB}</span>
              <span className={`status-badge ${examForm.MaHD ? 'paid' : 'unpaid'}`}>
                {examForm.MaHD ? '✅ Đã thanh toán' : '⏳ Chưa thanh toán'}
              </span>
            </div>
            <div className="card-body">
              <div className="info-row">
                <span className="label">Bệnh nhân:</span>
                <span className="value">{examForm.HoTen}</span>
              </div>
              <div className="info-row">
                <span className="label">CCCD:</span>
                <span className="value">{examForm.CCCD}</span>
              </div>
              <div className="info-row">
                <span className="label">Triệu chứng:</span>
                <span className="value">{examForm.TrieuChung || "Không có"}</span>
              </div>
            </div>
            <div className="card-footer">
              <span className="total-amount">
                Tiền thuốc: {formatCurrency(examForm.TongTienThuoc)}
              </span>
              {!examForm.MaHD && (
                <button className="pay-btn" onClick={(e) => { e.stopPropagation(); handleSelectExamForm(examForm); }}>
                  Thanh toán
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Side Sheet - Chi tiết thanh toán */}
      <SideSheet isOpen={sideSheetOpen} onClose={() => setSideSheetOpen(false)}>
        {examFormDetail && (
          <div className="payment-detail">
            <h3>📋 Chi tiết thanh toán</h3>
            
            {/* Thông tin phiếu khám */}
            <div className="detail-section">
              <h4>Thông tin phiếu khám</h4>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="label">Mã PKB:</span>
                  <span className="value">{examFormDetail.MaPKB}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Ngày khám:</span>
                  <span className="value">{formatDate(examFormDetail.NgayKham)}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Bệnh nhân:</span>
                  <span className="value">{examFormDetail.HoTen}</span>
                </div>
                <div className="detail-item">
                  <span className="label">CCCD:</span>
                  <span className="value">{examFormDetail.CCCD}</span>
                </div>
              </div>
              <div className="symptom-box">
                <span className="label">Triệu chứng:</span>
                <p>{examFormDetail.TrieuChung || "Không có"}</p>
              </div>
            </div>

            {/* Danh sách bệnh */}
            {examFormDetail.CT_Benh && examFormDetail.CT_Benh.length > 0 && (
              <div className="detail-section">
                <h4>Chẩn đoán</h4>
                <ul className="disease-list">
                  {examFormDetail.CT_Benh.map((benh, idx) => (
                    <li key={idx}>{benh.TenBenh || benh}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Danh sách thuốc */}
            {examFormDetail.CT_Thuoc && examFormDetail.CT_Thuoc.length > 0 && (
              <div className="detail-section">
                <h4>Đơn thuốc</h4>
                <table className="medicine-table">
                  <thead>
                    <tr>
                      <th>Thuốc</th>
                      <th>SL</th>
                      <th>Đơn giá</th>
                      <th>Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {examFormDetail.CT_Thuoc.map((thuoc, idx) => (
                      <tr key={idx}>
                        <td>{thuoc.TenThuoc || thuoc.MaThuoc}</td>
                        <td>{thuoc.SoLuong}</td>
                        <td>{formatCurrency(thuoc.DonGiaBan)}</td>
                        <td>{formatCurrency(thuoc.ThanhTien || thuoc.SoLuong * thuoc.DonGiaBan)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Đã thanh toán */}
            {examFormDetail.MaHD ? (
              <div className="paid-notice">
                <div className="paid-icon">✅</div>
                <p>Phiếu khám này đã được thanh toán</p>
                <p className="invoice-code">Mã hóa đơn: {examFormDetail.MaHD}</p>
              </div>
            ) : (
              <>
                {/* Lựa chọn lấy thuốc */}
                <div className="detail-section medicine-option">
                  <h4>Lựa chọn lấy thuốc</h4>
                  <div className="option-buttons">
                    <button 
                      className={`option-btn ${takeMedicine ? 'active' : ''}`}
                      onClick={() => setTakeMedicine(true)}
                    >
                      💊 Lấy thuốc
                    </button>
                    <button 
                      className={`option-btn ${!takeMedicine ? 'active warning' : ''}`}
                      onClick={() => setTakeMedicine(false)}
                    >
                      ❌ Không lấy thuốc
                    </button>
                  </div>
                  {!takeMedicine && (
                    <p className="warning-text">
                      ⚠️ Nếu không lấy thuốc, thuốc sẽ được hoàn lại vào kho và không tính tiền thuốc.
                    </p>
                  )}
                </div>

                {/* Tổng tiền */}
                <div className="payment-summary">
                  <div className="summary-row">
                    <span>Tiền khám:</span>
                    <span>{formatCurrency(tienKham)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Tiền thuốc:</span>
                    <span className={!takeMedicine ? 'crossed' : ''}>
                      {formatCurrency(takeMedicine ? examFormDetail.TongTienThuoc : 0)}
                    </span>
                  </div>
                  <div className="summary-row total">
                    <span>Tổng cộng:</span>
                    <span>
                      {formatCurrency(tienKham + (takeMedicine ? (examFormDetail.TongTienThuoc || 0) : 0))}
                    </span>
                  </div>
                </div>

                {/* Nút thanh toán */}
                <div className="payment-actions">
                  <button 
                    className="btn-cancel"
                    onClick={() => setSideSheetOpen(false)}
                    disabled={paymentLoading}
                  >
                    Hủy
                  </button>
                  <button 
                    className="btn-pay"
                    onClick={handlePayment}
                    disabled={paymentLoading}
                  >
                    {paymentLoading ? "Đang xử lý..." : "💳 Thanh toán"}
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </SideSheet>
    </div>
  );
};

export default Payment;
