import { Box,useTheme } from "@mui/system";
import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { useEffect } from "react";


// test
import { useSelector } from 'react-redux';
import { NumberCovertLetter } from "../scenes/googlesheetviewPage/TableWidget";
import { createMarkup } from "./CkeditorInput";
import { extractUrlFromString } from "../scenes/formmodelviewpage/TableWidget2";

// width 外面Box 控制 , 高度 TableContainer 控制
const Table_Pro = ({
    columns,
    rows,
    column,
    sx
}) =>{
    const theme = useTheme();
    const alt  = theme.palette.background.alt;
    return (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={sx}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            <TableCell></TableCell>
                            {columns.map((column) => (
                                <TableCell
                                    key={column}
                                    // align={column}
                                    style={{ minWidth: 10 }}
                                    >
                                    {column}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            Object.entries(rows).map(([key,value])=>{
                                const body = []
                                var count = 0
                                body.push(
                                    <TableCell
                                        key={NumberCovertLetter(count)+'key'}
                                        sx={{
                                            backgroundColor:"#52BE80"
                                        }}
                                    >
                                        {key}
                                    </TableCell>
                                )
                                for(const num in value){
                                    var cell = (<span 
                                        className="CkeditorInput"
                                        dangerouslySetInnerHTML={createMarkup(extractUrlFromString(value[num]).replaceAll('\n','<br />'))}
                                    >
                                    </span>)
                                    const item = (
                                        <TableCell
                                            key={NumberCovertLetter(count)+key}
                                            sx={{
                                                fontWeight:"500",
                                            }}
                                        >
                                            {cell}
                                        </TableCell>
                                    )
                                    body.push(item)
                                    count+=1
                                }
                                while (count<column){
                                    const item = (
                                        <TableCell
                                            key={NumberCovertLetter(count)+key}
                                        >
                                            
                                        </TableCell>
                                    )
                                    body.push(item)
                                    count+=1
                                }
                                return(
                                    <TableRow
                                        key = {key}
                                        sx={{
                                            '&:last-child td, &:last-child th': { border: 0 },
                                            cursor:"default",
                                            backgroundColor:alt,
                                            
                                        }}
                                    >
                                        {body}
                                    </TableRow>
                                )
                            })
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    )
}





export default Table_Pro;