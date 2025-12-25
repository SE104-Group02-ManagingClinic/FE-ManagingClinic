import React, { createContext, useContext } from 'react';
import { toast, ToastContainer, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ToastContext = createContext();

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

export const ToastProvider = ({ children }) => {
    // Các options mặc định cho toast
    const defaultOptions = {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
    };

    // Hiển thị thông báo thành công
    const showSuccess = (message, options = {}) => {
        toast.success(message, { ...defaultOptions, ...options });
    };

    // Hiển thị thông báo lỗi
    const showError = (message, options = {}) => {
        toast.error(message, { ...defaultOptions, ...options });
    };

    // Hiển thị thông báo cảnh báo
    const showWarning = (message, options = {}) => {
        toast.warn(message, { ...defaultOptions, ...options });
    };

    // Hiển thị thông báo thông tin
    const showInfo = (message, options = {}) => {
        toast.info(message, { ...defaultOptions, ...options });
    };

    // Toast thông thường (không có màu)
    const showDefault = (message, options = {}) => {
        toast(message, { ...defaultOptions, ...options });
    };

    // Toast với promise (loading -> success/error)
    const showPromise = (promise, messages, options = {}) => {
        return toast.promise(
            promise,
            {
                pending: messages.pending || 'Đang xử lý...',
                success: messages.success || 'Thành công!',
                error: messages.error || 'Có lỗi xảy ra!'
            },
            { ...defaultOptions, ...options }
        );
    };

    // Xóa tất cả toast
    const dismissAll = () => {
        toast.dismiss();
    };

    const value = {
        showSuccess,
        showError,
        showWarning,
        showInfo,
        showDefault,
        showPromise,
        dismissAll,
        toast // Export toast gốc để sử dụng các tính năng nâng cao
    };

    return (
        <ToastContext.Provider value={value}>
            {children}
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
                transition={Bounce}
                limit={5}
            />
        </ToastContext.Provider>
    );
};

export default ToastContext;
