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
      setEditingDisease
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
