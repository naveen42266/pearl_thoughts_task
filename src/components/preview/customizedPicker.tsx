import { LocalizationProvider, DateCalendar, PickersDay } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { styled } from '@mui/material/styles';
import React from 'react';

interface CustomDateCalendarProps {
    dates: any;
}

const CustomDateCalendar: React.FC<CustomDateCalendarProps> = ({ dates }) => {
    // Convert dates to Dayjs format
    const futureDatesDayjs = dates.map((date: string | number | dayjs.Dayjs | Date | null | undefined) => dayjs(date));

    // Check if a specific day should be highlighted
    function isHighlighted(day: Dayjs) {
        return futureDatesDayjs.some((date: string | number | dayjs.Dayjs | Date | null | undefined) => day.isSame(date, 'day'));
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar
                // Customize the day slots
                slots={{
                    day: (dayProps) => {
                        const isSelected = isHighlighted(dayProps.day);
                        return (
                            <PickersDay
                                {...dayProps}
                                sx={{
                                    backgroundColor: isSelected ? '#ffc107' : 'transparent',
                                    '&:hover': {
                                        backgroundColor: isSelected ? '#ffca28' : undefined,
                                    },
                                }}
                            />
                        );
                    },
                }}
            />
        </LocalizationProvider>
    );
};

export default CustomDateCalendar;

