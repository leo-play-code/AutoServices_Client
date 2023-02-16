import { 
    Box,
} from "@mui/material"
import { useContext } from "react";
import { StoreContext } from "../../state/store";

const ShowData = ({
    filtermode
}) =>{
    const {storeforms,storeformmodels} = useContext(StoreContext);
    return (
        <Box>
            
        </Box>
    )
}

export default ShowData;