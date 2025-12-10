import React, { useEffect } from 'react';
import BottomSheet from '../pages/BottomSheet/BottomSheet';
import ExamineForm from '../pages/Examine/ExamineForm';
import PatientForm from '../pages/Examine/PatientForm';
import SearchPatient from '../pages/Examine/SearchPatient';
import { useBottomSheet } from '../contexts/BottomSheetContext';

const BottomSheetContainer = () => {
  const { bottomSheetState, setBottomSheetState, setIsBottomSheetOpen } = useBottomSheet();

  // Tự động set isBottomSheetOpen dựa trên bottomSheetState
  useEffect(() => {
    const anyOpen = Object.values(bottomSheetState).some(v => v);
    setIsBottomSheetOpen(anyOpen);
  }, [bottomSheetState, setIsBottomSheetOpen]);

  const handleClose = (sheetName) => {
    setBottomSheetState(prev => ({
      ...prev,
      [sheetName]: false
    }));
  };

  return (
    <>
      {/* Home Page BottomSheets */}
      <BottomSheet 
        isOpen={bottomSheetState.homeExamine} 
        onClose={() => handleClose('homeExamine')}
      >
        <ExamineForm/>
      </BottomSheet>

      <BottomSheet 
        isOpen={bottomSheetState.homePatient} 
        onClose={() => handleClose('homePatient')}
      >
        <PatientForm/>
      </BottomSheet>

      {/* Examine Page BottomSheets */}
      <BottomSheet 
        isOpen={bottomSheetState.examineExamine} 
        onClose={() => handleClose('examineExamine')}
      >
        <ExamineForm/>
      </BottomSheet>

      <BottomSheet 
        isOpen={bottomSheetState.examinePatient} 
        onClose={() => handleClose('examinePatient')}
      >
        <PatientForm/>
      </BottomSheet>

      <BottomSheet 
        isOpen={bottomSheetState.examineSearch} 
        onClose={() => handleClose('examineSearch')}
      >
        <SearchPatient/>
      </BottomSheet>
    </>
  );
};

export default BottomSheetContainer;
