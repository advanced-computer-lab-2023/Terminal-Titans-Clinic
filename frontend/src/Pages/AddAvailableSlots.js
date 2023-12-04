import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import { DesktopDateTimePicker } from '@mui/x-date-pickers/DesktopDateTimePicker';
import { StaticDateTimePicker } from '@mui/x-date-pickers/StaticDateTimePicker';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { useEffect } from 'react';
//not finished yet
export default function AddAvailableSlots() {
    const [value, setValue] = React.useState(dayjs());
    useEffect(() => {
        console.log(value);
    }, [value]);
    return (
        <div style={{width:'50%'}}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer
          components={[
           
            'StaticDatePicker'
          ]}
        >
       
       <DemoItem label="Static variant">
  <StaticDatePicker value={value} onChange={(newValue) => setValue(newValue)}/>
</DemoItem>
        </DemoContainer>
      </LocalizationProvider>
    </div>
    );
  }