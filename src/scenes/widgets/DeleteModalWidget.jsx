import { BasicModal } from "../../components/modal"
import { IconButton, Tooltip ,Typography,Button} from "@mui/material";
import FlexBetween from "../../components/Flexbetween";
import DeleteIcon from '@mui/icons-material/Delete';
import { useSelector, useDispatch } from 'react-redux';
import { Box } from "@mui/system";
import { DateFormat, PostBody } from "./PostBodyWidget";
import { setForms } from "../../state";
import { DeleteFormData } from "../../api/formdata";
import { StoreContext } from "../../state/store";
import { useContext } from "react";
import { UpdateFormModel } from '../../api/formmodel';



const DeleteModalWidget = ({
    formdata,
    title,
    otherfunc,
}) =>{
    const {storeuserforms,storeformmodels} = useContext(StoreContext);
    const [formmodels,setFormmodels] = storeformmodels;
    const [userforms,setUserforms] = storeuserforms;
    const formmodel = formmodels.filter((formmodel)=>formmodel['_id'] === formdata['form']['_id'])[0]
    console.log('formmodel',formmodels,formmodel)
    console.log('form name',formdata['form']['_id'])
    const schema = formmodel['schema'];
    // console.log('delete data',formdata)
    const token = useSelector((state)=>state.token);
    const windowheight = useSelector((state)=>state.height);
    const dispatch = useDispatch();
    const toggleDelete = async(id) =>{
        const tempformmodel = {...formmodel}
        tempformmodel['number']= formmodel['number']-1
        UpdateFormModel(token,tempformmodel,formdata['form']['name']);
        const tempformmodels = formmodels.filter((formmodel)=>formmodel['name']!==formdata['form']['name'])
        tempformmodels.push(tempformmodel)
        setFormmodels(tempformmodels)
        const data =  DeleteFormData(token,id)    
        try {
            otherfunc()
        } catch (error) {

        }
    }
    return (
        <BasicModal
            modelsx = {{
                m:'auto' ,
                width:"900px",
                overflow:"scroll",
                bgcolor: 'background.paper',
                borderRadius:"10px",
                boxShadow: 24,
                p: 4,
                mt : windowheight*0.01
            }}
            title = {
                title
            }
            body={
                <>
                    <Box>
                        <Typography
                            fontWeight="700"
                            fontSize="2rem"
                        >
                            刪除表單資料
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            height:"500px",
                            maxHeight:"500px",
                            overflow:"scroll"
                        }}
                    >
                        <PostBody 
                            formmodel={schema}
                            data = {formdata}
                            showlimit = {false}
                        />
                    </Box>
                    <FlexBetween
                        mt="1rem"
                    >
                        <Box>

                        </Box>
                        <Button
                            color={"error"}
                            onClick={()=>toggleDelete(formdata["_id"])}
                        >
                            確認刪除
                        </Button>
                    </FlexBetween>
                </> 
                
            }
        >
        
        </BasicModal>
    )
}

export default DeleteModalWidget ; 