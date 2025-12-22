import React, { useState } from "react";
import "./Medicines.css";
import { useBottomSheet } from "../../contexts/BottomSheetContext";
import MedicinesList from "./MedicinesList";
import Unit from "./Unit";
import Usage from "./Usage";

const Medicines = () => {
  const [activeTab, setActiveTab] = useState("medicines");
  
  const { setBottomSheetState } = useBottomSheet();
  
  const handleOpenMedicineForm = () => {
    setBottomSheetState(prev => ({ ...prev, medicinesForm: true }));
  };

  const handleOpenUnitForm = () => {
    setBottomSheetState(prev => ({ ...prev, unitForm: true }));
  };

  const handleOpenUsageForm = () => {
    setBottomSheetState(prev => ({ ...prev, usageForm: true }));
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "medicines":
        return (
          <>
            <button className="btn-add" onClick={handleOpenMedicineForm}>
              + Thêm thuốc mới
            </button>
            <MedicinesList />
          </>
        );
      case "units":
        return (
          <>
            <button className="btn-add" onClick={handleOpenUnitForm}>
              + Thêm đơn vị tính mới
            </button>
            <Unit />
          </>
        );
      case "usages":
        return (
          <>
            <button className="btn-add" onClick={handleOpenUsageForm}>
              + Thêm cách dùng mới
            </button>
            <Usage />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="medicines-container">
      <div className="medicines-header">
        <h2>Quản lý thuốc</h2>
      </div>

      {/* Tab Navigation */}
      <div className="tabs-navigation">
        <button
          className={`tab-button ${activeTab === "medicines" ? "active" : ""}`}
          onClick={() => setActiveTab("medicines")}
        >
          Thuốc
        </button>
        <button
          className={`tab-button ${activeTab === "units" ? "active" : ""}`}
          onClick={() => setActiveTab("units")}
        >
          Đơn vị tính
        </button>
        <button
          className={`tab-button ${activeTab === "usages" ? "active" : ""}`}
          onClick={() => setActiveTab("usages")}
        >
          Cách dùng
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-body">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default Medicines;