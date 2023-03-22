import { 
    Box,
    Paper, 
    TableContainer,
    TableHead,
    TableRow,
    TableCell,
    Table,
    TableBody
} from '@mui/material';

import { createMarkup } from '../CkeditorInput';
import { useSelector } from 'react-redux';
import { extractUrlFromString } from '../../scenes/formmodelviewpage/TableWidget2';
const Form_Table = ({
    formlist,
    sx,
    formmodel
})=>{
    const columns = Object.keys(formmodel['schema'])
    console.log(formlist,columns)
    // const WindowHeight = useSelector((state)=>state.height);
    return (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer  sx={sx}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            <TableCell></TableCell>
                            {
                                Object.entries(formmodel['schema']).map(([key,value])=>{
                                    const {label,field,sx} = value;
                                    var len = sx['gridColumn']
                                    var len = parseInt(len.replaceAll('span ',''))
                 
                                    if (field !== 'blank'){
                                        return (
                                            <TableCell
                                                sx={{minWidth: len*100}}
                                            >
                                                {label}
                                            </TableCell>
                                        )
                                    }
                                    
                                })
                            }
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            formlist.map((formdata)=>{
                                const {_id,data,comments} = formdata;
                                return <TableRow
                                    key={_id}
                                >
                                    <TableCell></TableCell>
                                    {
                                        Object.entries(data).map(([key,value])=>{
                                            return (
                                                <TableCell
                                                    key={key}
                                                >
                                                    <span 
                                                        className="CkeditorInput"
                                                        dangerouslySetInnerHTML={createMarkup(extractUrlFromString(value).replaceAll('\n','<br />'))}
                                                    ></span>
                                                </TableCell>
                                            )
                                            
                                        })
                                    }
                                  
                                </TableRow>
                            })
                        }
                    </TableBody>

                </Table>
            </TableContainer>
        </Paper>
    )
}

export default Form_Table;