import WidgetWrapper from "../../components/WidgetWrapper"
import FlexBetween from "../../components/Flexbetween";
import { Typography,Divider } from "@mui/material";
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';
import { NormalSearchDropdown } from '../../components/SearchDropdown';
import { useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';


export const SheetProfile = ({
    sheetname,
    sheetlist,
    setFieldValue,
    disabled
}) =>{
    return(
        <WidgetWrapper>
            <FlexBetween
                pb="1.1rem"
            >
                <FlexBetween gap="1.5rem">
                    <ListAltOutlinedIcon 
                        sx={{fontSize:"25px"}}
                    />
                    <Typography
                        fontWeight="700"
                        fontSize="1rem"
                    >
                        {sheetname}
                    </Typography>
                </FlexBetween>
            </FlexBetween>
            <Divider />
            <FlexBetween
                p="1rem 0rem"
            >
                <FlexBetween
                    gap="3rem"
                >
                    <Typography
                        fontWeight="700"
                        fontSize="0.8rem"
                    >
                        Sheet 選擇
                    </Typography>
                    <FlexBetween
                        gap="1.2rem"
                    >

                        <NormalSearchDropdown 
                            fulldata={sheetlist}
                            name = {"sheet"}
                            sx = {{width:"200px"}}
                            setFieldValue={setFieldValue}
                            disabled = {disabled}
                        />
                        {
                            (disabled===true)&&(
                                <CircularProgress 
                                    size = {20}
                                />
                            )
                        }
                    </FlexBetween>

                </FlexBetween>
  
            </FlexBetween>
            <FlexBetween
                p="1rem 0rem"
            >
                <FlexBetween
                    gap="3rem"
                >
                <Typography
                    fontWeight="700"
                    fontSize="0.8rem"
                >
                    Sheet 數量
                </Typography>
                <Typography
                    fontWeight="700"
                    fontSize="0.8rem"
                    
                >
                    {sheetlist.length} 個 Sheet
                </Typography>
                </FlexBetween>
           </FlexBetween>
        </WidgetWrapper>
    )
}