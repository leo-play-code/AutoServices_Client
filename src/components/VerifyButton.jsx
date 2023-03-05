import { Button } from "@mui/material";
import { useState,useEffect } from "react";
const VerifyButton = ({
    otherfunc,
    disabled
}) =>{
    const [timeLeft, setTimeLeft] = useState(60);
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        let timerId;
        if (isRunning && timeLeft > 0) {
            timerId = setTimeout(() => {
            setTimeLeft((prevTime) => prevTime - 1);
            }, 1000);
        } else {
            setIsRunning(false);
        }
        return () => clearTimeout(timerId);
    }, [isRunning, timeLeft]);

    const handleClick = () => {
        if (!isRunning) {
            setIsRunning(true);
            setTimeLeft(60);
            otherfunc()
        }
    };
    return (
        <Button 
            variant="contained"
            onClick={handleClick}
            color= {(isRunning)?"warning":"primary"}
            disabled = {disabled||isRunning}
        >
            {isRunning ? `${timeLeft}s` : '驗證碼'}
        </Button>
    );
}


export default VerifyButton;