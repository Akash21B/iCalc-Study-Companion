import { useRef, useState,useEffect } from 'react';
// import { SWATCHES } from '@/constants'; // Assuming you have the correct baseUrl and paths set up
import { SWATCHES } from '../../../constants';  // Relative path based on your current file location
import { ColorSwatch, Group } from '@mantine/core';
import { Button } from '@/components/ui/button';  // Corrected import statement
import axios from 'axios';  // Correct axios import


// Response interface
interface Response {
  expr: string;
  result: string;
  assign: boolean;
}

// GeneratedResult interface
interface GeneratedResult {
  expression: string;
  answer: string;
}



export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('rgb(255, 255, 255)');
   const [reset, setReset] = useState(false);
   // Using useState with an optional GeneratedResult type
const [result, setResult] = useState<GeneratedResult | undefined>(); // Initially undefined

// Using useState with an empty object as the initial value for dictOfVars
const [dictofVars, setDictOfVars] = useState<Record<string, any>>({});


   useEffect(() => {
    if (reset) {
      resetCanvas(); // Call the resetCanvas function when reset is true
      setReset(false); // Reset the state back to false after resetting the canvas
    }
  }, [reset]); // Dependency array ensures this runs only when reset changes

    useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight - canvas.offsetTop;
            ctx.lineCap = 'round';
            ctx.lineWidth = 3;
        }
    }
}, []);  // Added empty dependency array to ensure this runs once on component mount

const sendData = async () => {
    const canvas = canvasRef.current; // Corrected variable declaration
    if (canvas) {
        const response = await axios({
            method: 'post',
            url: `${import.meta.env.VITE_API_URL}/calculate`, // Fixed template literal
            data: {
                image: canvas.toDataURL('image/png'),
                dict_of_vars: dictofVars // Assuming this is defined in your state
            }
        });
         const resp = await response.data; // Await the response data
                console.log('Response:', resp); // Log the response
    }
};


     const resetCanvas = () => {
  const canvas = canvasRef.current; // Fixed the syntax here
  if (canvas) {
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the entire canvas
    }
  }
};


  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.style.background = 'black';
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.beginPath();
        ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        setIsDrawing(true);
      }
    }
  };
  const stopDrawing = () => {
    setIsDrawing(false);
};
const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) {
        return;
    }

    const canvas = canvasRef.current;
    if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.strokeStyle = color;
            ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
            ctx.stroke();
        }
    }
};


  return (
  <>
  <div className='grid grid-cols-3 gap-2'>
    <Button
        onClick={() => setReset(true)} // Fixed parentheses
        className='z-20 bg-black text-white'
        variant='default'
        color='black'
    >
        Reset {/* Correctly placed text inside the button */}
    </Button>
    <Group className='z-20'>
    {SWATCHES.map((swatchColor: string) => (  // Fixed the arrow function syntax
        <ColorSwatch
            key={swatchColor}  // Fixed square bracket to curly brace
            color={swatchColor}  // Fixed parentheses to curly brace
            onClick={() => setColor(swatchColor)}  // Fixed square bracket to curly brace
        />
    ))}
</Group>
<Button
    onClick={sendData}
    className='z-20 bg-black text-white'  // Fixed class name to remove extra character
    variant='default'
    color='black'
>
    Calculate  {/* Placed text inside the button */}
</Button>

</div>

    <canvas
      ref={canvasRef}  // Corrected bracket
      id="canvas"
      className="absolute top-0 left-0 w-full h-full"
      onMouseDown={startDrawing}  // Corrected event binding
      onMouseOut={stopDrawing}  // Corrected event binding
      onMouseUp={stopDrawing}  // Corrected bracket
      onMouseMove={draw}  // Corrected event binding
    />
  </>
);

}
