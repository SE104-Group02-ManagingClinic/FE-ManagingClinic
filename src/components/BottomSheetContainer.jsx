import React, { useEffect } from 'react';
import BottomSheet from '../pages/BottomSheet/BottomSheet';
import ExamineForm from '../pages/Examine/ExamineForm';
import PatientForm from '../pages/Examine/PatientForm';
import SearchPatient from '../pages/Examine/SearchPatient';
import PatientReception from '../pages/Examine/PatientReception';
import MedicineForm from '../pages/Medicines/MedicineForm';
import MedicineImportForm from '../pages/Medicines/MedicineImportForm';
import UnitForm from '../pages/Medicines/UnitForm';
import UsageForm from '../pages/Medicines/UsageForm';
import DiseaseForm from '../pages/Examine/DiseaseForm';
import { useBottomSheet } from '../contexts/BottomSheetContext';
import { useToast } from '../contexts/ToastContext';

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
    setEditingDisease,
    editingMedicine,
    setEditingMedicine
  } = useBottomSheet();
  const { showSuccess } = useToast();

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
        onClose={() => {
          setBottomSheetState(prev => ({ ...prev, examinePatientData: null }));
          handleClose('homeExamine');
        }}
      >
        <ExamineForm 
          initialPatient={bottomSheetState.examinePatientData}
          onSubmit={(result) => {
            showSuccess('Tạo phiếu khám thành công!');
            triggerRefresh('examForms');
            triggerRefresh('examList');
            setBottomSheetState(prev => ({ ...prev, examinePatientData: null }));
            handleClose('homeExamine');
          }}
          onCancel={() => {
            setBottomSheetState(prev => ({ ...prev, examinePatientData: null }));
            handleClose('homeExamine');
          }}
        />
      </BottomSheet>

      <BottomSheet 
        isOpen={bottomSheetState.homePatient} 
        onClose={() => handleClose('homePatient')}
      >
        <PatientForm
          onSubmit={(result) => {
            showSuccess('Thêm bệnh nhân thành công!');
            triggerRefresh('patients');
            handleClose('homePatient');
          }}
          onCancel={() => handleClose('homePatient')}
        />
      </BottomSheet>

      {/* Tiếp nhận bệnh nhân (Reception) */}
      <BottomSheet 
        isOpen={bottomSheetState.homeReception} 
        onClose={() => handleClose('homeReception')}
      >
        <PatientReception
          onSuccess={(patient) => {
            triggerRefresh('examList');
            triggerRefresh('patients');
            handleClose('homeReception');
          }}
          onCancel={() => handleClose('homeReception')}
        />
      </BottomSheet>

      {/* Examine Page BottomSheets */}
      <BottomSheet 
        isOpen={bottomSheetState.examineExamine} 
        onClose={() => handleClose('examineExamine')}
      >
        <ExamineForm 
          onSubmit={(result) => {
            showSuccess('Tạo phiếu khám thành công!');
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
            showSuccess('Thêm bệnh nhân thành công!');
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
        isOpen={bottomSheetState.medicineImportForm} 
        onClose={() => handleClose('medicineImportForm')}
      >
        <MedicineImportForm 
          onSubmit={() => {
            showSuccess('Nhập thuốc thành công!');
            triggerRefresh('medicines');
            handleClose('medicineImportForm');
          }}
          onCancel={() => handleClose('medicineImportForm')}
        />
      </BottomSheet>

      <BottomSheet 
        isOpen={bottomSheetState.medicinesForm} 
        onClose={() => {
          setEditingMedicine(null);
          handleClose('medicinesForm');
        }}
      >
        <MedicineForm 
          medicine={editingMedicine}
          onSubmit={() => {
            showSuccess('Lưu thuốc thành công!');
            setEditingMedicine(null);
            triggerRefresh('medicines');
            handleClose('medicinesForm');
          }}
          onCancel={() => {
            setEditingMedicine(null);
            handleClose('medicinesForm');
          }}
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
            showSuccess('Lưu đơn vị tính thành công!');
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
            showSuccess('Lưu cách dùng thành công!');
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
            showSuccess('Lưu bệnh thành công!');
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
