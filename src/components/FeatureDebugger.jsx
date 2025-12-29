/**
 * DEBUG HELPER: Mini Feature Inspector
 * Tạm thời thêm vào để debug features
 * 
 * Sử dụng: Thêm component này vào App.js hoặc bất kỳ đâu
 * <FeatureDebugger />
 */

import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const FeatureDebugger = () => {
  const { features, permissions, user } = useAuth();
  const [isOpen, setIsOpen] = React.useState(false);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 9999,
          background: '#667eea',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          cursor: 'pointer',
          fontSize: '20px',
          fontWeight: 'bold',
        }}
        title="Open Feature Debug Panel"
      >
        🔍
      </button>
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 9999,
        background: 'white',
        border: '2px solid #667eea',
        borderRadius: '8px',
        padding: '16px',
        maxWidth: '400px',
        maxHeight: '500px',
        overflowY: 'auto',
        fontFamily: 'monospace',
        fontSize: '12px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
      }}
    >
      <div style={{ marginBottom: '12px', fontWeight: 'bold' }}>
        🔍 Feature Debug Panel
        <button
          onClick={() => setIsOpen(false)}
          style={{
            float: 'right',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          ✕
        </button>
      </div>

      <div style={{ marginBottom: '10px', padding: '8px', background: '#f0f0f0', borderRadius: '4px' }}>
        <strong>User:</strong> {user?.TenDangNhap || 'Not logged in'}
        <br />
        <strong>Group:</strong> {user?.TenNhom || 'N/A'}
      </div>

      <div style={{ marginBottom: '10px' }}>
        <strong>Permissions ({permissions.length}):</strong>
        <div style={{ background: '#fff3cd', padding: '8px', borderRadius: '4px', marginTop: '4px' }}>
          {permissions.length > 0 ? (
            permissions.map((p, i) => (
              <div key={i}>
                {p}
              </div>
            ))
          ) : (
            <div>No permissions</div>
          )}
        </div>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <strong>Features ({features.length}):</strong>
        <div style={{ background: '#d4edda', padding: '8px', borderRadius: '4px', marginTop: '4px', maxHeight: '300px', overflowY: 'auto' }}>
          {features.length > 0 ? (
            features.map((f, i) => (
              <div key={i} style={{ marginBottom: '4px' }}>
                {f}
              </div>
            ))
          ) : (
            <div style={{ color: 'red', fontWeight: 'bold' }}>⚠️ NO FEATURES LOADED!</div>
          )}
        </div>
      </div>

      <div style={{ fontSize: '11px', color: '#999' }}>
        💡 Copy features list to check if report-* features are present
      </div>
    </div>
  );
};

export default FeatureDebugger;
