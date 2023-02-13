import { 
    Box,
    Typography,
    IconButton,
    Divider
} from "@mui/material";
import { NumberCovertLetter } from "./TableWidget";
import FlexBetween from "../../components/Flexbetween";
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import AddIcon from '@mui/icons-material/Add';
const FilterWidget = ({
    SheetData
})=>{
    var column = 0
    for (const num in SheetData){
        if (SheetData[num].length>column){
            column = (SheetData[num].length)
        }
    }
    const titlelist = []
    for (var i=1 ; i<=column ;i++){
        const temp =NumberCovertLetter(i)
        titlelist.push(temp)
    }
    console.log('titlelist',titlelist)
    return(
        <Box>
            <FlexBetween
                pb="1.1rem"
            >
                <FlexBetween
                    gap="1.5rem"
                >
                    <FilterAltIcon 
                        sx={{fontSize:"25px"}}
                    />
                    <Typography
                        fontWeight="700"
                        fontSize="1rem"
                    >
                        Filter
                    </Typography>
                </FlexBetween>
                <FlexBetween
                    gap="1.5rem"
                >
                    <IconButton>
                        <AddIcon 
                            sx={{
                                fontSize:"25px"
                            }}
                        />
                    </IconButton>
                    <IconButton
                    
                    >
                        <RestartAltIcon 
                            sx={{fontSize:"25px"}}
                        />
                    </IconButton>
                </FlexBetween>
                
            </FlexBetween>
            <Divider />
            <FlexBetween
                mt="1.5rem"
            >
                
            </FlexBetween>
        </Box>
    )
}

export default FilterWidget;