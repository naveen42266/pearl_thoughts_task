import create from 'zustand';

type DateModel = {
  day: string;
  date: number;
  month: string;
  year: number;
};

export interface CustomRecurrence {
  interval: number;
  unit: 'days' | 'weeks' | 'months' | 'years';
}

type Days = {
  which: string;
  day: string;
  month: string;
};


export interface DatePickerState {
  futureDates: Date[];
  startDate: Date | null;
  endDate: Date | null;
  srtDate: DateModel | undefined;
  ndDate: DateModel | undefined;
  recurrence: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';
  customDays: Days;
  day: string[];
  open: boolean;
  customRecurrence: CustomRecurrence;

  setFutureDates: (dates: Date[]) => void;
  setSrtDate: (date: DateModel | undefined) => void;
  setNdDate: (date: DateModel | undefined) => void;
  updateStartDate: (date: Date | null) => void;
  updateEndDate: (date: Date | null) => void;
  updateRecurrence: (recurrence: DatePickerState['recurrence']) => void;
  setCustomDays: (field: string, value: any) => void;
  setDay: (days: string[]) => void;
  setOpen: (open: boolean) => void;
  setCustomRecurrence: (recurrence: CustomRecurrence) => void;
  updateCustomRecurrence: (custom: Partial<CustomRecurrence>) => void;
}

export const useDatePickerStore = create<DatePickerState>((set) => ({
  futureDates: [],
  startDate: null,
  endDate: null,
  srtDate: undefined,
  ndDate: undefined,
  recurrence: 'none',
  customDays: { which: '', day: '', month: '' },
  day: [],
  open: false,
  customRecurrence: { interval: 1, unit: 'days' },

  setFutureDates: (dates) => set({ futureDates: dates }),
  setSrtDate: (date) => set({ srtDate: date }),
  setNdDate: (date) => set({ ndDate: date }),
  updateStartDate: (date) => set({ startDate: date }),
  updateEndDate: (date) => set({ endDate: date }),
  updateRecurrence: (recurrence) => set({ recurrence }),
  setCustomDays: (field: string, value: any) =>set((state) => ({customDays: {...state.customDays,[field]: value,},})), 
  setDay: (days) => set({ day: days }),
  setOpen: (open) => set({ open }),
  setCustomRecurrence: (recurrence) => set({ customRecurrence: recurrence }),
  updateCustomRecurrence: (custom) => set((state) => ({
    customRecurrence: { ...state.customRecurrence, ...custom },
  })),
}));
