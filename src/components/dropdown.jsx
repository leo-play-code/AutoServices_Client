import styled from "@emotion/styled";
import { Box, IconButton } from "@mui/material";
import { useRef } from "react";
import { useState, useEffect } from 'react';
import Tooltip from '@mui/material/Tooltip';
export const DropdownContainer = styled(Box)({
    position:"absolute",
    zIndex:'100',
    borderRadius:"10px",
    boxShadow:'0px 8px 16px 0px rgba(0,0,0,0.2)',
})

export const Dropdownlabel = styled(Box)({

})


export const Dropdown = ({ref_active,title,label,child})=>{
    const [show,setShow] = useState(false);
    const dropdownRef = useRef();
    
    useEffect(()=>{
        const closedropdown_effect = e =>{
            if (!("path" in Event.prototype)){
                Object.defineProperty(Event.prototype, "path", {
                    get: function() {
                            var path = [];
                            var currentElem = this.target;
                            while (currentElem) {
                                path.push(currentElem);
                                currentElem = currentElem.parentElement;
                            }
                            if (path.indexOf(window) === -1 && path.indexOf(document) === -1)
                            path.push(document);
                            if (path.indexOf(window) === -1)
                            path.push(window);
                        return path;
                    }
                });
                
            }
            var temp = false;
            for(var num in e.path){
                temp = temp || (e.path[num]===dropdownRef.current)
                if (temp===true){return}
            }
            if (!temp){
                setShow(false)
            }
        }
        if (!ref_active){
            document.body.addEventListener('click',closedropdown_effect);  
        }
        
    },[])
    return(
        <Box ref={dropdownRef}
        >
            <Tooltip title={title}>
                <IconButton onClick ={()=>{setShow(!show)}}>
                    {label}
                </IconButton>
            </Tooltip>
            {
                show&&
                    <DropdownContainer
                    >
                        {child}
                    </DropdownContainer>
                
            }            
        </Box>
    )
}