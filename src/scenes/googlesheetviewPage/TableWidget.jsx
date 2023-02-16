
import { useState, useEffect,useContext,useRef,useImperativeHandle,forwardRef } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import FlexBetween from '../../components/Flexbetween';
import { Box, Divider, Typography, useTheme } from '@mui/material';
import { ColumnDefault } from '../../state';
import { createMarkup } from '../../components/CkeditorInput';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import Table_Pro from '../../components/Table_Pro';
import { useSelector } from 'react-redux';

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

  



export const TableWidget = ({
    SheetData
})=>{
    const WindowHeight = useSelector((state)=>state.height);
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
    console.log('titlelist',typeof SheetData)

    useEffect(()=>{
        
    },[])
    

    return(
        <Box >
            <Table_Pro 
                columns={titlelist}
                rows = {SheetData}
                column = {column}
                sx={{maxHeight:WindowHeight*0.85}}
            />
            <Divider />
            <Box
                sx={{backgroundColor:alt}}
               
            >   
                <FlexBetween>
                    <Box></Box>
                    <Typography
                        fontWeight={500}
                        color="#5499C7"
                        mr="1rem"
                    >   
                        {SheetData.length} 筆資料
                    </Typography>
                </FlexBetween>
            </Box>
        </Box>
    )
}