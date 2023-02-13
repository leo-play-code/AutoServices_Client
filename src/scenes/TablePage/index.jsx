
import Navbar from '../navbar/index';
import BodyBox from '../../components/bodyBox';
import { Box } from '@mui/system';
import WidgetWrapper from '../../components/WidgetWrapper';
import Table_Pro from '../../components/Table_Pro';

const TablePage = ()=>{
    return (
        <Box>
            <Navbar />
            <BodyBox
                padding="2rem 2%"

            >
                <Box
                    mt= "2rem"
                    width="1000px"
                >
                    {/* <WidgetWrapper> */}
                        <Table_Pro>

                        </Table_Pro>

                    {/* </WidgetWrapper> */}
                </Box>
                
            </BodyBox>
        </Box>
    )
}

export default TablePage;