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
                                        dangerouslySetInnerHTML={createMarkup(value[num].replaceAll('\n','<br />'))}
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



const columns = [
  { id: 'name', label: 'Name', minWidth: 170 },
  { id: 'code', label: 'ISO\u00a0Code', minWidth: 100 },
  {
    id: 'population',
    label: 'Population',
    minWidth: 170,
    align: 'right',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'size',
    label: 'Size\u00a0(km\u00b2)',
    minWidth: 170,
    align: 'right',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'density',
    label: 'Density',
    minWidth: 170,
    align: 'right',
    format: (value) => value.toFixed(2),
  },
];

function createData(name, code, population, size) {
  const density = population / size;
  return { name, code, population, size, density };
}

const rows = [
  createData('India', 'IN', 1324171354, 3287263),
  createData('China', 'CN', 1403500365, 9596961),
  createData('Italy', 'IT', 60483973, 301340),
  createData('United States', 'US', 327167434, 9833520),
  createData('Canada', 'CA', 37602103, 9984670),
  createData('Australia', 'AU', 25475400, 7692024),
  createData('Germany', 'DE', 83019200, 357578),
  createData('Ireland', 'IE', 4857000, 70273),
  createData('Mexico', 'MX', 126577691, 1972550),
  createData('Japan', 'JP', 126317000, 377973),
  createData('France', 'FR', 67022000, 640679),
  createData('United Kingdom', 'GB', 67545757, 242495),
  createData('Russia', 'RU', 146793744, 17098246),
  createData('Nigeria', 'NG', 200962417, 923768),
  createData('Brazil', 'BR', 210147125, 8515767),
];

export const StickyHeadTable =() => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }} >
      <TableContainer sx={{ maxHeight: 700 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === 'number'
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      {/* <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      /> */}
    </Paper>
  );
}


export default Table_Pro;