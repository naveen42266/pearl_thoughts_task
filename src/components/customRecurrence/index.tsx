import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useDatePickerStore } from '@/stores/useDatePickerStore';
import { addDays, addWeeks, addMonths, addYears, startOfMonth, getDay, lastDayOfMonth } from 'date-fns';
import type { CustomRecurrence } from '../../stores/useDatePickerStore';

interface Days {
    which: string | '',
    day: string | '',
    month: string | ''
}
const CustomRecurrenceComponent = () => {
    const {
        srtDate,
        customDays,
        day,
        open,
        customRecurrence,
        setFutureDates,
        setCustomDays,
        setDay,
        setOpen,
        updateCustomRecurrence
    } = useDatePickerStore();
    type Month = 'january' | 'february' | 'march' | 'april' | 'may' | 'june' | 'july' | 'august' | 'september' | 'october' | 'november' | 'december';
    type Day = 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';
    type DayAbbreviation = 'Su' | 'Mo' | 'Tu' | 'We' | 'Th' | 'Fr' | 'Sa';

    function getMonthIndex(month: string): number {
        const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        return months.indexOf(month);
    }

    const handleClose = () => {
        setOpen(false);
    };

    const handleCustomSave = () => {
        if (!srtDate) return; 
        const startDate = new Date(srtDate.year!, getMonthIndex(srtDate.month!), srtDate.date!);
        if (customRecurrence.unit === 'days') {
            const dates = Array.from({ length: customRecurrence.interval }, (_, i) => addDays(startDate, i));
            setFutureDates(dates);
        } else if (customRecurrence.unit === 'weeks') {
            const daysOfWeek: { [key in DayAbbreviation]: number } = {
                Su: 0,
                Mo: 1,
                Tu: 2,
                We: 3,
                Th: 4,
                Fr: 5,
                Sa: 6,
            };

            const selectedDays = day.map(d => daysOfWeek[d as DayAbbreviation]);
            const dates: Date[] = [];

            for (let i = 0; i < customRecurrence.interval; i++) {
                const weekStart = addWeeks(startDate, i); 
                selectedDays.forEach(dayIndex => {
                    const dayDate = addDays(weekStart, (dayIndex - getDay(weekStart) + 7) % 7);
                    dates.push(dayDate);
                });
            }

            setFutureDates(dates);
        } else if (customRecurrence.unit === 'months') {
            const dates: Date[] = [];
            for (let i = 0; i < customRecurrence.interval; i++) {
                const nthDayInMonth = getNthDayInMonth(addMonths(startDate, i), customDays.which, customDays.day as any);
                if (nthDayInMonth) dates.push(nthDayInMonth);
            }
            setFutureDates(dates);
        } else if (customRecurrence.unit === 'years') {
            const dates: Date[] = [];
            for (let i = 0; i < customRecurrence.interval; i++) {
                const year = addYears(startDate, i).getFullYear();
                const nthDayInYear = getNthDayInMonth(new Date(year, getMonthIndexForCustom(customDays?.month as any)), customDays.which, customDays.day as any);
                if (nthDayInYear) dates.push(nthDayInYear);
            }
            setFutureDates(dates);
        }
        handleClose();
    };

    function getMonthIndexForCustom(month: Month): number {
        const months: { [key in Month]: number } = {
            january: 0,
            february: 1,
            march: 2,
            april: 3,
            may: 4,
            june: 5,
            july: 6,
            august: 7,
            september: 8,
            october: 9,
            november: 10,
            december: 11,
        };
        return months[month];
    }

    function getNthDayInMonth(date: Date, which: string, day: Day): Date | null {
        const targetDayIndex = getDayIndex(day); 
        const monthStart = startOfMonth(date); 
        const lastDay = lastDayOfMonth(date);
        let dayCount = 0;
        let currentDate = monthStart;
        while (currentDate <= lastDay) {
            if (getDay(currentDate) === targetDayIndex) {
                dayCount++;
                if (isMatchingWeek(which, dayCount)) {
                    return currentDate;
                }
            }
            currentDate = addDays(currentDate, 1);
        }
        return null; 
    }

    function getDayIndex(day: Day): number {
        const daysOfWeek: { [key in Day]: number } = {
            sunday: 0,
            monday: 1,
            tuesday: 2,
            wednesday: 3,
            thursday: 4,
            friday: 5,
            saturday: 6,
        };

        return daysOfWeek[day];
    }


    function isMatchingWeek(which: string, count: number): boolean {
        if (which === 'first' && count === 1) return true;
        if (which === 'second' && count === 2) return true;
        if (which === 'third' && count === 3) return true;
        if (which === 'fourth' && count === 4) return true;
        if (which === 'fifth' && count === 5) return true;
        if (which === 'last') return true; 
        return false;
    }

    function handleSetDay(data: string) {
        if (day.includes(data)) {
            if (day.length > 1) {
                const newDays = day.filter(d => d !== data);
                setDay(newDays);
            } else {
                alert('You must select at least one day.');
            }
        } else {
            setDay([...day, data]);
        }
    }

    const handleChange = (field: keyof Days, value: any) => {
        // setCustomdays((prevState) => ({
        //   ...prevState,
        //   [field]: value,
        // }));
        setCustomDays(field, value);

    };
    return <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
            component: 'form',
            onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                event.preventDefault();
                handleCustomSave();
            },
        }}
    >
        <DialogTitle>Custom Recurrence</DialogTitle>
        <DialogContent>
            <div className="flex items-center gap-2">
                <div>Repeat every</div>
                <input
                    type="number"
                    min="1"
                    max="365"
                    value={customRecurrence.interval}
                    onChange={(e) =>
                        updateCustomRecurrence({ interval: Number(e.target.value) })
                    }
                    className="border p-2 rounded w-16"
                />
                <select
                    value={customRecurrence.unit}
                    onChange={(e) =>
                        updateCustomRecurrence({ unit: e.target.value as CustomRecurrence['unit'] })
                    }
                    className="border p-2 rounded"
                >
                    <option value="days">Days</option>
                    <option value="weeks">Weeks</option>
                    <option value="months">Months</option>
                    <option value="years">Years</option>
                </select>
            </div>
            {customRecurrence.unit === 'weeks' &&
                <div>
                    <div>Repeat on</div>
                    <div className='flex gap-2 items-center py-2'>
                        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']?.map((each, index) => {
                            return (
                                <div
                                    key={index}
                                    className={`${day.includes(each) ? 'bg-blue-800 text-white' : 'bg-slate-300 text-black'} border border-gray-100 bg-slate-300 text-black rounded-full h-8 w-8 pt-0.5 text-center`}
                                    onClick={() => handleSetDay(each)}
                                >
                                    {each[0]}
                                </div>
                            );
                        })}
                    </div>
                </div>
            }
            {customRecurrence.unit === 'months' &&
                <div className="flex items-center gap-2 py-2">
                    <select
                        value={customDays?.which}
                        onChange={(e) => handleChange('which', e.target.value)}
                        className="border p-2 rounded"
                    >
                        <option value="first">First</option>
                        <option value="second">Second</option>
                        <option value="third">Third</option>
                        <option value="fourth">Fourth</option>
                        <option value="fifth">Fifth</option>
                        <option value="last">Last</option>
                    </select>
                    <select
                        value={customDays?.day}
                        onChange={(e) => handleChange('day', e.target.value)}
                        className="border p-2 rounded"
                    >
                        <option value="sunday">Sunday</option>
                        <option value="monday">Monday</option>
                        <option value="tuesday">Tuesday</option>
                        <option value="wednesday">Wednesday</option>
                        <option value="thusday">Thusday</option>
                        <option value="friday">Friday</option>
                        <option value="saturday">Saturday</option>
                    </select>
                </div>
            }
            {customRecurrence.unit === 'years' &&
                <div className="flex items-center gap-2 py-2">
                    <select
                        value={customDays?.month}
                        onChange={(e) => handleChange('month', e.target.value)}
                        className="border p-2 rounded"
                    >
                        <option value="january">January</option>
                        <option value="february">February</option>
                        <option value="march">March</option>
                        <option value="april">April</option>
                        <option value="may">May</option>
                        <option value="june">June</option>
                        <option value="july">July</option>
                        <option value="august">August</option>
                        <option value="september">September</option>
                        <option value="octomber">Octomber</option>
                        <option value="november">November</option>
                        <option value="december">December</option>
                    </select>
                    <select
                        value={customDays?.which}
                        onChange={(e) => handleChange('which', e.target.value)}
                        className="border p-2 rounded"
                    >
                        <option value="first">First</option>
                        <option value="second">Second</option>
                        <option value="third">Third</option>
                        <option value="fourth">Fourth</option>
                        <option value="fifth">Fifth</option>
                        <option value="last">Last</option>
                    </select>
                    <select
                        value={customDays?.day}
                        onChange={(e) => handleChange('day', e.target.value)}
                        className="border p-2 rounded"
                    >
                        <option value="sunday">Sunday</option>
                        <option value="monday">Monday</option>
                        <option value="tuesday">Tuesday</option>
                        <option value="wednesday">Wednesday</option>
                        <option value="thusday">Thusday</option>
                        <option value="friday">Friday</option>
                        <option value="saturday">Saturday</option>
                    </select>
                </div>
            }
        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit">Save</Button>
        </DialogActions>
    </Dialog>
}
export default CustomRecurrenceComponent