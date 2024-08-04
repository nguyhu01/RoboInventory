import React, { useState, useRef } from 'react';
import { Button, Box, Typography } from '@mui/material';
import { Camera } from 'lucide-react';
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';

const ImageCapture = ({ onClassification }) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const startCapture = async () => {
    setIsCapturing(true);
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
    videoRef.current.srcObject = stream;
  };

  const captureImage = async () => {
    const context = canvasRef.current.getContext('2d');
    context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
    const imageData = context.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
    
    // Load MobileNet model
    const model = await mobilenet.load();
    
    // Classify the image
    const tensor = tf.browser.fromPixels(imageData);
    const predictions = await model.classify(tensor);
    
    // Get the top prediction
    const topPrediction = predictions[0];
    
    onClassification(topPrediction.className);
    setIsCapturing(false);
  };

  return (
    <Box>
      {!isCapturing ? (
        <Button variant="contained" startIcon={<Camera />} onClick={startCapture}>
          Capture Item
        </Button>
      ) : (
        <Box>
          <video ref={videoRef} autoPlay style={{ width: '100%', maxWidth: '500px' }} />
          <canvas ref={canvasRef} style={{ display: 'none' }} width={500} height={500} />
          <Button variant="contained" onClick={captureImage}>
            Classify Item
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default ImageCapture;