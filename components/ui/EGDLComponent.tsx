import { Box } from '@chakra-ui/react';
import { FC, useEffect, useState } from 'react';

interface EGLDComponentProps {

}

export const EGLDComponent: FC<EGLDComponentProps> = ({ }) => {
    const [egldValue, setEgldValue] = useState("");

    useEffect(() => {
        if (egldValue[0] !== ".") {
            setEgldValue(egldValue.replace(/[^\d.]/g, ''))
          if (egldValue[egldValue.length - 1] === "." && egldValue.slice(0, -1).includes(".") === true) {
            setEgldValue(egldValue.slice(0, -1))
          }
        } else {
            setEgldValue(egldValue.substring(1))
        }
      }, [egldValue])
    
    return (
        <div className='egldInputComponent'>
            <div>
                <img src="/egldimage.jpg" alt="MultiversX Logo" />
                <h2>EGLD</h2>
            </div>
            <input type="text" placeholder='0.0' value={egldValue} onChange={(e)=>{
                setEgldValue(e.target.value);
            }}/>
        </div>
    );
};