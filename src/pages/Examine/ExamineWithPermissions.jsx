// src/pages/Examine/ExamineWithPermissions.jsx
import React, { useState } from 'react';
import PermissionGuard from '../../components/PermissionGuard';
import { usePermission } from '../../hooks/usePermission';
import './Examine.css';

/**
 * Màn hình Khám bệnh với phân quyền chi tiết
 */
const ExamineWithPermissions = () => {
  const [activeTab, setActiveTab] = useState('patients');
  const { hasPermission, hasAnyPermission } = usePermission();

  // Định nghĩa tabs với quyền tương ứng
  const tabs = [
    {
      id: 'patients',
      label: 'Quản lý Bệnh nhân',
      permission: 'CN004', // Quản lý bệnh nhân
      icon: '👥',
    },
    {
      id: 'search',
      label: 'Tra cứu Bệnh nhân',
      permission: 'CN005', // Tra cứu bệnh nhân
      icon: '🔍',
    },
    {
      id: 'create-exam',
      label: 'Lập Phiếu khám',
      permission: 'CN006', // Lập phiếu khám bệnh
      icon: '📝',
    },
    {
      id: 'view-exam',
      label: 'Xem Phiếu khám',
      permission: 'CN007', // Xem phiếu khám bệnh
      icon: '📋',
    },
  ];

  // Chỉ hiển thị tabs mà user có quyền
  const visibleTabs = tabs.filter(tab => hasPermission(tab.permission));

  // Set active tab mặc định là tab đầu tiên có quyền
  React.useEffect(() => {
    if (visibleTabs.length > 0 && !visibleTabs.find(t => t.id === activeTab)) {
      setActiveTab(visibleTabs[0].id);
    }
  }, [visibleTabs, activeTab]);

  return (
    <div className="examine-container">
      <h1>🩺 Khám bệnh</h1>

      {/* Tab Navigation - chỉ hiển thị tabs có quyền */}
      <div className="tabs">
        {visibleTabs.map(tab => (
          <button
            key={tab.id}
            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span>{tab.icon}</span> {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content với phân quyền chi tiết */}
      <div className="tab-content">
        {/* Tab Quản lý Bệnh nhân */}
        <PermissionGuard requiredPermission="CN004" hide>
          {activeTab === 'patients' && (
            <PatientManagement />
          )}
        </PermissionGuard>

        {/* Tab Tra cứu */}
        <PermissionGuard requiredPermission="CN005" hide>
          {activeTab === 'search' && (
            <PatientSearch />
          )}
        </PermissionGuard>

        {/* Tab Lập phiếu khám */}
        <PermissionGuard requiredPermission="CN006" hide>
          {activeTab === 'create-exam' && (
            <CreateExamForm />
          )}
        </PermissionGuard>

        {/* Tab Xem phiếu khám */}
        <PermissionGuard requiredPermission="CN007" hide>
          {activeTab === 'view-exam' && (
            <ViewExamForms />
          )}
        </PermissionGuard>
      </div>
    </div>
  );
};

/**
 * Component Quản lý Bệnh nhân với các nút CRUD có phân quyền
 */
const PatientManagement = () => {
  const { hasPermission } = usePermission();
  const [patients, setPatients] = useState([]);

  const handleCreate = () => {
    console.log('Tạo bệnh nhân mới');
  };

  const handleEdit = (id) => {
    console.log('Sửa bệnh nhân:', id);
  };

  const handleDelete = (id) => {
    console.log('Xóa bệnh nhân:', id);
  };

  return (
    <div className="patient-management">
      <div className="actions">
        <h2>Danh sách Bệnh nhân</h2>
        
        {/* Nút Thêm mới - chỉ hiện khi có quyền CN004 */}
        <PermissionGuard requiredPermission="CN004" hide>
          <button className="btn btn-primary" onClick={handleCreate}>
            ➕ Thêm Bệnh nhân
          </button>
        </PermissionGuard>
      </div>

      <table className="patient-table">
        <thead>
          <tr>
            <th>Mã BN</th>
            <th>Họ tên</th>
            <th>Ngày sinh</th>
            <th>Số điện thoại</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {patients.map(patient => (
            <tr key={patient.id}>
              <td>{patient.id}</td>
              <td>{patient.name}</td>
              <td>{patient.dob}</td>
              <td>{patient.phone}</td>
              <td>
                {/* Nút Sửa - có quyền CN004 */}
                <PermissionGuard requiredPermission="CN004" hide>
                  <button 
                    className="btn btn-sm btn-warning"
                    onClick={() => handleEdit(patient.id)}
                  >
                    ✏️ Sửa
                  </button>
                </PermissionGuard>

                {/* Nút Xóa - có quyền CN004 */}
                <PermissionGuard requiredPermission="CN004" hide>
                  <button 
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(patient.id)}
                  >
                    🗑️ Xóa
                  </button>
                </PermissionGuard>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

/**
 * Component Tra cứu Bệnh nhân
 */
const PatientSearch = () => {
  return (
    <div className="patient-search">
      <h2>🔍 Tra cứu Bệnh nhân</h2>
      <input type="text" placeholder="Nhập tên hoặc mã bệnh nhân..." />
      <button className="btn btn-primary">Tìm kiếm</button>
    </div>
  );
};

/**
 * Component Lập Phiếu khám
 */
const CreateExamForm = () => {
  return (
    <div className="create-exam-form">
      <h2>📝 Lập Phiếu khám bệnh</h2>
      <form>
        <div className="form-group">
          <label>Chọn bệnh nhân:</label>
          <select>
            <option>-- Chọn bệnh nhân --</option>
          </select>
        </div>
        <div className="form-group">
          <label>Triệu chứng:</label>
          <textarea placeholder="Nhập triệu chứng..."></textarea>
        </div>
        <button type="submit" className="btn btn-primary">Lưu phiếu khám</button>
      </form>
    </div>
  );
};

/**
 * Component Xem Phiếu khám
 */
const ViewExamForms = () => {
  return (
    <div className="view-exam-forms">
      <h2>📋 Danh sách Phiếu khám</h2>
      <p>Hiển thị danh sách phiếu khám...</p>
    </div>
  );
};

export default ExamineWithPermissions;
