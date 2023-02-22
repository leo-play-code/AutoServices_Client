import { BasicModal } from "./modal"
import { useSelector } from 'react-redux';
import { 
    Box,
    Typography,
    useTheme,
    Paper,
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableCell,
    TableRow,
    Divider
} from "@mui/material";
import { DateFormat } from "../scenes/widgets/PostBodyWidget";
import FlexBetween from "./Flexbetween";
import { createMarkup } from "./CkeditorInput";
import FlexBetweenTop from './FlexBetweenTop';
const Table_Model = ({
    sx,
    head,
    body
})=>{
    const theme = useTheme();
    const alt  = theme.palette.background.alt;
    return (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={sx}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        {head}
                    </TableHead>
                    <TableBody>
                        {body}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    )
}


const HistoryTable = ({
    formdata
})=>{
    const dt = new Date();
    const windowheight = useSelector((state)=>state.height);
    const columns = ['User','資料','時間']
    const {form,history} = formdata;
    const windowwidth = useSelector((state)=>state.width);
    const {schema} = form;
    return(
        <Table_Model
            sx={{maxHeight:windowheight*0.55}}
            head={
                <TableRow>
                    {
                        columns.map((data)=>{
                            return(
                                <TableCell
                                    key={`Header-${data}`}
                                    style={{ minWidth: 10 }}
                                >
                                    {data}
                                </TableCell>
                            )
                        })
                    }
                </TableRow>
               
            }
            body={
                Object.entries(history).map(([key,value])=>{
                    return(
                        <TableRow
                            key={`Row-${key}`}
                        >
                            <TableCell>{value['user']}</TableCell>
                            <TableCell>
                                {
                                    Object.entries(value['data']).map(([key,value])=>{
                                        const {label,field,fulldata} = schema[key];
                                        return (
                                            <Box
                                                key={`Cell-${key}`}
                                                mt="0.4rem"
                                            >
                                                <FlexBetweenTop
                                                    
                                                >   
                                                    <FlexBetween
                                                        gap="1rem"
                                                    >
                                                        <Box
                                                            sx={{
                                                                color:"#3498DB",
                                                                width:"10rem"
                                                            }}
                                                        >{label}:</Box>
                                                        <FlexBetweenTop
                                                            width={windowwidth*0.4}
                                                        >
                                                            
                                                            {field==='select-color'? <Box>{fulldata[value['orignal']]}</Box>:( <Box>
                                                                <span 
                                                                    className="CkeditorInput"
                                                                    dangerouslySetInnerHTML={createMarkup(value['orignal'].replaceAll('\n','<br />'))}
                                                                ></span>

                                                            </Box>)}
                                
                                                            <Box>
                                                                {field==='select-color'? <Box
                                                                    ml="3rem"
                                                                >{fulldata[value['now']]}</Box>:( <Box
                                                                
                                                                    ml="3rem"
                                                                >

                                                                    <span 
                                                                        className="CkeditorInput"
                                                                        dangerouslySetInnerHTML={createMarkup(value['now'].replaceAll('\n','<br />'))}
                                                                    ></span>
                                                                </Box>)}
                                                            </Box>         
                                                        </FlexBetweenTop>      

                                                    </FlexBetween>
                                                                                    
                                                </FlexBetweenTop>
                                                {/* <Divider /> */}
                                            </Box>
                                        )
                                    })
                                }
                            </TableCell>
                            <TableCell>{DateFormat(value['updateTime'])[1]}</TableCell>
                        </TableRow>
                    )
                })
            }
        >

        </Table_Model>
    )
}


const HistoryModel = ({
    formdata,
    title,

})=>{
    const windowheight = useSelector((state)=>state.height);
    const windowwidth = useSelector((state)=>state.width);
    return(
        <BasicModal
            modelsx = {{
                m:'auto' ,
                width:windowwidth*0.7,
                overflow:"scroll",
                bgcolor: 'background.paper',
                borderRadius:"10px",
                boxShadow: 24,
                p: 4,
                mt : windowheight*0.01
            }}
            title={title}
            body={
                <>
                    <Box
                        mb="1rem"
                    >
                        <Typography
                            fontWeight="700"
                            fontSize="2rem"
                        >
                            History
                        </Typography>
                    </Box>
                    <HistoryTable 
                        formdata={formdata}
                    />
                </>
            }
        >

        </BasicModal>
    )
}


export default HistoryModel;