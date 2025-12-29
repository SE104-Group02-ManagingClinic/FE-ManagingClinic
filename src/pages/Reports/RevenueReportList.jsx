import React, { useState, useEffect } from "react";
import { useToast } from "../../contexts/ToastContext";
import {
  getRevenueReports,
  createRevenueReport,
  getRevenueReportDetail,
  updateRevenueReport,
  deleteRevenueReport,
  searchRevenueReports,
} from "../../api/revenueReportApi";
import SideSheet from "../SideSheet/SideSheet";
import DeleteConfirmModal from "../../components/DeleteConfirmModal";
import PermissionGuard from "../../components/PermissionGuard";
import { useAuth } from "../../contexts/AuthContext";

const RevenueReportList = () => {
  const { checkFeature } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [filterMonth, setFilterMonth] = useState("");
  const [filterYear, setFilterYear] = useState("");

  // Detail view state
  const [selectedReport, setSelectedReport] = useState(null);
  const [reportDetail, setReportDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [sideSheetOpen, setSideSheetOpen] = useState(false);

  // Delete confirm state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [reportToDelete, setReportToDelete] = useState(null);

  const { showSuccess, showError } = useToast();

  // Generate year options (last 10 years to current year)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 11 }, (_, i) => currentYear - 10 + i);

  // Month options
  const monthOptions = [
    { value: 1, label: "Tháng 1" },
    { value: 2, label: "Tháng 2" },
    { value: 3, label: "Tháng 3" },
    { value: 4, label: "Tháng 4" },
    { value: 5, label: "Tháng 5" },
    { value: 6, label: "Tháng 6" },
    { value: 7, label: "Tháng 7" },
    { value: 8, label: "Tháng 8" },
    { value: 9, label: "Tháng 9" },
    { value: 10, label: "Tháng 10" },
    { value: 11, label: "Tháng 11" },
    { value: 12, label: "Tháng 12" },
  ];

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      let data;
      if (filterMonth || filterYear) {
        data = await searchRevenueReports(
          filterMonth ? parseInt(filterMonth) : null,
          filterYear ? parseInt(filterYear) : null
        );
      } else {
        data = await getRevenueReports();
      }
      setReports(data || []);
    } catch (error) {
      showError(error.message || "Lỗi khi tải danh sách báo cáo doanh thu");
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [filterMonth, filterYear]);

  const handleCreateReport = async () => {
    try {
      setCreating(true);
      await createRevenueReport(selectedMonth, selectedYear);
      showSuccess(`Tạo báo cáo doanh thu tháng ${selectedMonth}/${selectedYear} thành công!`);
      fetchReports();
    } catch (error) {
      showError(error.message || "Lỗi khi tạo báo cáo doanh thu");
    } finally {
      setCreating(false);
    }
  };

  const handleViewDetail = async (report) => {
    try {
      setSelectedReport(report);
      setDetailLoading(true);
      setSideSheetOpen(true);
      const detail = await getRevenueReportDetail(report.MaBCDT);
      // Normalize field names from backend (uppercase to camelCase)
      const normalizedDetail = {
        ...detail,
        Thang: detail.Thang || detail.THANG,
        Nam: detail.Nam || detail.NAM,
        ChiTiet: (detail.ChiTiet || []).map(item => ({
          Ngay: item.Ngay,
          SoBenhNhan: item.SoBenhNhan,
          DoanhThu: item.DoanhThu || item.DOANHTHU,
          TyLe: typeof item.TyLe === 'string' ? parseFloat(item.TyLe) / 100 : item.TyLe
        }))
      };
      setReportDetail(normalizedDetail);
    } catch (error) {
      showError(error.message || "Lỗi khi tải chi tiết báo cáo doanh thu");
    } finally {
      setDetailLoading(false);
    }
  };

  const handleRefreshReport = async (report) => {
    try {
      await updateRevenueReport(report.MaBCDT);
      showSuccess("Cập nhật báo cáo doanh thu thành công!");
      fetchReports();
      // Refresh detail if viewing
      if (selectedReport?.MaBCDT === report.MaBCDT) {
        const detail = await getRevenueReportDetail(report.MaBCDT);
        // Normalize field names from backend (uppercase to camelCase)
        const normalizedDetail = {
          ...detail,
          Thang: detail.Thang || detail.THANG,
          Nam: detail.Nam || detail.NAM,
          ChiTiet: (detail.ChiTiet || []).map(item => ({
            Ngay: item.Ngay,
            SoBenhNhan: item.SoBenhNhan,
            DoanhThu: item.DoanhThu || item.DOANHTHU,
            TyLe: typeof item.TyLe === 'string' ? parseFloat(item.TyLe) / 100 : item.TyLe
          }))
        };
        setReportDetail(normalizedDetail);
      }
    } catch (error) {
      showError(error.message || "Lỗi khi cập nhật báo cáo doanh thu");
    }
  };

  const handleDeleteClick = (report) => {
    setReportToDelete(report);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!reportToDelete) return;
    try {
      await deleteRevenueReport(reportToDelete.MaBCDT);
      showSuccess("Xóa báo cáo doanh thu thành công!");
      setDeleteModalOpen(false);
      setReportToDelete(null);
      if (selectedReport?.MaBCDT === reportToDelete.MaBCDT) {
        setSideSheetOpen(false);
        setSelectedReport(null);
        setReportDetail(null);
      }
      fetchReports();
    } catch (error) {
      showError(error.message || "Lỗi khi xóa báo cáo doanh thu");
    }
  };

  const closeSideSheet = () => {
    setSideSheetOpen(false);
    setSelectedReport(null);
    setReportDetail(null);
  };

  // Format currency
  const formatCurrency = (value) => {
    if (value === null || value === undefined) return "0 ₫";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  return (
    <>
      {/* Create Report Section */}
      <PermissionGuard feature="report-revenue" hide>
      <div className="create-report-section" data-feature="report-revenue">
        <h3>📝 Tạo báo cáo doanh thu mới</h3>
        <div className="create-report-form">
          <div className="form-group">
            <label>Tháng</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            >
              {monthOptions.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Năm</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            >
              {yearOptions.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
          <button
            className="btn-create-report"
            onClick={handleCreateReport}
            disabled={creating}
          >
            {creating ? "Đang tạo..." : "➕ Tạo báo cáo"}
          </button>
        </div>
      </div>
      </PermissionGuard>

      {/* Reports List Section */}
      <div className="reports-list-section">
        <div className="reports-list-header">
          <h3>💰 Danh sách báo cáo doanh thu</h3>
          <div className="search-filter">
            <select
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
            >
              <option value="">Tất cả tháng</option>
              {monthOptions.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
            <select
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
            >
              <option value="">Tất cả năm</option>
              {yearOptions.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="reports-table-container">
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Đang tải dữ liệu...</p>
            </div>
          ) : reports.length === 0 ? (
            <div className="empty-state">
              <div className="icon">💰</div>
              <p>Chưa có báo cáo doanh thu nào. Hãy tạo báo cáo mới!</p>
            </div>
          ) : (
            <table className="reports-table">
              <thead>
                <tr>
                  <th>Mã báo cáo</th>
                  <th>Tháng</th>
                  <th>Năm</th>
                  <th>Tổng doanh thu</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <tr key={report.MaBCDT}>
                    <td className="report-code">{report.MaBCDT}</td>
                    <td className="report-period">Tháng {report.Thang || report.THANG}</td>
                    <td className="report-period">{report.Nam || report.NAM}</td>
                    <td className="report-total">
                      {formatCurrency(report.TongDoanhThu)}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-action btn-view"
                          onClick={() => handleViewDetail(report)}
                        >
                          👁️ Xem
                        </button>
                        <PermissionGuard feature="report-revenue" hide>
                        <button
                          className="btn-action btn-refresh"
                          onClick={() => handleRefreshReport(report)}
                          data-feature="report-revenue"
                        >
                          🔄 Cập nhật
                        </button>
                        </PermissionGuard>
                        <PermissionGuard feature="report-revenue" hide>
                        <button
                          className="btn-action btn-delete"
                          onClick={() => handleDeleteClick(report)}
                          data-feature="report-revenue"
                        >
                          🗑️ Xóa
                        </button>
                        </PermissionGuard>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Detail SideSheet */}
      <SideSheet isOpen={sideSheetOpen} onClose={closeSideSheet}>
        {detailLoading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Đang tải chi tiết báo cáo doanh thu...</p>
          </div>
        ) : reportDetail ? (
          <div className="report-detail">
            <h2>💰 Báo cáo doanh thu</h2>
            <p className="report-period">
              Tháng {reportDetail.Thang}/{reportDetail.Nam}
            </p>

            <div className="report-summary">
              <div className="summary-card">
                <div className="label">Mã báo cáo</div>
                <div className="value">{reportDetail.MaBCDT}</div>
              </div>
              <div className="summary-card">
                <div className="label">Tổng doanh thu</div>
                <div className="value revenue">
                  {formatCurrency(reportDetail.TongDoanhThu)}
                </div>
              </div>
              <div className="summary-card">
                <div className="label">Số ngày có doanh thu</div>
                <div className="value count">
                  {reportDetail.ChiTiet?.length || 0} ngày
                </div>
              </div>
            </div>

            <div className="detail-table-container">
              <h4>Chi tiết doanh thu theo ngày</h4>
              {reportDetail.ChiTiet && reportDetail.ChiTiet.length > 0 ? (
                <table className="detail-table">
                  <thead>
                    <tr>
                      <th>Ngày</th>
                      <th>Số bệnh nhân</th>
                      <th>Doanh thu</th>
                      <th>Tỷ lệ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportDetail.ChiTiet.map((item, index) => (
                      <tr key={index}>
                        <td>{formatDate(item.Ngay)}</td>
                        <td>{item.SoBenhNhan}</td>
                        <td className="report-total">{formatCurrency(item.DoanhThu)}</td>
                        <td>
                          <div className="progress-bar-container">
                            <div className="progress-bar">
                              <div
                                className="progress-bar-fill"
                                style={{ width: `${(item.TyLe || 0) * 100}%` }}
                              ></div>
                            </div>
                            <span className="progress-value">
                              {((item.TyLe || 0) * 100).toFixed(1)}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="empty-state">
                  <p>Không có dữ liệu chi tiết</p>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </SideSheet>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setReportToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Xóa báo cáo doanh thu"
        message={`Bạn có chắc chắn muốn xóa báo cáo ${reportToDelete?.MaBCDT}? Hành động này không thể hoàn tác.`}
      />
    </>
  );
};

export default RevenueReportList;
