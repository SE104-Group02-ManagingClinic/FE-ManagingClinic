import React, { use, useState } from "react";
import "./Examine.css";
import BottomSheet from "../BottomSheet/BottomSheet";
import ExamineTicket from "../Examine/ExamineTicket";
import PatientForm from "./PatientForm"
import PatientTicket from "../Examine/PatientTicket";
import ExamineForm from "../Examine/ExamineForm";
import SearchPatient from "./SearchPatient";

const Examine = () => {
    const [openExamine, setOpenExamine] = useState(false);
    const [openPatient, setOpenPatient] = useState(false);
    const [openSearch, setOpenSearch] = useState(false);
    // Tạo danh sách demo để dễ thấy hiệu ứng scroll
    const tickets = [
        { id: 1, name: "Nguyễn Văn A", disease: "Cảm cúm", date: "25/10/2025" },
        { id: 2, name: "Trần Thị B", disease: "Đau đầu", date: "24/10/2025" },
    ];

    const patients = [
        { id: 1, name: "Nguyễn Văn A", gender: "Nam", age: 30 },
        { id: 2, name: "Trần Thị B", gender: "Nữ", age: 27 },
    ];
    return (
        <>
            <div className={`examine-container ${openExamine || openPatient || openSearch ? "shrink" : ""}`}>
                <div className="patients">
                    <div className="header">
                        <h2 className="title">Danh sách bệnh nhân</h2>
                        <div className="tools">
                            <h2 onClick={() => setOpenPatient(true)}>+</h2>
                            <h2 onClick={() => setOpenSearch(true)}>🔍</h2>
                        </div>
                    </div>

                    <div className="scroll-list">
                        {patients.map((patient) => (
                            <PatientTicket
                                key={patient.id}
                                name={patient.name}
                                gender={patient.gender}
                                age={patient.age}
                            />
                        ))}
                    </div>
                </div>

                <div className="examinetickets">
                    <div className="header">
                        <h2 className="title">Danh sách phiếu khám</h2>
                        <div className="tools">
                            <h2 onClick={() => setOpenExamine(true)}>+</h2>
                            <h2 onClick={() => setOpenSearch(true)}>🔍</h2>
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
            </div>
            
            {/* BottomSheet 1 - Phiếu khám */}
            <BottomSheet isOpen={openExamine} onClose={() => setOpenExamine(false)}>
                <ExamineForm />
            </BottomSheet>

            {/* BottomSheet 2 - Thêm bệnh nhân */}
            <BottomSheet isOpen={openPatient} onClose={() => setOpenPatient(false)}>
                <PatientForm />
            </BottomSheet>

            {/* BottomSheet 3 - Tìm kiếm bệnh nhân */}
            <BottomSheet isOpen={openSearch} onClose={() => setOpenSearch(false)}>
                <SearchPatient />
            </BottomSheet>
        </>
    );
};

export default Examine;
