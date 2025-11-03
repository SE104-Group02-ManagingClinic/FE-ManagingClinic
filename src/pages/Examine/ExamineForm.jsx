import React from "react";
import "./ExamineForm.css";

const ExamineTicket = () => {
  return (
    <div className="ticket-container">
      <div className="ticket-header">

        <h2>Phiếu khám bệnh</h2>
      </div>

      <div className="ticket-info">
        <div className="left">
          <label>
            Họ tên:
            <input type="text" placeholder="Nhập họ tên" />
          </label>
          <label>
            CCCD:
            <input type="text" placeholder="Nhập CCCD" />
          </label>
          <label>
            Triệu chứng:
            <textarea rows="2" placeholder="Nhập triệu chứng"></textarea>
          </label>
          <label>
            Dự đoán loại bệnh:
            <input type="text" placeholder="Nhập loại bệnh" />
          </label>
        </div>

        <div className="right">
          <label>
            Ngày khám:
            <input type="date" />
          </label>
          <label>
            Tiền khám:
            <input type="number" placeholder="VNĐ" />
          </label>
        </div>
      </div>

      <table className="ticket-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Thuốc</th>
            <th>Số lượng</th>
            <th>Đơn vị tính</th>
            <th>Cách dùng</th>
            <th>Đơn giá</th>
            <th>Thành tiền</th>
          </tr>
        </thead>
        <tbody>
          {[1, 2, 3].map((i) => (
            <tr key={i}>
              <td>{i}</td>
              <td><input type="text" /></td>
              <td><input type="number" /></td>
              <td><input type="text" /></td>
              <td><input type="text" /></td>
              <td><input type="number" /></td>
              <td><input type="number" /></td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="ticket-total">
        Tổng tiền thuốc:
        <input type="number" placeholder="VNĐ" />
      </div>
    </div>
  );
};

export default ExamineTicket;
