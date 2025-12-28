import React, { useState } from "react";
import "./Medicines.css";
import { useBottomSheet } from "../../contexts/BottomSheetContext";
import MedicinesList from "./MedicinesList";
import Unit from "./Unit";
import Usage from "./Usage";
import PermissionGuard from "../../components/PermissionGuard";
import { useAuth } from "../../contexts/AuthContext";

const Medicines = () => {
  const [activeTab, setActiveTab] = useState("medicines");
  const { checkFeature } = useAuth();
  
  const { setBottomSheetState } = useBottomSheet();
  
  const handleOpenMedicineImportForm = () => {
    setBottomSheetState(prev => ({ ...prev, medicineImportForm: true }));
  };

  const handleOpenUnitForm = () => {
    setBottomSheetState(prev => ({ ...prev, unitForm: true }));
  };

  const handleOpenUsageForm = () => {
    setBottomSheetState(prev => ({ ...prev, usageForm: true }));
  };

  // Kiểm tra quyền để hiển thị tab
  const canViewUnits = checkFeature('unit-list');
  const canViewUsages = checkFeature('usage-list');

  const renderTabContent = () => {
    switch (activeTab) {
      case "medicines":
        return (
          <>
            <PermissionGuard feature="medicine-import" hide>
              <button 
                className="btn-add" 
                onClick={handleOpenMedicineImportForm} 
                data-feature="medicine-import"
              >
                + Nhập thuốc
              </button>
            </PermissionGuard>
            <MedicinesList />
          </>
        );
      case "units":
        return (
          <>
            <PermissionGuard feature="unit-create" hide>
              <button 
                className="btn-add" 
                onClick={handleOpenUnitForm} 
                data-feature="unit-create"
              >
                + Thêm đơn vị tính mới
              </button>
            </PermissionGuard>
            <Unit />
          </>
        );
      case "usages":
        return (
          <>
            <PermissionGuard feature="usage-create" hide>
              <button 
                className="btn-add" 
                onClick={handleOpenUsageForm} 
                data-feature="usage-create"
              >
                + Thêm cách dùng mới
              </button>
            </PermissionGuard>
            <Usage />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="medicines-container" data-feature="medicines-page">
      <div className="medicines-header">
        <h2>Quản lý thuốc</h2>
      </div>

      {/* Tab Navigation */}
      <div className="tabs-navigation">
        <button
          className={`tab-button ${activeTab === "medicines" ? "active" : ""}`}
          onClick={() => setActiveTab("medicines")}
          data-feature="medicine-list"
        >
          Thuốc
        </button>
        
        {/* Tab Đơn vị tính - chỉ hiển thị nếu có quyền */}
        {canViewUnits && (
          <button
            className={`tab-button ${activeTab === "units" ? "active" : ""}`}
            onClick={() => setActiveTab("units")}
            data-feature="unit-list"
          >
            Đơn vị tính
          </button>
        )}
        
        {/* Tab Cách dùng - chỉ hiển thị nếu có quyền */}
        {canViewUsages && (
          <button
            className={`tab-button ${activeTab === "usages" ? "active" : ""}`}
            onClick={() => setActiveTab("usages")}
            data-feature="usage-list"
          >
            Cách dùng
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

export default Medicines;