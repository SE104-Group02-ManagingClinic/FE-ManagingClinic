import React, { useState, useEffect } from "react";
import "./ProfileCard.css";

const ProfileCard = ({ avatar, name, description }) => {
  const [user, setUser] = useState(null);

  // Mapping nhóm từ MaNhom
  const groupMap = {
    "GR001": "Nhóm Quản trị",
    "GR002": "Bác sĩ",
    "GR003": "Y tá",
    "GR004": "Lễ tân",
  };

  useEffect(() => {
    // Lấy thông tin user từ localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        console.log("📋 User từ localStorage:", userData);
        setUser(userData);
      } catch (error) {
        console.error("Lỗi khi parse user từ localStorage:", error);
      }
    }
  }, []);

  const displayName = user?.TenDangNhap || name || "UserName";
  // Dùng MaNhom để mapping thay vì TenNhom (vì API trả về encoding sai)
  const displayDesc = groupMap[user?.MaNhom] || description || "User Group";

  return (
    <div className="profile-card">
      <img 
        src={avatar || "./aeri.png"} 
        alt="User Avatar" 
        className="profile-avatar" 
      />
      <div className="profile-info">
        <h3 className="profile-name">{displayName}</h3>
        <p className="profile-desc">{displayDesc}</p>
      </div>
    </div>
  );
};

export default ProfileCard;
