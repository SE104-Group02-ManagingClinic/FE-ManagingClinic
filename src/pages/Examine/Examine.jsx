import React, { useState } from "react";
import "./Examine.css";
import PatientsList from "./PatientsList";
import ExamFormsList from "./ExamFormsList";
import Disease from "./Disease";
import { useBottomSheet } from "../../contexts/BottomSheetContext";
import PermissionGuard from "../../components/PermissionGuard";
import { useAuth } from "../../contexts/AuthContext";

const Examine = () => {
    const [activeTab, setActiveTab] = useState("patients");
    const { setBottomSheetState } = useBottomSheet();
    const { checkFeature } = useAuth();

    // Check which tabs user can view
    const canViewPatients = checkFeature("patient-list");
    const canViewExamForms = checkFeature("exam-form-list");
    const canViewDiseases = checkFeature("disease-list");

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
                        <PermissionGuard feature="patient-create" hide>
                            <button className="btn-add" onClick={handleOpenPatient} data-feature="patient-create">
                                + Thêm bệnh nhân
                            </button>
                        </PermissionGuard>
                        <button className="btn-search" onClick={handleOpenSearch} data-feature="patient-search">
                            🔍 Tìm kiếm
                        </button>
                        <PatientsList />
                    </>
                );
            case "examForms":
                return (
                    <>
                        <PermissionGuard feature="exam-form-create" hide>
                            <button className="btn-add" onClick={handleOpenExamine} data-feature="exam-form-create">
                                + Thêm phiếu khám
                            </button>
                        </PermissionGuard>
                        <ExamFormsList />
                    </>
                );
            case "diseases":
                return (
                    <>
                        <PermissionGuard feature="disease-create" hide>
                            <button className="btn-add" onClick={handleOpenDisease} data-feature="disease-create">
                                + Thêm bệnh mới
                            </button>
                        </PermissionGuard>
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
                {canViewPatients && (
                    <button
                        className={`tab-button ${activeTab === "patients" ? "active" : ""}`}
                        onClick={() => setActiveTab("patients")}
                        data-feature="patient-list"
                    >
                        Bệnh nhân
                    </button>
                )}
                {canViewExamForms && (
                    <button
                        className={`tab-button ${activeTab === "examForms" ? "active" : ""}`}
                        onClick={() => setActiveTab("examForms")}
                        data-feature="exam-form-list"
                    >
                        Phiếu khám bệnh
                    </button>
                )}
                {canViewDiseases && (
                    <button
                        className={`tab-button ${activeTab === "diseases" ? "active" : ""}`}
                        onClick={() => setActiveTab("diseases")}
                        data-feature="disease-list"
                    >
                        Bệnh
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

export default Examine;