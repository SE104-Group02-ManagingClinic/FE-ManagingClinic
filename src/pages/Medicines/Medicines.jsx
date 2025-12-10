import React from "react";
import "./Medicines.css";

// Dữ liệu mẫu (mock data) cho bảng
const recentOrders = [
  {
    orderNumber: 3000,
    purchaseDate: "May 9, 2024",
    customer: "Leslie Alexander",
    event: { name: "Bear Hug: Live in Concert", icon: "🐻" },
    amount: "US$80.00",
  },
  {
    orderNumber: 3001,
    purchaseDate: "May 5, 2024",
    customer: "Michael Foster",
    event: { name: "Six Fingers — DJ Set", icon: "💿" },
    amount: "US$299.00",
  },
  {
    orderNumber: 3002,
    purchaseDate: "Apr 28, 2024",
    customer: "Dries Vincent",
    event: { name: "We All Look The Same", icon: "👽" },
    amount: "US$150.00",
  },
  {
    orderNumber: 3003,
    purchaseDate: "Apr 23, 2024",
    customer: "Lindsay Wolton",
    event: { name: "Bear Hug: Live in Concert", icon: "🐻" },
    amount: "US$80.00",
  },
  {
    orderNumber: 3004,
    purchaseDate: "Apr 18, 2024",
    customer: "Courtney Henry",
    event: { name: "Viking People", icon: "💀" },
    amount: "US$114.99",
  },
  {
    orderNumber: 3005,
    purchaseDate: "Apr 14, 2024",
    customer: "Tom Cook",
    event: { name: "Six Fingers — DJ Set", icon: "💿" },
    amount: "US$299.00",
  },
  {
    orderNumber: 3006,
    purchaseDate: "Apr 10, 2024",
    customer: "Whitney Francis",
    event: { name: "We All Look The Same", icon: "👽" },
    amount: "US$150.00",
  },
  {
    orderNumber: 3007,
    purchaseDate: "Apr 6, 2024",
    customer: "Leonard Krasner",
    event: { name: "Bear Hug: Live in Concert", icon: "🐻" },
    amount: "US$80.00",
  },
  {
    orderNumber: 3008,
    purchaseDate: "Apr 3, 2024",
    customer: "Floyd Miles",
    event: { name: "Bear Hug: Live in Concert", icon: "🐻" },
    amount: "US$80.00",
  },
  {
    orderNumber: 3009,
    purchaseDate: "Mar 29, 2024",
    customer: "Emily Selman",
    event: { name: "Viking People", icon: "💀" },
    amount: "US$114.99",
  },
];

const Medicines = () => {
  return (
    <div className="orders-container">
      <h2 className="orders-header">Recent orders</h2>
      <div className="orders-table-wrapper">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order number</th>
              <th>Purchase date</th>
              <th>Customer</th>
              <th>Event</th>
              <th className="amount-column">Amount</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order) => (
              <tr key={order.orderNumber}>
                <td>{order.orderNumber}</td>
                <td>{order.purchaseDate}</td>
                <td>{order.customer}</td>
                <td>
                  <div className="event-cell">
                    {/* Giả lập icon event bằng emoji và dùng class để style */}
                    <span className={`event-icon ${order.event.icon === '🐻' ? 'bear' : order.event.icon === '💿' ? 'six-fingers' : order.event.icon === '👽' ? 'look-same' : 'viking'}`}>{order.event.icon}</span>
                    {order.event.name}
                  </div>
                </td>
                <td className="amount-column">{order.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Medicines;