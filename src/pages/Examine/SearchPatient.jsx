import React, { useState } from "react";
import "./SearchPatient.css";
import { searchPatientByCCCD } from "../../api/patientApi";
import { getExamFormById } from "../../api/medicalExamFormApi";
import { useToast } from "../../contexts/ToastContext";

const SearchPatient = () => {
  const [cccd, setCCCD] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expandedExamForm, setExpandedExamForm] = useState(null);
  const [examFormDetail, setExamFormDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const { showSuccess, showError } = useToast();

  const handleSearch = async (e) => {
    e.preventDefault();
    setError("");
    setSearchResult(null);

    if (!cccd.trim()) {
      setError("Vui lòng nhập số CCCD");
      return;
    }

    setLoading(true);
    try {
      const result = await searchPatientByCCCD(cccd);
      
      // Handle 404 - không tìm thấy bệnh nhân
      if (result === null) {
        setError("Không tìm thấy bệnh nhân");
        showError("Không tìm thấy bệnh nhân");
        setLoading(false);
        return;
      }
      
      // Handle both array and object responses
      let patient = null;
      if (Array.isArray(result) && result.length > 0) {
        patient = result[0]; // Array response
      } else if (result && typeof result === 'object' && result.MaBN) {
        patient = result; // Single object response
      }

      if (patient) {
        setSearchResult(patient);
        showSuccess(`Tìm thấy bệnh nhân: ${patient.HoTen}`);
      } else {
        setError("Không tìm thấy bệnh nhân");
        showError("Không tìm thấy bệnh nhân");
      }
    } catch (err) {
      showError(err.message || "Lỗi khi tìm kiếm bệnh nhân");
      setError(err.message || "Lỗi khi tìm kiếm bệnh nhân");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setCCCD("");
    setSearchResult(null);
    setError("");
    setExpandedExamForm(null);
    setExamFormDetail(null);
  };

  const handleSelectExamForm = async (maPKB) => {
    // Toggle expand/collapse
    if (expandedExamForm === maPKB) {
      setExpandedExamForm(null);
      setExamFormDetail(null);
      return;
    }

    // Load exam form detail
    setExpandedExamForm(maPKB);
    setDetailLoading(true);
    try {
      const detail = await getExamFormById(maPKB);
      setExamFormDetail(detail);
    } catch (err) {
      showError(err.message || "Lỗi khi tải chi tiết phiếu khám");
      setExamFormDetail(null);
    } finally {
      setDetailLoading(false);
    }
  };

  return (
    <div className="search-patient-container" style={{maxHeight: '80vh', overflowY: 'auto'}}>
      <h2 className="search-title">🔍 Tra cứu thông tin bệnh nhân</h2>
      
      <form className="search-form" onSubmit={handleSearch}>
        <div className="search-input-group">
          <label htmlFor="cccd">Nhập số CCCD:</label>
          <input
            type="text"
            id="cccd"
            placeholder="Ví dụ: 012345678901"
            value={cccd}
            onChange={(e) => setCCCD(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="search-buttons">
          <button
            type="submit"
            className="search-btn"
            disabled={loading}
          >
            {loading ? "Đang tìm kiếm..." : "Tìm kiếm"}
          </button>
          <button
            type="button"
            className="reset-btn"
            onClick={handleReset}
            disabled={loading}
          >
            Xóa
          </button>
        </div>
      </form>

      {error && (
        <div className="error-message">
          ⚠️ {error}
        </div>
      )}

      {searchResult && (
        <div className="search-result">
          <h3>📋 Thông tin bệnh nhân</h3>
          <div className="result-info">
            <div className="info-row">
              <span className="label">Mã bệnh nhân:</span>
              <span className="value">{searchResult.MaBN}</span>
            </div>
            <div className="info-row">
              <span className="label">Họ tên:</span>
              <span className="value">{searchResult.HoTen}</span>
            </div>
            <div className="info-row">
              <span className="label">CCCD:</span>
              <span className="value">{searchResult.CCCD}</span>
            </div>
            <div className="info-row">
              <span className="label">Giới tính:</span>
              <span className="value">{searchResult.GioiTinh}</span>
            </div>
            <div className="info-row">
              <span className="label">Năm sinh:</span>
              <span className="value">{searchResult.NamSinh}</span>
            </div>
            <div className="info-row">
              <span className="label">Địa chỉ:</span>
              <span className="value">{searchResult.DiaChi}</span>
            </div>
            <div className="info-row">
              <span className="label">Số điện thoại:</span>
              <span className="value">{searchResult.SDT}</span>
            </div>
          </div>

          {/* Hiển thị lịch sử phiếu khám nếu có */}
          {searchResult.PhieuKhamBenh && searchResult.PhieuKhamBenh.length > 0 && (
            <div className="exam-history-section">
              <h4>📋 Lịch sử khám bệnh ({searchResult.PhieuKhamBenh.length})</h4>
              <div className="exam-history-list">
                {searchResult.PhieuKhamBenh.map((phieu) => (
                  <div key={phieu.MaPKB}>
                    <div 
                      className="exam-history-item clickable"
                      onClick={() => handleSelectExamForm(phieu.MaPKB)}
                    >
                      <div className="info-row">
                        <span className="label">Mã phiếu:</span>
                        <span className="value">{phieu.MaPKB}</span>
                      </div>
                      <div className="info-row">
                        <span className="label">Ngày khám:</span>
                        <span className="value">
                          {new Date(phieu.NgayKham).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                      <div className="info-row">
                        <span className="label">Triệu chứng:</span>
                        <span className="value">{phieu.TrieuChung || 'N/A'}</span>
                      </div>
                      {phieu.Benh && phieu.Benh.length > 0 && (
                        <div className="info-row">
                          <span className="label">Bệnh chẩn đoán:</span>
                          <span className="value">
                            {phieu.Benh.join(', ')}
                          </span>
                        </div>
                      )}
                      <div className="info-row view-detail">
                        {expandedExamForm === phieu.MaPKB ? '▼ Ẩn chi tiết' : '▶ Xem chi tiết'}
                      </div>
                    </div>

                    {/* Dropdown chi tiết */}
                    {expandedExamForm === phieu.MaPKB && (
                      <div className="exam-detail-expanded">
                        {detailLoading ? (
                          <p style={{ textAlign: 'center', color: '#999' }}>Đang tải chi tiết...</p>
                        ) : examFormDetail ? (
                          <div className="detail-content">
                            <div className="detail-section">
                              <h5>Thông tin khám bệnh</h5>
                              <div className="detail-row">
                                <span className="label">Mã PKB:</span>
                                <span className="value">{examFormDetail.MaPKB}</span>
                              </div>
                              <div className="detail-row">
                                <span className="label">Mã BN:</span>
                                <span className="value">{examFormDetail.MaBN}</span>
                              </div>
                              <div className="detail-row">
                                <span className="label">Ngày khám:</span>
                                <span className="value">
                                  {new Date(examFormDetail.NgayKham).toLocaleDateString('vi-VN')}
                                </span>
                              </div>
                              <div className="detail-row">
                                <span className="label">Triệu chứng:</span>
                                <span className="value">{examFormDetail.TrieuChung || 'N/A'}</span>
                              </div>
                            </div>

                            {examFormDetail.CT_Benh && examFormDetail.CT_Benh.length > 0 && (
                              <div className="detail-section">
                                <h5>Bệnh chẩn đoán</h5>
                                <div className="disease-list">
                                  {examFormDetail.CT_Benh.map((benh, idx) => (
                                    <div key={idx} className="disease-item">
                                      {benh.TenBenh} ({benh.MaBenh})
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {examFormDetail.CT_Thuoc && examFormDetail.CT_Thuoc.length > 0 && (
                              <div className="detail-section">
                                <h5>Thuốc được kê đơn</h5>
                                <div className="medicine-list">
                                  {examFormDetail.CT_Thuoc.map((thuoc, idx) => (
                                    <div key={idx} className="medicine-item">
                                      <div className="medicine-name">{thuoc.TenThuoc}</div>
                                      <div className="medicine-info">
                                        <span>SL: {thuoc.SoLuong}</span>
                                        <span>Giá: {thuoc.DonGiaBan?.toLocaleString('vi-VN')} đ</span>
                                        <span>Thành tiền: {(thuoc.SoLuong * (thuoc.DonGiaBan || 0)).toLocaleString('vi-VN')} đ</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                                <div className="total-medicine">
                                  Tổng tiền thuốc: {examFormDetail.TongTienThuoc?.toLocaleString('vi-VN')} đ
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <p style={{ textAlign: 'center', color: '#f44' }}>Lỗi tải chi tiết phiếu khám</p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchPatient;
