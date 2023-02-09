
import { Box } from '@mui/material';
import userprofile from '../assets/userprofile.png'
const UserImage = ({image,size="60px"})=>{
    return(
        <Box width={size} height={size}>
            <img 
                style={{objectFit:"cover",borderRadius:"50%"}}
                width={size}
                height={size}
                alt="user"
                src={image===""?userprofile:image}
            />
            
        </Box>
    )
}

export default UserImage;