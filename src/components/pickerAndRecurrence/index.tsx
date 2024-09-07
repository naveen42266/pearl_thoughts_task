import { useDatePickerStore } from "@/stores/useDatePickerStore";
import DatePicker from 'react-datepicker';
import { DatePickerState } from '@/stores/useDatePickerStore';
import { addDays, addWeeks, addMonths, addYears, startOfMonth, getDay, isWeekend, lastDayOfMonth } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';

export interface DateModel {
    day: string | '',
    date: number | 0,
    month: string | '',
    year: number | 0,
}
const PickerAndRecurrenceComponent = () => {
    const {
        startDate,
        endDate,
        srtDate,
        ndDate,
        recurrence,
        day,
        setFutureDates,
        setSrtDate,
        setNdDate,
        updateStartDate,
        updateEndDate,
        updateRecurrence,
        setDay,
        setOpen,
        setCustomDays
    } = useDatePickerStore();
    const dateInfo = srtDate ? getOrdinalOfDay(srtDate.day as any, srtDate.date, srtDate.month, srtDate.year) : { ordinal: '', isFourthLast: false };

    function getOrdinalOfDay(
        day: "Sunday" | "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | undefined,
        date: number | undefined,
        month: string | undefined,
        year: number | undefined
    ): { ordinal: string, isFourthLast: boolean } {
        if (!day || !date || !month || !year) {
            return { ordinal: "Invalid date", isFourthLast: false };
        }
        const monthNames = [
            "January", "February", "March", "April", "May", "June", "July",
            "August", "September", "October", "November", "December"
        ];
        const monthIndex = monthNames.indexOf(month);
        if (monthIndex === -1) {
            return { ordinal: "Invalid month", isFourthLast: false };
        }
        const dayIndices = {
            Sunday: 0,
            Monday: 1,
            Tuesday: 2,
            Wednesday: 3,
            Thursday: 4,
            Friday: 5,
            Saturday: 6
        };
        const targetDayIndex = dayIndices[day];
        const occurrences: number[] = [];
        for (let day = 1; day <= 31; day++) {
            const currentDate = new Date(year, monthIndex, day);
            if (currentDate.getMonth() !== monthIndex) break;
            if (currentDate.getDay() === targetDayIndex) {
                occurrences.push(day);
            }
        }
        const dayIndex = occurrences.indexOf(date);
        if (dayIndex === -1) {
            return { ordinal: "Not a valid date for the specified day in the month", isFourthLast: false };
        }
        const ordinals = ["first", "second", "third", "fourth", "last"];
        const isFourthLast = occurrences.length === 4 && dayIndex === 3;
        if (dayIndex === occurrences.length - 1) {
            return { ordinal: "last", isFourthLast };
        }
        return { ordinal: ordinals[dayIndex], isFourthLast };
    }


    function handleDate(date: Date | any, type: string) {
        const newFormate = new Date(date);
        const formate: DateModel = {
            day: newFormate.toLocaleString('en-US', { weekday: 'long' }),
            date: newFormate.getDate(),
            month: newFormate.toLocaleString('en-US', { month: 'long' }),
            year: newFormate.getFullYear(),
        };

        if (type === 'start') {
            setSrtDate(formate);
            setFutureDates([]);
            setCustomDays('unit', 'days');
            setCustomDays('field1', null);
            setCustomDays('field2', null);
        } else {
            setNdDate(formate);
            setFutureDates([]);
            setCustomDays('unit', 'days');
            setCustomDays('field1', null);
            setCustomDays('field2', null);
        }
    }


    function handleCounts(value: string) {
        if (!srtDate) return;
        const startDate = new Date(srtDate.year!, getMonthIndex(srtDate.month!), srtDate.date!);

        if (value === 'daily') {
            const dates = Array.from({ length: 364 }, (_, i) => addDays(startDate, i + 1));
            setFutureDates([startDate, ...dates]);
        } else if (value === 'weekly') {
            const dates = Array.from({ length: 365 }, (_, i) => addWeeks(startDate, i + 1));
            setFutureDates([startDate, ...dates]);
        } else if (value.includes('monthly')) {
            handleMonthlyCounts(value as any, startDate);
        } else if (value === 'yearly') {
            handleYearlyCounts(startDate);
        } else if (value === 'everyWeekDay') {
            const dates = [];
            let day = startDate;
            while (dates.length < 19) {
                day = addDays(day, 1);
                if (!isWeekend(day)) {
                    dates.push(day);
                }
            }
            setFutureDates([startDate, ...dates]);
        } else if (value === 'custom') {
            setOpen(true)
            let data = srtDate.day[0] + srtDate.day[1]
            day.push(data)
            setDay(day)
        }
    }

    function handleCountsStartEndDate(value: string) {
        if (!srtDate || !ndDate) return;

        const startDate = new Date(srtDate.year!, getMonthIndex(srtDate.month!), srtDate.date!);
        const endDate = new Date(ndDate.year!, getMonthIndex(ndDate.month!), ndDate.date!);

        if (value === 'daily' && srtDate.date === ndDate.date) {
            const dates = Array.from({ length: 365 }, (_, i) => addDays(startDate, i));
            setFutureDates([startDate, ...dates]);
        }
        else if (value === 'weekly') {
            const dates = [];
            for (let i = 0; i < 365; i++) {
                const currentStartDate = addWeeks(startDate, i);
                const currentEndDate = addWeeks(endDate, i);
                let tempDate = new Date(currentStartDate);
                while (tempDate <= currentEndDate) {
                    dates.push(new Date(tempDate));
                    tempDate.setDate(tempDate.getDate() + 1);
                }
            }
            setFutureDates(dates);
        }
        else if (value === 'monthly') {
            const dates = [];
            for (let i = 0; i < 365; i++) {
                const currentStartDate = addMonths(startDate, i);
                const currentEndDate = addMonths(endDate, i);

                let tempDate = new Date(currentStartDate);
                while (tempDate <= currentEndDate) {
                    dates.push(new Date(tempDate));
                    tempDate.setDate(tempDate.getDate() + 1);
                }
            }
            setFutureDates(dates);
        }
        else if (value === 'yearly') {
            const dates = [];
            for (let i = 0; i < 365; i++) {
                const currentStartDate = addYears(startDate, i);
                const currentEndDate = addYears(endDate, i);
                let tempDate = new Date(currentStartDate);
                while (tempDate <= currentEndDate) {
                    dates.push(new Date(tempDate));
                    tempDate.setDate(tempDate.getDate() + 1);
                }
            }

            setFutureDates(dates);
        }

        else if (value === 'everyWeekDay') {
            const dates = [];
            let day = startDate;
            while (dates.length < 19) {
                day = addDays(day, 1);
                if (!isWeekend(day)) {
                    dates.push(day);
                }
            }
            setFutureDates([startDate, ...dates]);
        }
        else if (value === 'custom') {
            setOpen(true);
            let data = srtDate.day[0] + srtDate.day[1];
            day.push(data);
            setDay(day);
        }
    }

    function getMonthIndex(month: string): number {
        const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        return months.indexOf(month);
    }

    function handleMonthlyCounts(
        value: 'monthlyfirst' | 'monthlysecond' | 'monthlythird' | 'monthlyfourth' | 'monthlylast',
        startDate: Date
    ) {
        const dayOfWeek = getDay(startDate);
        const getSpecificWeekdayInMonth = (monthOffset: number, weekIndex: number) => {
            let monthStart = startOfMonth(addMonths(startDate, monthOffset));
            let count = 0;
            while (count < 5) {
                if (getDay(monthStart) === dayOfWeek) count++;
                if (count === weekIndex) return monthStart;
                monthStart = addDays(monthStart, 1);
            }
        };

        const ordinalMapping = {
            monthlyfirst: 1,
            monthlysecond: 2,
            monthlythird: 3,
            monthlyfourth: 4,
            monthlylast: 5,
        };

        const weekIndex = ordinalMapping[value];
        const dates = Array.from({ length: 365 }, (_, i) => getSpecificWeekdayInMonth(i, weekIndex)) as any;
        setFutureDates(dates);
    }

    function handleYearlyCounts(startDate: Date) {
        const month = startDate.getMonth();
        const day = startDate.getDate();

        const dates = Array.from({ length: 365 }, (_, i) => {
            return new Date(startDate.getFullYear() + i, month, day);
        });

        setFutureDates(dates);
    }

    return <div className="">
        <h3 className="text-lg font-semibold mb-4">Select Date and Recurrence</h3>
        <div className="mb-4">
            <label className="block font-medium">Start Date</label>
            <DatePicker
                selected={startDate}
                onChange={(date) => { updateStartDate(date), handleDate(date, 'start') }}
                className="w-full border p-2 rounded"
                placeholderText="Select start date"
            />
        </div>
        <div className="mb-4">
            <label className="block font-medium">End Date</label>
            <DatePicker
                selected={endDate}
                onChange={(date) => { updateEndDate(date), handleDate(date, 'end') }}
                className="w-full border p-2 rounded"
                placeholderText="Select end date (optional)"
                isClearable
            />
        </div>
        <div className="mb-4">
            <h4 className="font-medium">Recurrence</h4>
            {startDate && !endDate &&
                <select
                    value={recurrence}
                    onChange={(e) => { updateRecurrence(e.target.value as DatePickerState['recurrence']), handleCounts(e.target.value) }}
                    className="w-full border p-2 rounded"
                >
                    <option value="none">None</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly on {srtDate?.day}</option>
                    {dateInfo.isFourthLast && (
                        <option value="monthlyfourth">Monthly on the fourth {srtDate?.day}</option>
                    )}
                    <option value={'monthly' + `${dateInfo.ordinal}`}>Monthly on the {dateInfo.ordinal} {srtDate?.day}</option>
                    <option value="yearly">Yearly on {srtDate?.month} {srtDate?.date}</option>
                    <option value="everyWeekDay">Every weekday (Monday to Friday)</option>
                    <option value="custom">Custom</option>
                </select>}
            {startDate && endDate && (
                <select
                    value={recurrence}
                    onChange={(e) => {
                        updateRecurrence(e.target.value as DatePickerState['recurrence']);
                        handleCountsStartEndDate(e.target.value);
                    }}
                    className="w-full border p-2 rounded"
                >
                    <option value="none">None</option>
                    {srtDate && ndDate && srtDate.date === ndDate.date && <option value="daily">Daily</option>}
                    <option value="weekly">Weekly from {srtDate?.day} to {ndDate?.day}</option>
                    {dateInfo.isFourthLast && (
                        <option value="monthlyfourth">Monthly on the fourth {srtDate?.day} to {ndDate?.day}</option>
                    )}
                    <option value={'monthly' + `${dateInfo.ordinal}`}>Monthly on the {dateInfo.ordinal} {srtDate?.day} to {ndDate?.day}</option>
                    <option value="yearly">Yearly from {srtDate?.month} {srtDate?.date} to {ndDate?.date}</option>
                    <option value="everyWeekDay">Every weekday (Monday to Friday)</option>
                    {/* <option value="custom">Custom</option> */}
                </select>
            )}
        </div>
    </div>
}

export default PickerAndRecurrenceComponent;