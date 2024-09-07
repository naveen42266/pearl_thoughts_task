import React from 'react';
import PerviewComponent from './preview';
import CustomRecurrenceComponent from './customRecurrence';
import PickerAndRecurrenceComponent from './pickerAndRecurrence';
import { useDatePickerStore } from "@/stores/useDatePickerStore";

export interface DateModel {
  day: string | '',
  date: number | 0,
  month: string | '',
  year: number | 0,
}
const DatePickerComponent: React.FC = () => {
  const {
    setFutureDates,
    updateStartDate,
    updateEndDate,
    setCustomDays
  } = useDatePickerStore();
 
  const handleCancel = () => {
    setFutureDates([]);  
    updateStartDate(null);  
    updateEndDate(null);   
    setCustomDays('field1', null);
    setCustomDays('field2', null);  
  };
  return (
    <div className="p-6 bg-white rounded-lg shadow-md flex flex-col">
      <div className='flex flex-col justify-center md:flex-row md:justify-between '>
        <PickerAndRecurrenceComponent />
        <PerviewComponent />
      </div>
      <div className='flex justify-end'><div className='bg-blue-500 text-white px-4 py-2 rounded-md' onClick={handleCancel}>Cancel</div></div>
      <CustomRecurrenceComponent />
    </div>
  );
};

export default DatePickerComponent;
