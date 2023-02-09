import BodyBox from "../../components/bodyBox"
import { Box } from "@mui/material";
import Navbar from "../navbar";





const GooglesheetPage = () =>{
    return (
        <Box>
            <Navbar />
            <BodyBox
                padding="2rem 2%"
                display={"block"}
                gap="0.5rem"
                justifyContent="space-between"
            >

            </BodyBox>
        </Box>
        
    )


}

export default GooglesheetPage;