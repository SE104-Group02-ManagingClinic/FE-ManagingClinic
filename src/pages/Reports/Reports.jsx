import React, { useState, useEffect } from "react";
import "./Reports.css";
import { useToast } from "../../contexts/ToastContext";
import { useAuth } from "../../contexts/AuthContext";
import MedicineUsageReportList from "./MedicineUsageReportList";
import RevenueReportList from "./RevenueReportList";

const Reports = () => {
  const { checkFeature, features } = useAuth();
  
  // Debug: Log features khi Reports load
  useEffect(() => {
    console.group('📊 Reports Page - Feature Check');
    console.log('🔍 All features available:', features);
    console.log('📋 Checking specific features:');
    console.log('  - report-medicine-usage:', checkFeature('report-medicine-usage'));
    console.log('  - report-revenue:', checkFeature('report-revenue'));
    console.groupEnd();
  }, [features]);
  
  const canViewMedicineUsage = checkFeature('report-medicine-usage');
  const canViewRevenue = checkFeature('report-revenue');
  
  // Đặt tab mặc định dựa trên quyền
  const getDefaultTab = () => {
    if (canViewMedicineUsage) return "medicineUsage";
    if (canViewRevenue) return "revenue";
    return "medicineUsage"; // fallback
  };
  
  const [activeTab, setActiveTab] = useState(getDefaultTab());

  const renderTabContent = () => {
    switch (activeTab) {
      case "medicineUsage":
        return <MedicineUsageReportList />;
      case "revenue":
        return <RevenueReportList />;
      default:
        return null;
    }
  };

  return (
    <div className="reports-container" data-feature="reports-page">
      <div className="reports-header">
        <h2>📊 Báo cáo & Thống kê</h2>
      </div>

      {/* Tab Navigation */}
      <div className="tabs-navigation">
        {canViewMedicineUsage && (
        <button
          className={`tab-button ${activeTab === "medicineUsage" ? "active" : ""}`}
          onClick={() => setActiveTab("medicineUsage")}
          data-feature="report-medicine-usage"
        >
          Báo cáo sử dụng thuốc
        </button>
        )}
        {canViewRevenue && (
        <button
          className={`tab-button ${activeTab === "revenue" ? "active" : ""}`}
          onClick={() => setActiveTab("revenue")}
          data-feature="report-revenue"
        >
          Báo cáo doanh thu
        </button>
        )}
      </div>

      {/* Tab Content */}
      <div className="tab-body">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default Reports;
