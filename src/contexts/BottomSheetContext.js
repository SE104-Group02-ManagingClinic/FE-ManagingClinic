import React, { createContext, useState, useContext } from 'react';

const BottomSheetContext = createContext();

export const BottomSheetProvider = ({ children }) => {
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [bottomSheetState, setBottomSheetState] = useState({
    homeExamine: false,
    homePatient: false,
    examineExamine: false,
    examinePatient: false,
    examineSearch: false,
    medicinesForm: false,
    medicineImportForm: false,
    unitForm: false,
    usageForm: false,
    diseaseForm: false,
  });
  const [refreshTriggers, setRefreshTriggers] = useState({
    examForms: 0,
    patients: 0,
    medicines: 0,
    diseases: 0,
  });

  const [editingUnit, setEditingUnit] = useState(null);
  const [editingUsage, setEditingUsage] = useState(null);
  const [editingDisease, setEditingDisease] = useState(null);

  // Pending patients - bệnh nhân chưa lưu vào database
  const [pendingPatients, setPendingPatients] = useState([]);

  // Thêm bệnh nhân tạm (chưa lưu database)
  const addPendingPatient = (patient) => {
    const tempId = `TEMP_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const pendingPatient = {
      ...patient,
      MaBN: tempId,
      isPending: true,
      createdAt: new Date().toISOString()
    };
    setPendingPatients(prev => [...prev, pendingPatient]);
    return pendingPatient;
  };

  // Xóa bệnh nhân pending (sau khi đã lưu vào database)
  const removePendingPatient = (tempId) => {
    setPendingPatients(prev => prev.filter(p => p.MaBN !== tempId));
  };

  // Lấy bệnh nhân pending theo CCCD
  const getPendingPatientByCCCD = (cccd) => {
    return pendingPatients.find(p => p.CCCD === cccd);
  };

  // Cập nhật bệnh nhân pending với MaBN thật từ database
  const updatePendingPatientWithRealId = (tempId, realMaBN) => {
    setPendingPatients(prev => prev.map(p => 
      p.MaBN === tempId ? { ...p, MaBN: realMaBN, isPending: false } : p
    ));
  };

  const triggerRefresh = (type) => {
    setRefreshTriggers(prev => ({
      ...prev,
      [type]: prev[type] + 1
    }));
  };

  return (
    <BottomSheetContext.Provider value={{ 
      isBottomSheetOpen, 
      setIsBottomSheetOpen,
      bottomSheetState,
      setBottomSheetState,
      refreshTriggers,
      triggerRefresh,
      editingUnit,
      setEditingUnit,
      editingUsage,
      setEditingUsage,
      editingDisease,
      setEditingDisease,
      // Pending patients
      pendingPatients,
      addPendingPatient,
      removePendingPatient,
      getPendingPatientByCCCD,
      updatePendingPatientWithRealId
    }}>
      {children}
    </BottomSheetContext.Provider>
  );
};

export const useBottomSheet = () => {
  const context = useContext(BottomSheetContext);
  if (!context) {
    throw new Error('useBottomSheet must be used within BottomSheetProvider');
  }
  return context;
};
