import { useState } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';


export default function TableMenu({name,togglefiltertable}) {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = (scending) => {
        setAnchorEl(null);
        togglefiltertable(name,scending)
    };

    return (
        <div>
            <MoreVertIcon 
                sx={{
                    "&:hover":{
                        cursor:"pointer",
                            
                    }
                }}
                onClick={handleClick}
            />
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={()=>setAnchorEl(null)}
                MenuListProps={{
                'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem onClick={()=>handleClose('asc')}>Ascending</MenuItem>
                <MenuItem onClick={()=>handleClose('des')}>Descending</MenuItem>
            </Menu>
        </div>
    );
}

