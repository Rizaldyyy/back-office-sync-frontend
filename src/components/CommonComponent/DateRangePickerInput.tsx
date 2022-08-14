import React, { useState } from 'react';

// boostrap
import DateRangePicker from 'react-bootstrap-daterangepicker';
import 'bootstrap-daterangepicker/daterangepicker.css';
import moment from 'moment'; //moment

interface DatePickerProps {
    fn?: any;
}

const DateRangePickerInput = ({ fn } : DatePickerProps) => {

    return (
        <DateRangePicker
            initialSettings={{ 
                startDate: new Date(), 
                endDate: new Date(),
                showDropdowns: true,
                ranges: {
                    'Today': [moment().subtract(0, 'days'), moment().subtract(0, 'days')],
                    'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
                    'This Month': [moment().startOf('month'), moment().endOf('month')],
                    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
                }
            }}
            onCallback={fn}
        >
            <input type="text" className="form-control" name="dateFrom"/>
        </DateRangePicker>
    );
};

export default DateRangePickerInput;
