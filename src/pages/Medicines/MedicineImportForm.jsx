import React, { useState, useEffect } from "react";
import { createMedicine, getAllMedicines, searchMedicines } from "../../api/medicineApi";
import { createMedicineImport } from "../../api/medicineImportApi";
import { getAllUnits } from "../../api/unitApi";
import { getAllUsages } from "../../api/usageApi";
import { getThamSo } from "../../api/argumentApi";
import { useBottomSheet } from "../../contexts/BottomSheetContext";
import { useToast } from "../../contexts/ToastContext";
import "./MedicineImportForm.css";

const MedicineImportForm = ({ onSubmit, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1); // 1: Chọn loại thuốc, 2: Nhập thông tin phiếu nhập, 3: Xác nhận
  const [isNewMedicine, setIsNewMedicine] = useState(null); // null: chưa chọn, true: thuốc mới, false: thuốc cũ
  
  // Data from API
  const [medicines, setMedicines] = useState([]);
  const [units, setUnits] = useState([]);
  const [usages, setUsages] = useState([]);
  const [thamSo, setThamSo] = useState(null); // Tham số hệ thống
  
  // Search state
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [noResultsFound, setNoResultsFound] = useState(false);
  
  // Selected medicine (for existing medicine)
  const [selectedMedicineId, setSelectedMedicineId] = useState("");
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  
  // New medicine form data
  const [newMedicineData, setNewMedicineData] = useState({
    TenThuoc: "",
    CongDung: "",
    MaCachDung: "",
    MaDVT: "",
    TacDungPhu: "",
  });
  
  // Import form data
  const [importData, setImportData] = useState({
    GiaNhap: "",
    NgayNhap: new Date().toISOString().split('T')[0],
    SoLuongNhap: "",
    HanSuDung: "",
  });

  const { refreshTriggers, triggerRefresh } = useBottomSheet();
  const { showError, showSuccess } = useToast();

  // Load data on mount and when refreshTriggers.medicines changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [medicinesData, unitsData, usagesData, thamSoData] = await Promise.all([
          getAllMedicines(),
          getAllUnits(),
          getAllUsages(),
          getThamSo()
        ]);
        setMedicines(medicinesData);
        setUnits(unitsData);
        setUsages(usagesData);
        setThamSo(thamSoData);
      } catch (err) {
        showError("Lỗi khi tải dữ liệu");
      }
    };
    fetchData();
  }, [refreshTriggers.medicines]);

  // When selecting an existing medicine
  useEffect(() => {
    if (selectedMedicineId) {
      const medicine = searchResults.length > 0 
        ? searchResults.find(m => m.MaThuoc === selectedMedicineId)
        : medicines.find(m => m.MaThuoc === selectedMedicineId);
      setSelectedMedicine(medicine || null);
    } else {
      setSelectedMedicine(null);
    }
  }, [selectedMedicineId, medicines, searchResults]);

  const handleMedicineTypeSelect = (isNew) => {
    setIsNewMedicine(isNew);
    setError("");
    setSearchInput("");
    setSearchResults([]);
    setHasSearched(false);
    setNoResultsFound(false);
    setSelectedMedicineId("");
    setSelectedMedicine(null);
  };

  const handleSearchMedicine = async () => {
    if (!searchInput.trim()) {
      setError("Vui lòng nhập tên thuốc để tìm kiếm");
      return;
    }

    try {
      setError("");
      setLoading(true);
      const results = await searchMedicines(searchInput.trim(), "");
      setSearchResults(results);
      setHasSearched(true);
      setNoResultsFound(results.length === 0);
    } catch (err) {
      setSearchResults([]);
      setHasSearched(true);
      setNoResultsFound(true);
      setError("");
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setSearchResults([]);
    setHasSearched(false);
    setNoResultsFound(false);
    setSelectedMedicineId("");
    setSelectedMedicine(null);
  };

  const handleCreateNewFromSearch = () => {
    setIsNewMedicine(true);
    setNewMedicineData({ 
      ...newMedicineData, 
      TenThuoc: searchInput 
    });
  };

  const handleNextStep = () => {
    if (step === 1) {
      // Validate step 1
      if (isNewMedicine === null) {
        setError("Vui lòng chọn loại thuốc");
        return;
      }
      
      if (isNewMedicine) {
        // New medicine - validate new medicine data
        if (!newMedicineData.TenThuoc || newMedicineData.TenThuoc.trim() === "") {
          setError("Tên thuốc không được để trống");
          return;
        }

        // Check if medicine name already exists
        const existingMedicine = medicines.find(
          m => m.TenThuoc.toLowerCase() === newMedicineData.TenThuoc.toLowerCase()
        );
        
        if (existingMedicine) {
          setError(
            `Tên thuốc "${newMedicineData.TenThuoc}" đã tồn tại (Mã: ${existingMedicine.MaThuoc}). ` +
            `Vui lòng quay lại bước 1 để đổi tên hoặc chọn thuốc đã có.`
          );
          return;
        }
      } else {
        // Existing medicine - validate selection
        if (!selectedMedicineId) {
          setError("Vui lòng chọn thuốc");
          return;
        }
      }
      setError("");
      setStep(2);
    } else if (step === 2) {
      // Validate step 2 - Import data
      if (!importData.SoLuongNhap || importData.SoLuongNhap <= 0) {
        setError("Số lượng nhập phải lớn hơn 0");
        return;
      }
      if (!importData.GiaNhap || importData.GiaNhap <= 0) {
        setError("Giá nhập phải lớn hơn 0");
        return;
      }
      if (!importData.NgayNhap) {
        setError("Vui lòng chọn ngày nhập");
        return;
      }
      if (!importData.HanSuDung) {
        setError("Vui lòng chọn hạn sử dụng");
        return;
      }
      setError("");
      setStep(3);
    }
  };

  const handlePrevStep = () => {
    setError("");
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleConfirmSubmit = async () => {
    setError("");
    setLoading(true);

    try {
      let medicineId = selectedMedicineId;

      // If new medicine, create it first
      if (isNewMedicine) {
        try {
          const newMedicine = await createMedicine(newMedicineData);
          medicineId = newMedicine.MaThuoc;
          showSuccess(`Đã tạo loại thuốc "${newMedicineData.TenThuoc}" thành công!`);
          
          // Trigger refresh to update medicines list in other parts of the UI
          triggerRefresh('medicines');
        } catch (createErr) {
          // Nếu lỗi 409 (tên thuốc đã tồn tại), hỏi người dùng có muốn dùng thuốc cũ không
          if (createErr.message && createErr.message.includes("đã tồn tại")) {
            // Tìm thuốc đó trong danh sách hiện tại
            const existingMedicine = medicines.find(
              m => m.TenThuoc.toLowerCase() === newMedicineData.TenThuoc.toLowerCase()
            );
            
            if (existingMedicine) {
              const useExisting = window.confirm(
                `Loại thuốc "${newMedicineData.TenThuoc}" đã tồn tại trong hệ thống.\n\nBạn có muốn sử dụng loại thuốc hiện có này không?`
              );
              
              if (useExisting) {
                medicineId = existingMedicine.MaThuoc;
                showSuccess(`Sử dụng loại thuốc hiện có: "${existingMedicine.TenThuoc}"`);
              } else {
                setError("Vui lòng quay lại bước 1 để đổi tên thuốc hoặc chọn thuốc khác");
                setLoading(false);
                return;
              }
            } else {
              throw createErr;
            }
          } else {
            throw createErr;
          }
        }
      }

      // Create medicine import
      await createMedicineImport({
        MaThuoc: medicineId,
        GiaNhap: Number(importData.GiaNhap),
        NgayNhap: importData.NgayNhap,
        SoLuongNhap: Number(importData.SoLuongNhap),
        HanSuDung: importData.HanSuDung,
      });

      showSuccess("Nhập thuốc thành công!");
      
      // Trigger refresh to update all UI
      triggerRefresh('medicines');
      
      // Reset form state về trạng thái ban đầu
      setStep(1);
      setIsNewMedicine(null);
      setSearchInput("");
      setSearchResults([]);
      setHasSearched(false);
      setNoResultsFound(false);
      setSelectedMedicineId("");
      setSelectedMedicine(null);
      setNewMedicineData({
        TenThuoc: "",
        CongDung: "",
        MaCachDung: "",
        MaDVT: "",
        TacDungPhu: "",
      });
      setImportData({
        GiaNhap: "",
        NgayNhap: new Date().toISOString().split('T')[0],
        SoLuongNhap: "",
        HanSuDung: "",
      });
      setError("");
      
      // Close form
      onSubmit?.();
    } catch (err) {
      // Xử lý lỗi đặc biệt khi chưa cấu hình tỉ lệ tính đơn giá bán
      if (err.message && err.message.includes("tỷ lệ tính đơn giá bán")) {
        showError("⚠️ Chưa cấu hình tỉ lệ tính đơn giá bán trong hệ thống. Vui lòng liên hệ quản trị viên để cấu hình tham số hệ thống.");
        setError("Chưa cấu hình tỷ lệ tính đơn giá bán. Vui lòng cấu hình tham số hệ thống trước khi nhập thuốc.");
      } else {
        showError(err.message || "Lỗi khi nhập thuốc");
        setError(err.message || "Lỗi khi nhập thuốc");
      }
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount || 0);
  };

  const getUnitName = (maDVT) => {
    const unit = units.find(u => u.MaDVT === maDVT);
    return unit ? unit.TenDVT : "N/A";
  };

  const getUsageName = (maCachDung) => {
    const usage = usages.find(u => u.MaCachDung === maCachDung);
    return usage ? usage.TenCachDung : "N/A";
  };

  // Tính tổng số lượng tồn từ các lô thuốc
  const calculateTotalStock = (medicine) => {
    if (!medicine || !medicine.LoThuoc || medicine.LoThuoc.length === 0) {
      return 0;
    }
    return medicine.LoThuoc.reduce((total, batch) => total + (batch.SoLuongTon || 0), 0);
  };

  // Tính giá bán dự kiến dựa trên giá nhập và tỉ lệ
  const calculateGiaBan = (giaNhap) => {
    if (!thamSo || !thamSo.TiLeTinhDonGiaBan || !giaNhap || giaNhap <= 0) {
      return 0;
    }
    return Math.round(giaNhap * thamSo.TiLeTinhDonGiaBan);
  };

  // Step 1: Select medicine type
  const renderStep1 = () => (
    <div className="import-step">
      <div className="step-header">
        <h4>Bước 1: Chọn loại thuốc</h4>
        <p className="step-description">Thuốc này đã có trong hệ thống hay là thuốc mới?</p>
      </div>

      <div className="medicine-type-selection">
        <button
          type="button"
          className={`type-btn ${isNewMedicine === false ? 'selected' : ''}`}
          onClick={() => handleMedicineTypeSelect(false)}
        >
          <span className="type-icon">📦</span>
          <span className="type-label">Thuốc đã có</span>
          <span className="type-desc">Tìm kiếm và chọn từ danh sách thuốc hiện có</span>
        </button>
        <button
          type="button"
          className={`type-btn ${isNewMedicine === true ? 'selected' : ''}`}
          onClick={() => handleMedicineTypeSelect(true)}
        >
          <span className="type-icon">✨</span>
          <span className="type-label">Thuốc mới</span>
          <span className="type-desc">Thêm loại thuốc mới vào hệ thống</span>
        </button>
      </div>

      {isNewMedicine === false && (
        <div className="existing-medicine-form">
          <div className="form-group">
            <label>Tìm kiếm thuốc *</label>
            <div className="search-input-wrapper">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearchMedicine()}
                placeholder="Nhập tên thuốc cần tìm kiếm..."
                disabled={loading}
              />
              <button
                type="button"
                className="btn-search-medicine"
                onClick={handleSearchMedicine}
                disabled={loading || !searchInput.trim()}
              >
                🔍 Tìm kiếm
              </button>
              {hasSearched && (
                <button
                  type="button"
                  className="btn-clear-search"
                  onClick={handleClearSearch}
                  disabled={loading}
                >
                  ✕ Xóa
                </button>
              )}
            </div>
          </div>

          {hasSearched && noResultsFound && (
            <div className="no-results-section">
              <div className="no-results-message">
                <p className="message-text">Không tìm thấy thuốc nào với tên "<strong>{searchInput}</strong>"</p>
                <p className="message-hint">Bạn có thể tạo loại thuốc mới bằng cách:</p>
                <button
                  type="button"
                  className="btn-create-new-medicine"
                  onClick={handleCreateNewFromSearch}
                >
                  ✨ Tạo loại thuốc mới
                </button>
              </div>
            </div>
          )}

          {hasSearched && !noResultsFound && searchResults.length > 0 && (
            <div className="search-results-section">
              <div className="form-group">
                <label>Kết quả tìm kiếm *</label>
                <select
                  value={selectedMedicineId}
                  onChange={(e) => setSelectedMedicineId(e.target.value)}
                >
                  <option value="">-- Chọn thuốc --</option>
                  {searchResults.map((medicine) => (
                    <option key={medicine.MaThuoc} value={medicine.MaThuoc}>
                      {medicine.TenThuoc} ({medicine.MaThuoc})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {selectedMedicine && (
            <div className="medicine-preview">
              <h5>📋 Thông tin thuốc đã chọn:</h5>
              <div className="preview-grid">
                <div className="preview-item">
                  <span className="preview-label">Mã thuốc:</span>
                  <span className="preview-value">{selectedMedicine.MaThuoc}</span>
                </div>
                <div className="preview-item">
                  <span className="preview-label">Tên thuốc:</span>
                  <span className="preview-value">{selectedMedicine.TenThuoc}</span>
                </div>
                <div className="preview-item">
                  <span className="preview-label">Đơn vị tính:</span>
                  <span className="preview-value">{selectedMedicine.TenDVT || "N/A"}</span>
                </div>
                <div className="preview-item">
                  <span className="preview-label">Cách dùng:</span>
                  <span className="preview-value">{selectedMedicine.TenCachDung || "N/A"}</span>
                </div>
                {selectedMedicine.CongDung && (
                  <div className="preview-item full-width">
                    <span className="preview-label">Công dụng:</span>
                    <span className="preview-value">{selectedMedicine.CongDung}</span>
                  </div>
                )}
                {selectedMedicine.TacDungPhu && (
                  <div className="preview-item full-width">
                    <span className="preview-label">Tác dụng phụ:</span>
                    <span className="preview-value">{selectedMedicine.TacDungPhu}</span>
                  </div>
                )}
                <div className="preview-item">
                  <span className="preview-label">Tồn kho hiện tại:</span>
                  <span className="preview-value">{calculateTotalStock(selectedMedicine)}</span>
                </div>
                <div className="preview-item">
                  <span className="preview-label">Giá bán hiện tại:</span>
                  <span className="preview-value">{formatCurrency(selectedMedicine.GiaBan)}</span>
                </div>

                {selectedMedicine.LoThuoc && selectedMedicine.LoThuoc.length > 0 && (
                  <div className="preview-item full-width batches-section">
                    <span className="preview-label">📦 Các lô thuốc hiện có:</span>
                    <div className="batches-list">
                      {selectedMedicine.LoThuoc.map((batch) => (
                        <div key={batch.MaLo} className="batch-item">
                          <div className="batch-code">Lô: <strong>{batch.MaLo}</strong></div>
                          <div className="batch-detail">
                            <span className="batch-qty">Tồn: {batch.SoLuongTon}</span>
                            <span className="batch-price">Giá: {formatCurrency(batch.GiaBan)}</span>
                            <span className="batch-expiry">HSD: {new Date(batch.HanSuDung).toLocaleDateString('vi-VN')}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {isNewMedicine === true && (
        <div className="new-medicine-form">
          <div className="form-group">
            <label>Tên thuốc *</label>
            <input
              type="text"
              value={newMedicineData.TenThuoc}
              onChange={(e) => setNewMedicineData({ ...newMedicineData, TenThuoc: e.target.value })}
              placeholder="VD: Paracetamol 500mg"
              required
            />
          </div>

          <div className="form-group">
            <label>Công dụng</label>
            <textarea
              rows="2"
              value={newMedicineData.CongDung}
              onChange={(e) => setNewMedicineData({ ...newMedicineData, CongDung: e.target.value })}
              placeholder="VD: Giảm đau, hạ sốt"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Cách dùng</label>
              <select
                value={newMedicineData.MaCachDung}
                onChange={(e) => setNewMedicineData({ ...newMedicineData, MaCachDung: e.target.value })}
              >
                <option value="">-- Chọn cách dùng --</option>
                {usages.map((usage) => (
                  <option key={usage.MaCachDung} value={usage.MaCachDung}>
                    {usage.TenCachDung}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Đơn vị tính</label>
              <select
                value={newMedicineData.MaDVT}
                onChange={(e) => setNewMedicineData({ ...newMedicineData, MaDVT: e.target.value })}
              >
                <option value="">-- Chọn đơn vị tính --</option>
                {units.map((unit) => (
                  <option key={unit.MaDVT} value={unit.MaDVT}>
                    {unit.TenDVT}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Tác dụng phụ</label>
            <textarea
              rows="2"
              value={newMedicineData.TacDungPhu}
              onChange={(e) => setNewMedicineData({ ...newMedicineData, TacDungPhu: e.target.value })}
              placeholder="VD: Buồn nôn, chóng mặt"
            />
          </div>
        </div>
      )}
    </div>
  );

  // Step 2: Import details
  const renderStep2 = () => (
    <div className="import-step">
      <div className="step-header">
        <h4>Bước 2: Thông tin phiếu nhập</h4>
        <p className="step-description">Nhập thông tin chi tiết cho phiếu nhập thuốc</p>
      </div>

      <div className="selected-medicine-info">
        <span className="info-label">Thuốc đang nhập:</span>
        <span className="info-value">
          {isNewMedicine 
            ? `${newMedicineData.TenThuoc} (Thuốc mới)` 
            : `${selectedMedicine?.TenThuoc} (${selectedMedicine?.MaThuoc})`
          }
        </span>
      </div>

      <div className="import-form">
        <div className="form-group">
          <label>Số lượng nhập *</label>
          <input
            type="number"
            min="1"
            value={importData.SoLuongNhap}
            onChange={(e) => setImportData({ ...importData, SoLuongNhap: e.target.value })}
            placeholder="VD: 100"
            required
          />
        </div>

        <div className="form-group">
          <label>Giá nhập (VNĐ) *</label>
          <input
            type="number"
            min="1"
            value={importData.GiaNhap}
            onChange={(e) => setImportData({ ...importData, GiaNhap: e.target.value })}
            placeholder="VD: 50000"
            required
          />
          {thamSo && thamSo.TiLeTinhDonGiaBan && (
            <div className="input-hint">
              <span className="hint-label">Tỉ lệ tính giá bán:</span>
              <span className="hint-value">×{thamSo.TiLeTinhDonGiaBan}</span>
            </div>
          )}
          {importData.GiaNhap > 0 && thamSo && thamSo.TiLeTinhDonGiaBan && (
            <div className="input-hint highlight">
              <span className="hint-label">Giá bán dự kiến:</span>
              <span className="hint-value">{formatCurrency(calculateGiaBan(importData.GiaNhap))}</span>
            </div>
          )}
          {(!thamSo || !thamSo.TiLeTinhDonGiaBan) && (
            <div className="input-hint warning">
              <span className="hint-label">⚠️ Chưa cấu hình tỉ lệ tính đơn giá bán trong hệ thống</span>
            </div>
          )}
        </div>

        <div className="form-group">
          <label>Ngày nhập *</label>
          <input
            type="date"
            value={importData.NgayNhap}
            onChange={(e) => setImportData({ ...importData, NgayNhap: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Hạn sử dụng *</label>
          <input
            type="date"
            value={importData.HanSuDung}
            onChange={(e) => setImportData({ ...importData, HanSuDung: e.target.value })}
            required
          />
        </div>
      </div>
    </div>
  );

  // Step 3: Confirmation
  const renderStep3 = () => (
    <div className="import-step">
      <div className="step-header">
        <h4>Bước 3: Xác nhận thông tin</h4>
        <p className="step-description">Vui lòng kiểm tra lại thông tin trước khi xác nhận</p>
      </div>

      <div className="confirmation-container">
        <div className="confirmation-section">
          <h5>📦 Thông tin thuốc</h5>
          <div className="confirmation-grid">
            {isNewMedicine ? (
              <>
                <div className="confirm-item">
                  <span className="confirm-label">Loại:</span>
                  <span className="confirm-value highlight-new">Thuốc mới</span>
                </div>
                <div className="confirm-item">
                  <span className="confirm-label">Tên thuốc:</span>
                  <span className="confirm-value">{newMedicineData.TenThuoc}</span>
                </div>
                {newMedicineData.CongDung && (
                  <div className="confirm-item">
                    <span className="confirm-label">Công dụng:</span>
                    <span className="confirm-value">{newMedicineData.CongDung}</span>
                  </div>
                )}
                {newMedicineData.MaDVT && (
                  <div className="confirm-item">
                    <span className="confirm-label">Đơn vị tính:</span>
                    <span className="confirm-value">{getUnitName(newMedicineData.MaDVT)}</span>
                  </div>
                )}
                {newMedicineData.MaCachDung && (
                  <div className="confirm-item">
                    <span className="confirm-label">Cách dùng:</span>
                    <span className="confirm-value">{getUsageName(newMedicineData.MaCachDung)}</span>
                  </div>
                )}
                {newMedicineData.TacDungPhu && (
                  <div className="confirm-item">
                    <span className="confirm-label">Tác dụng phụ:</span>
                    <span className="confirm-value">{newMedicineData.TacDungPhu}</span>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="confirm-item">
                  <span className="confirm-label">Loại:</span>
                  <span className="confirm-value highlight-existing">Thuốc đã có</span>
                </div>
                <div className="confirm-item">
                  <span className="confirm-label">Mã thuốc:</span>
                  <span className="confirm-value">{selectedMedicine?.MaThuoc}</span>
                </div>
                <div className="confirm-item">
                  <span className="confirm-label">Tên thuốc:</span>
                  <span className="confirm-value">{selectedMedicine?.TenThuoc}</span>
                </div>
                <div className="confirm-item">
                  <span className="confirm-label">Tồn kho hiện tại:</span>
                  <span className="confirm-value">{calculateTotalStock(selectedMedicine)}</span>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="confirmation-section">
          <h5>📋 Thông tin phiếu nhập</h5>
          <div className="confirmation-grid">
            <div className="confirm-item">
              <span className="confirm-label">Số lượng nhập:</span>
              <span className="confirm-value highlight-qty">{importData.SoLuongNhap}</span>
            </div>
            <div className="confirm-item">
              <span className="confirm-label">Giá nhập:</span>
              <span className="confirm-value highlight-price">{formatCurrency(importData.GiaNhap)}</span>
            </div>
            {thamSo && thamSo.TiLeTinhDonGiaBan && (
              <div className="confirm-item">
                <span className="confirm-label">Giá bán (×{thamSo.TiLeTinhDonGiaBan}):</span>
                <span className="confirm-value highlight-sale-price">
                  {formatCurrency(calculateGiaBan(importData.GiaNhap))}
                </span>
              </div>
            )}
            <div className="confirm-item">
              <span className="confirm-label">Ngày nhập:</span>
              <span className="confirm-value">{new Date(importData.NgayNhap).toLocaleDateString('vi-VN')}</span>
            </div>
            <div className="confirm-item">
              <span className="confirm-label">Hạn sử dụng:</span>
              <span className="confirm-value">{new Date(importData.HanSuDung).toLocaleDateString('vi-VN')}</span>
            </div>
            <div className="confirm-item total">
              <span className="confirm-label">Tổng tiền nhập:</span>
              <span className="confirm-value highlight-total">
                {formatCurrency(importData.GiaNhap * importData.SoLuongNhap)}
              </span>
            </div>
          </div>
        </div>

        {!isNewMedicine && selectedMedicine && (
          <div className="confirmation-section prediction">
            <h5>📊 Dự kiến sau khi nhập</h5>
            <div className="confirmation-grid">
              <div className="confirm-item">
                <span className="confirm-label">Tồn kho hiện tại:</span>
                <span className="confirm-value">{calculateTotalStock(selectedMedicine)}</span>
              </div>
              <div className="confirm-item">
                <span className="confirm-label">Sẽ nhập thêm:</span>
                <span className="confirm-value">{importData.SoLuongNhap}</span>
              </div>
              <div className="confirm-item">
                <span className="confirm-label">Tồn kho mới:</span>
                <span className="confirm-value highlight-new-stock">
                  {calculateTotalStock(selectedMedicine) + Number(importData.SoLuongNhap || 0)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="medicine-import-form-container">
      <div className="medicine-import-form-header">
        <h3>Nhập thuốc</h3>
        <button className="btn-close" onClick={onCancel}>
          ×
        </button>
      </div>

      {/* Progress Steps */}
      <div className="progress-steps">
        <div className={`progress-step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
          <span className="step-number">1</span>
          <span className="step-text">Chọn thuốc</span>
        </div>
        <div className="progress-line" />
        <div className={`progress-step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
          <span className="step-number">2</span>
          <span className="step-text">Thông tin nhập</span>
        </div>
        <div className="progress-line" />
        <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
          <span className="step-number">3</span>
          <span className="step-text">Xác nhận</span>
        </div>
      </div>

      <div className="medicine-import-form-body">
        {error && <div className="alert alert-error">{error}</div>}

        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}

        <div className="form-actions">
          {step > 1 && (
            <button type="button" className="btn-prev" onClick={handlePrevStep}>
              ← Quay lại
            </button>
          )}
          
          {step < 3 ? (
            <button type="button" className="btn-next" onClick={handleNextStep}>
              Tiếp tục →
            </button>
          ) : (
            <button 
              type="button" 
              className="btn-confirm" 
              onClick={handleConfirmSubmit}
              disabled={loading}
            >
              {loading ? "Đang xử lý..." : "✓ Xác nhận nhập thuốc"}
            </button>
          )}
          
          <button type="button" className="btn-cancel" onClick={onCancel}>
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
};

export default MedicineImportForm;
