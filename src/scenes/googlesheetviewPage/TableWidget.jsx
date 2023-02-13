
import { useState, useEffect,useContext,useRef,useImperativeHandle,forwardRef } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import FlexBetween from '../../components/Flexbetween';
import { Box, useTheme } from '@mui/material';
import { ColumnDefault } from '../../state';
import { createMarkup } from '../../components/CkeditorInput';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
export const NumberCovertLetter = (value) =>{
    var temp = ""
    if (value>26){
        if (value%26 === 0){
            var first = parseInt(value/26)-1
            var second = 26
        }else{
            var first = parseInt(value/26)
            var second = value%26
        }
        
        temp+=(ColumnDefault.get(first)+ColumnDefault.get(second))
    }else{
        temp = ColumnDefault.get(value)
    }
    return temp
}


const  getByValue = (map, searchValue)=>{
    // getByValue(ColumnDefault, 'H')
    for (let [key, value] of map.entries()) {
      if (value === searchValue)
        return key;
    }
}
  

export const TableWidget = forwardRef(({
    SheetData
},ref)=>{
    const TopRef = useRef();
    var column = 0
    const titlelist = []
    const columndict = {}
    const theme = useTheme();
    const alt  = theme.palette.background.alt;
    var countrow = 1
    for (const num in SheetData){
        if (SheetData[num].length>column){
            column = (SheetData[num].length)
        }
        columndict[countrow] = SheetData[num]
        countrow+=1
    }
    for (var i=1 ; i<=column ;i++){
        const temp =NumberCovertLetter(i)
        titlelist.push(temp)
    }
    useEffect(()=>{
        
    },[])
    

    return(
        <TableContainer component={Paper} sx={{
            overflow: "initial",
        }}
        >
            <Table 
                sx={{ 
                    minWidth: 650, 
                    
                }}
                stickyHeader
            >
                <TableHead                    
                    ref={TopRef} 
                >
                    <TableRow
                        sx={{
                            position:"relative"
                        }}
                    >
                        <TableCell>

                        </TableCell>
                 
                        {
                            titlelist.map((title)=>{
                                return(
                                    <TableCell
                                        key={title}
                                        sx={{
                                            backgroundColor:"#85C1E9",

                                        }}
                                        
                                    >
                                        <FlexBetween>
                                        <Box>
                                            {title}
                                        </Box>
                                        <FilterAltIcon 
                                            fontSize='small'
                                            sx={{
                                                color:"#616A6B"
                                            }}
                                        />
                                        </FlexBetween>

                                    </TableCell>
                                )
                            })
                        }
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        
                        Object.entries(columndict).map(([key,value])=>{
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
                                    dangerouslySetInnerHTML={createMarkup(value[num])}
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
    )
})