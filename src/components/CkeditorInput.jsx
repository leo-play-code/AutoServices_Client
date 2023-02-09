// ckeditor
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useState } from 'react';
import { FormHelperText,Box } from '@mui/material';
import { useSelector } from 'react-redux';
import { urlpath } from '../state';
export const  createMarkup = (data)=>{
    return {__html: data};
  }
  



export const CkeditorInput= ({
    name,
    label,
    disabled,
    sx,
    value,
    setFieldValue,
    error,
    otherfunc,
    setheight
})=>{

    const mode = useSelector((state)=>(state.mode))

    return(
        <span className={((mode==="dark")?"ckeditor-dark CkeditorInput":"CkeditorInput")} style={sx}>
            <CKEditor
                editor={ ClassicEditor }
                data={value}
                
                config ={
                    {
                        ckfinder:{
                            uploadUrl:`${urlpath}uploads/images`
                        },
                        placeholder: label,
                    }
                }
                onReady={ editor => {
                    // You can store the "editor" and use when it is needed.
                    // console.log( 'Editor is ready to use!', editor );
                    if (setheight){
                        editor.editing.view.change((writer) => {
                            writer.setStyle(
                                "max-height",
                                setheight,
                                editor.editing.view.document.getRoot()
                            );
                        });
                    }
                    
                }}
                onChange={ ( event, editor ) => {
                    const data = editor.getData();
                    // console.log( { event, editor, data } );
                    try{
                        setFieldValue(name,data)
                    }catch{

                    }
                    try{
                        otherfunc(data)
                    }catch{

                    }
                    
                    
                } }
                onBlur={ ( event, editor ) => {
                    // console.log( 'Blur.', editor );
                } }
                onFocus={ ( event, editor ) => {
                    // console.log( 'Focus.', editor );
                } }
                disabled = {disabled}
            />
            {error &&(
                <Box
                    mt="0.5rem"
                    ml="1rem"
                >
                    <FormHelperText sx={{color:"#d32f2f"}}>required</FormHelperText>
                </Box>
            )}
            
        </span>
    )
}


export const FormCkeditorInput = ({
    label,
    name,
    setFieldValue,
    value,
    error,
    sx
})=>{
    
    return (
        <CkeditorInput 
            label = {label}
            name = {name}
            setFieldValue = {setFieldValue}
            value = {value}
            error = {error}
            sx = {sx}
        />
    )
}