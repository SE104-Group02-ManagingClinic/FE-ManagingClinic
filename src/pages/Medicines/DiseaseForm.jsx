import React, { useState } from "react";
import "./DiseaseForm.css";
import { createDisease } from "../../api/diseaseApi";

const DiseaseForm = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
        TenBenh: "",
        TrieuChung: "",
        NguyenNhan: "",
        BienPhapChanDoan: "",
        CachDieuTri: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const result = await createDisease(formData);
            console.log("✅ Tạo bệnh thành công:", result);
            alert("Tạo bệnh thành công!");

            // Reset form
            setFormData({
                TenBenh: "",
                TrieuChung: "",
                NguyenNhan: "",
                BienPhapChanDoan: "",
                CachDieuTri: "",
            });

            // Gọi callback nếu có
            if (onSubmit) onSubmit(result);
        } catch (error) {
            console.error("❌ Lỗi khi tạo bệnh:", error);
            alert(`Tạo bệnh thất bại: ${error.message}`);
        }
    };

    return (
        <div className="disease-form-container">
            <h2 className="form-title">💊 Nhập thông tin bệnh</h2>
            <form className="disease-form" onSubmit={handleSubmit}>
                <div className="form-row">
                    <div className="form-group">
                        <label>Tên bệnh: <span className="required">*</span></label>
                        <input
                            type="text"
                            name="TenBenh"
                            value={formData.TenBenh}
                            onChange={handleChange}
                            placeholder="VD: Cúm mùa"
                            required
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Triệu chứng:</label>
                        <textarea
                            name="TrieuChung"
                            value={formData.TrieuChung}
                            onChange={handleChange}
                            placeholder="VD: Sốt, ho, đau đầu"
                            rows="3"
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Nguyên nhân:</label>
                        <textarea
                            name="NguyenNhan"
                            value={formData.NguyenNhan}
                            onChange={handleChange}
                            placeholder="VD: Virus cúm"
                            rows="3"
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Biện pháp chẩn đoán:</label>
                        <textarea
                            name="BienPhapChanDoan"
                            value={formData.BienPhapChanDoan}
                            onChange={handleChange}
                            placeholder="VD: Giữ vệ sinh, tránh tiếp xúc"
                            rows="3"
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Cách điều trị:</label>
                        <textarea
                            name="CachDieuTri"
                            value={formData.CachDieuTri}
                            onChange={handleChange}
                            placeholder="VD: Thuốc hạ sốt, nghỉ ngơi"
                            rows="3"
                        />
                    </div>
                </div>

                <button className="submit-btn" type="submit">
                    Lưu thông tin bệnh
                </button>
            </form>
        </div>
    );
};

export default DiseaseForm;
