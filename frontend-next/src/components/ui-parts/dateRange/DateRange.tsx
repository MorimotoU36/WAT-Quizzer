import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

export interface DateRangeProps {
  setStartState: (value: Date | null) => void;
  setEndState: (value: Date | null) => void;
}

export const DateRange = ({ setStartState, setEndState }: DateRangeProps) => {
  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker label="Start Date" className="inline max-w-[230px]" onChange={setStartState} />
      </LocalizationProvider>
      〜
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker label="End Date" className="inline max-w-[230px]" onChange={setEndState} />
      </LocalizationProvider>
    </>
  );
};
