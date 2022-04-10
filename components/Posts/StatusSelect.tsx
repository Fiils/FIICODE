import type { FC } from 'react';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';


interface StatusProps { 
    status: string[];
    handleChange: (e: any) => void;
}

const StatusSelect: FC<StatusProps> = ({ status, handleChange }) => {
  const matches = useMediaQuery('(min-width:1400px)')
  const matches_500 = useMediaQuery('(min-width:500px)')


    const customSelect = createTheme({
        palette: {
            primary: {
                main: '#6CAE75'
            }
        }
    })

    return (
        <ThemeProvider theme={customSelect}>
        <FormControl variant="standard" sx={{ m: 1, minWidth: matches_500 ? 180 : 100, width: '40%', maxWidth: 180, position: 'absolute', right: 0, mr: 1.5, bottom: !matches ? 50 : 'inherit' }}>
          <InputLabel id="sort-by-status">Sortează după statut</InputLabel>
          <Select
            MenuProps={{ disableScrollLock: true }}
            labelId="sort-by-status"
            id="sorting"
            value={status}
            onChange={handleChange}
            renderValue={(selected: string[]) => selected.join(', ')}
            label="Status"
            >
            <MenuItem value={'Trimis'}>
              <Checkbox checked={status.includes('Trimis')} />
              <ListItemText primary={'Trimis'} />
            </MenuItem>
            <MenuItem value={'Vizionat'}>
              <Checkbox checked={status.includes('Vizionat')} />
              <ListItemText primary={'Vizionat'} />
            </MenuItem>
            <MenuItem value={'În lucru'}>
              <Checkbox checked={status.includes('În lucru')} />
              <ListItemText primary={'În lucru'} />
            </MenuItem>
            <MenuItem value={'Efectuat'}>
              <Checkbox checked={status.includes('Efectuat')} />
              <ListItemText primary={'Efectuat'} />
            </MenuItem>
          </Select>
        </FormControl>
        </ThemeProvider>
    )
}

export default StatusSelect;