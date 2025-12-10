import React, { useState } from "react";
import "./SearchPatient.css";
import { searchPatientByCCCD } from "../../api/patientApi";

const SearchPatient = () => {
  const [cccd, setCCCD] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      if (result && result.length > 0) {
        setSearchResult(result[0]); // Lấy bệnh nhân đầu tiên
        console.log("✅ Tìm kiếm thành công:", result[0]);
      } else {
        setError("Không tìm thấy bệnh nhân với CCCD này");
      }
    } catch (err) {
      console.error("❌ Lỗi tìm kiếm:", err);
      setError(err.message || "Lỗi khi tìm kiếm bệnh nhân");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setCCCD("");
    setSearchResult(null);
    setError("");
  };

  return (
    <div className="search-patient-container">
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
        </div>
      )}
    </div>
  );
};

export default SearchPatient;
