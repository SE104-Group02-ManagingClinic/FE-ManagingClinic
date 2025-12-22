import React, { useState } from "react";
import "./Examine.css";
import PatientsList from "./PatientsList";
import ExamFormsList from "./ExamFormsList";
import Disease from "./Disease";
import { useBottomSheet } from "../../contexts/BottomSheetContext";

const Examine = () => {
    const [activeTab, setActiveTab] = useState("patients");
    const { setBottomSheetState } = useBottomSheet();

    const handleOpenExamine = () => {
        setBottomSheetState(prev => ({...prev, examineExamine: true}));
    };

    const handleOpenPatient = () => {
        setBottomSheetState(prev => ({...prev, examinePatient: true}));
    };

    const handleOpenSearch = () => {
        setBottomSheetState(prev => ({...prev, examineSearch: true}));
    };

    const handleOpenDisease = () => {
        setBottomSheetState(prev => ({...prev, diseaseForm: true}));
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case "patients":
                return (
                    <>
                        <button className="btn-add" onClick={handleOpenPatient}>
                            + Thêm bệnh nhân
                        </button>
                        <button className="btn-search" onClick={handleOpenSearch}>
                            🔍 Tìm kiếm
                        </button>
                        <PatientsList />
                    </>
                );
            case "examForms":
                return (
                    <>
                        <button className="btn-add" onClick={handleOpenExamine}>
                            + Thêm phiếu khám
                        </button>
                        <ExamFormsList />
                    </>
                );
            case "diseases":
                return (
                    <>
                        <button className="btn-add" onClick={handleOpenDisease}>
                            + Thêm bệnh mới
                        </button>
                        <Disease />
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div className="examine-container">
            <div className="examine-header">
                <h2>Khám bệnh</h2>
            </div>

            {/* Tab Navigation */}
            <div className="tabs-navigation">
                <button
                    className={`tab-button ${activeTab === "patients" ? "active" : ""}`}
                    onClick={() => setActiveTab("patients")}
                >
                    Bệnh nhân
                </button>
                <button
                    className={`tab-button ${activeTab === "examForms" ? "active" : ""}`}
                    onClick={() => setActiveTab("examForms")}
                >
                    Phiếu khám bệnh
                </button>
                <button
                    className={`tab-button ${activeTab === "diseases" ? "active" : ""}`}
                    onClick={() => setActiveTab("diseases")}
                >
                    Bệnh
                </button>
            </div>

            {/* Tab Content */}
            <div className="tab-body">
                {renderTabContent()}
            </div>
        </div>
    );
};

export default Examine;