import React, { use, useState, useEffect } from "react";
import "./Examine.css";
import ExamineTicket from "../Examine/ExamineTicket";
import PatientTicket from "../Examine/PatientTicket";
import SideSheet from "../SideSheet/SideSheet";
import PatientDetail from "./PatientDetail";
import { useBottomSheet } from "../../contexts/BottomSheetContext";
import { getAllPatients } from "../../api/patientApi";

const Examine = () => {
    const { bottomSheetState, setBottomSheetState } = useBottomSheet();
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [sideSheetOpen, setSideSheetOpen] = useState(false);

    // Tạo danh sách demo để dễ thấy hiệu ứng scroll
    const tickets = [
        { id: 1, name: "Nguyễn Văn A", disease: "Cảm cúm", date: "25/10/2025" },
        { id: 2, name: "Trần Thị B", disease: "Đau đầu", date: "24/10/2025" },
    ];

    // Load danh sách bệnh nhân khi component mount
    useEffect(() => {
        const fetchPatients = async () => {
            try {
                setLoading(true);
                const data = await getAllPatients();
                setPatients(data);
                setError("");
            } catch (err) {
                console.error("Lỗi khi load danh sách bệnh nhân:", err);
                setError(err.message || "Lỗi khi load danh sách bệnh nhân");
                setPatients([]);
            } finally {
                setLoading(false);
            }
        };

        fetchPatients();
    }, []);

    const handleOpenExamine = () => {
        setBottomSheetState(prev => ({...prev, examineExamine: true}));
    };

    const handleOpenPatient = () => {
        setBottomSheetState(prev => ({...prev, examinePatient: true}));
    };

    const handleOpenSearch = () => {
        setBottomSheetState(prev => ({...prev, examineSearch: true}));
    };

    const handleSelectPatient = (patient) => {
        setSelectedPatient(patient);
        setSideSheetOpen(true);
    };

    return (
        <div className="examine-container">
            <div className="patients">
                <div className="header">
                    <h2 className="title">Danh sách bệnh nhân</h2>
                    <div className="tools">
                        <h2 onClick={handleOpenPatient}>+</h2>
                        <h2 onClick={handleOpenSearch}>🔍</h2>
                    </div>
                </div>

                <div className="scroll-list">
                    {loading && <p style={{ color: "#fff", textAlign: "center" }}>Đang tải...</p>}
                    {error && <p style={{ color: "#ff6b6b", textAlign: "center" }}>{error}</p>}
                    {!loading && patients.length === 0 && !error && <p style={{ color: "#fff", textAlign: "center" }}>Không có bệnh nhân</p>}
                    {patients.map((patient) => (
                        <PatientTicket
                            key={patient.MaBN}
                            patient={patient}
                            name={patient.HoTen}
                            gender={patient.GioiTinh}
                            age={patient.NamSinh}
                            onClick={() => handleSelectPatient(patient)}
                        />
                    ))}
                </div>
            </div>

            <div className="examinetickets">
                <div className="header">
                    <h2 className="title">Danh sách phiếu khám</h2>
                    <div className="tools">
                        <h2 onClick={handleOpenExamine}>+</h2>
                        <h2 onClick={handleOpenSearch}>🔍</h2>
                    </div>
                </div>
                <div className="scroll-list">
                    {tickets.map((ticket) => (
                        <ExamineTicket
                            key={ticket.id}
                            name={ticket.name}
                            disease={ticket.disease}
                            date={ticket.date}
                        />
                    ))}
                </div>
            </div>

            <SideSheet isOpen={sideSheetOpen} onClose={() => setSideSheetOpen(false)}>
                <PatientDetail patient={selectedPatient} />
            </SideSheet>
        </div>
    );
};

export default Examine;
