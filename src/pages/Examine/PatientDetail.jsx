import React, { useState, useRef, useEffect } from 'react';
import { flushSync } from 'react-dom';
import './PatientDetail.css';
import { updatePatient, deletePatient } from '../../api/patientApi';
import { useToast } from '../../contexts/ToastContext';
import DeleteConfirmModal from '../../components/DeleteConfirmModal';

const PatientDetail = ({ patient, onPatientUpdated, onPatientDeleted, onEditStateChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [deleteModal, setDeleteModal] = useState(false);
  const { showSuccess, showError } = useToast();
  const abortControllerRef = useRef(null);
  const isMountedRef = useRef(true);
  const [formData, setFormData] = useState({
    HoTen: patient?.HoTen || '',
    CCCD: patient?.CCCD || '',
    GioiTinh: patient?.GioiTinh || '',
    NamSinh: patient?.NamSinh ? patient.NamSinh.split('T')[0] : '',
    DiaChi: patient?.DiaChi || '',
    SDT: patient?.SDT || '',
  });

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      // Cancel any pending requests
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Reset edit mode when patient changes
  useEffect(() => {
    setIsEditing(false);
    setError('');
    setIsLoading(false);
    if (patient) {
      setFormData({
        HoTen: patient.HoTen || '',
        CCCD: patient.CCCD || '',
        GioiTinh: patient.GioiTinh || '',
        NamSinh: patient.NamSinh ? patient.NamSinh.split('T')[0] : '',
        DiaChi: patient.DiaChi || '',
        SDT: patient.SDT || '',
      });
    }
  }, [patient]);

  // Notify parent about edit state changes
  useEffect(() => {
    if (onEditStateChange) {
      onEditStateChange(isEditing);
    }
  }, [isEditing, onEditStateChange]);

  if (!patient) {
    return <div className="patient-detail">Chọn bệnh nhân để xem chi tiết</div>;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleEdit = () => {
    setIsEditing(true);
    setFormData({
      HoTen: patient.HoTen,
      CCCD: patient.CCCD,
      GioiTinh: patient.GioiTinh,
      NamSinh: patient.NamSinh ? patient.NamSinh.split('T')[0] : '',
      DiaChi: patient.DiaChi,
      SDT: patient.SDT,
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError('');
  };

  const handleSave = async () => {
    if (!formData.HoTen.trim() || !formData.CCCD.trim() || !formData.SDT.trim()) {
      setError('Vui lòng điền đầy đủ các trường bắt buộc');
      return;
    }

    // Cancel any previous requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setIsLoading(true);
    setError('');

    try {
      await updatePatient(patient.MaBN, formData, abortControllerRef.current.signal);

      // Apply state updates immediately to prevent UI freeze
      flushSync(() => {
        setIsEditing(false);
        setIsLoading(false);
      });

      // Close/refresh via parent immediately (don't gate on isMountedRef; it can block closing)
      try {
        showSuccess('Cập nhật bệnh nhân thành công!');
        onPatientUpdated?.();
      } catch (e) {
        showError('Có lỗi khi cập nhật');
      }
    } catch (err) {
      // Only update state if component is still mounted and it's not an abort error
      if (!isMountedRef.current || err.name === 'AbortError') return;
      
      setError(err.message || 'Cập nhật thất bại');
      setIsLoading(false);
    } finally {
      // Safety: never leave loading stuck if component still mounted
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  };

  const handleDelete = async () => {
    setDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    // Cancel any previous requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setIsLoading(true);
    setError('');

    try {
      await deletePatient(patient.MaBN, abortControllerRef.current.signal);

      flushSync(() => {
        setIsLoading(false);
      });

      try {
        showSuccess('Xóa bệnh nhân thành công!');
        onPatientDeleted?.();
      } catch (e) {
        showError('Có lỗi khi xóa bệnh nhân');
      }
    } catch (err) {
      // Only update state if component is still mounted and it's not an abort error
      if (!isMountedRef.current || err.name === 'AbortError') return;
      
      setError(err.message || 'Xóa thất bại');
      setIsLoading(false);
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
    
    setDeleteModal(false);
  };

  const handleDeleteCancel = () => {
    setDeleteModal(false);
  };

  return (
    <div className="patient-detail">
      <h2>Thông tin bệnh nhân</h2>
      
      {error && <div className="message error-message">{error}</div>}

      {!isEditing ? (
        <>
          <div className="detail-section">
            <label>Mã bệnh nhân:</label>
            <p>{patient.MaBN}</p>
          </div>

          <div className="detail-section">
            <label>Họ tên:</label>
            <p>{patient.HoTen}</p>
          </div>

          <div className="detail-section">
            <label>Giới tính:</label>
            <p>{patient.GioiTinh}</p>
          </div>

          <div className="detail-section">
            <label>Ngày sinh:</label>
            <p>
              {new Date(patient.NamSinh).toLocaleDateString("vi-VN", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })}
            </p>
          </div>

          <div className="detail-section">
            <label>Số CCCD:</label>
            <p>{patient.CCCD}</p>
          </div>

          <div className="detail-section">
            <label>Số điện thoại:</label>
            <p>{patient.SDT}</p>
          </div>

          <div className="detail-section">
            <label>Địa chỉ:</label>
            <p>{patient.DiaChi}</p>
          </div>

          <div className="action-buttons">
            <button 
              className="btn btn-edit" 
              onClick={handleEdit}
              disabled={isLoading}
            >
              ✏️ Chỉnh sửa
            </button>
            <button 
              className="btn btn-delete" 
              onClick={handleDelete}
              disabled={isLoading}
            >
              🗑️ Xóa
            </button>
          </div>
        </>
      ) : (
        <div className="edit-form">
          <div className="form-group">
            <label>Mã bệnh nhân:</label>
            <p className="readonly">{patient.MaBN}</p>
          </div>

          <div className="form-group">
            <label>Họ tên: *</label>
            <input 
              type="text" 
              name="HoTen" 
              value={formData.HoTen}
              onChange={handleInputChange}
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label>Giới tính:</label>
            <select 
              name="GioiTinh" 
              value={formData.GioiTinh}
              onChange={handleInputChange}
              disabled={isLoading}
            >
              <option value="">Chọn giới tính</option>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
            </select>
          </div>

          <div className="form-group">
            <label>Ngày sinh:</label>
            <input 
              type="date" 
              name="NamSinh" 
              value={formData.NamSinh}
              onChange={handleInputChange}
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label>Số CCCD: *</label>
            <input 
              type="text" 
              name="CCCD" 
              value={formData.CCCD}
              onChange={handleInputChange}
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label>Số điện thoại: *</label>
            <input 
              type="text" 
              name="SDT" 
              value={formData.SDT}
              onChange={handleInputChange}
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label>Địa chỉ:</label>
            <textarea 
              name="DiaChi" 
              value={formData.DiaChi}
              onChange={handleInputChange}
              disabled={isLoading}
              rows="2"
            ></textarea>
          </div>

          <div className="action-buttons">
            <button 
              className="btn btn-save" 
              onClick={handleSave}
              disabled={isLoading}
            >
              {isLoading ? 'Đang lưu...' : '💾 Lưu'}
            </button>
            <button 
              className="btn btn-cancel" 
              onClick={handleCancel}
              disabled={isLoading}
            >
              ❌ Hủy
            </button>
          </div>
        </div>
      )}

      <DeleteConfirmModal
        isOpen={deleteModal}
        title={`Xóa bệnh nhân "${patient?.HoTen || ""}"`}
        message="Hành động này không thể hoàn tác. Bạn có chắc chắn muốn xóa?"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        isLoading={isLoading}
      />
    </div>
  );
};
export default PatientDetail;
