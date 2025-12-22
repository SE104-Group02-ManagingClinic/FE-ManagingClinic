import React, { useEffect } from 'react';
import BottomSheet from '../pages/BottomSheet/BottomSheet';
import ExamineForm from '../pages/Examine/ExamineForm';
import PatientForm from '../pages/Examine/PatientForm';
import SearchPatient from '../pages/Examine/SearchPatient';
import MedicineForm from '../pages/Medicines/MedicineForm';
import UnitForm from '../pages/Medicines/UnitForm';
import UsageForm from '../pages/Medicines/UsageForm';
import DiseaseForm from '../pages/Examine/DiseaseForm';
import { useBottomSheet } from '../contexts/BottomSheetContext';

const BottomSheetContainer = () => {
  const { 
    bottomSheetState, 
    setBottomSheetState, 
    setIsBottomSheetOpen, 
    triggerRefresh,
    editingUnit,
    setEditingUnit,
    editingUsage,
    setEditingUsage,
    editingDisease,
    setEditingDisease
  } = useBottomSheet();

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
        <ExamineForm 
          onSubmit={(result) => {
            console.log('Exam form created:', result);
            triggerRefresh('examForms');
            handleClose('homeExamine');
          }}
          onCancel={() => handleClose('homeExamine')}
        />
      </BottomSheet>

      <BottomSheet 
        isOpen={bottomSheetState.homePatient} 
        onClose={() => handleClose('homePatient')}
      >
        <PatientForm
          onSubmit={(result) => {
            console.log('Patient created:', result);
            triggerRefresh('patients');
            handleClose('homePatient');
          }}
          onCancel={() => handleClose('homePatient')}
        />
      </BottomSheet>

      {/* Examine Page BottomSheets */}
      <BottomSheet 
        isOpen={bottomSheetState.examineExamine} 
        onClose={() => handleClose('examineExamine')}
      >
        <ExamineForm 
          onSubmit={(result) => {
            console.log('Exam form created:', result);
            triggerRefresh('examForms');
            handleClose('examineExamine');
          }}
          onCancel={() => handleClose('examineExamine')}
        />
      </BottomSheet>

      <BottomSheet 
        isOpen={bottomSheetState.examinePatient} 
        onClose={() => handleClose('examinePatient')}
      >
        <PatientForm
          onSubmit={(result) => {
            console.log('Patient created:', result);
            triggerRefresh('patients');
            handleClose('examinePatient');
          }}
          onCancel={() => handleClose('examinePatient')}
        />
      </BottomSheet>

      <BottomSheet 
        isOpen={bottomSheetState.examineSearch} 
        onClose={() => handleClose('examineSearch')}
      >
        <SearchPatient/>
      </BottomSheet>

      {/* Medicines Page BottomSheets */}
      <BottomSheet 
        isOpen={bottomSheetState.medicinesForm} 
        onClose={() => handleClose('medicinesForm')}
      >
        <MedicineForm 
          onSubmit={() => {
            console.log('Medicine form submitted');
            triggerRefresh('medicines');
            handleClose('medicinesForm');
          }}
          onCancel={() => handleClose('medicinesForm')}
        />
      </BottomSheet>

      <BottomSheet 
        isOpen={bottomSheetState.unitForm} 
        onClose={() => {
          setEditingUnit(null);
          handleClose('unitForm');
        }}
      >
        <UnitForm 
          unit={editingUnit}
          onSubmit={() => {
            console.log('Unit form submitted');
            setEditingUnit(null);
            triggerRefresh('medicines');
            handleClose('unitForm');
          }}
          onCancel={() => {
            setEditingUnit(null);
            handleClose('unitForm');
          }}
        />
      </BottomSheet>

      <BottomSheet 
        isOpen={bottomSheetState.usageForm} 
        onClose={() => {
          setEditingUsage(null);
          handleClose('usageForm');
        }}
      >
        <UsageForm 
          usage={editingUsage}
          onSubmit={() => {
            console.log('Usage form submitted');
            setEditingUsage(null);
            triggerRefresh('medicines');
            handleClose('usageForm');
          }}
          onCancel={() => {
            setEditingUsage(null);
            handleClose('usageForm');
          }}
        />
      </BottomSheet>

      {/* Examine Page - Disease Form */}
      <BottomSheet 
        isOpen={bottomSheetState.diseaseForm} 
        onClose={() => {
          setEditingDisease(null);
          handleClose('diseaseForm');
        }}
      >
        <DiseaseForm 
          disease={editingDisease}
          onSubmit={() => {
            console.log('Disease form submitted');
            setEditingDisease(null);
            triggerRefresh('diseases');
            handleClose('diseaseForm');
          }}
          onCancel={() => {
            setEditingDisease(null);
            handleClose('diseaseForm');
          }}
        />
      </BottomSheet>
    </>
  );
};

export default BottomSheetContainer;
