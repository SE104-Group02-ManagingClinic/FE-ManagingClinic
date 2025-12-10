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
  });

  return (
    <BottomSheetContext.Provider value={{ 
      isBottomSheetOpen, 
      setIsBottomSheetOpen,
      bottomSheetState,
      setBottomSheetState
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
