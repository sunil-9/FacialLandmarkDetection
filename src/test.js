import * as facemesh from "@tensorflow-models/facemesh";
import React, { useEffect, useState } from "react";
import * as facemesh from "@tensorflow-models/face-landmarks-detection";
import * as tf from '@tensorflow/tfjs';
function FaceMovementDetector() {
  const videoRef = React.useRef();
  const [predictions, setPredictions] = useState();
  const [prevPredictions, setPrevPredictions] = useState();
  const [threshold, setThreshold] = useState(50);
  const [net, setNet] = useState();

  useEffect(() => {
    async function loadNet() {
      const net = await facemesh.load(facemesh.SupportedPackages.mediapipeFacemesh);
      setNet(net);
    }
    loadNet();
  }, []);

  useEffect(() => {
    async function detectFaces() {
      const video = videoRef.current;
      const prediction = await net.estimateFaces(video);
      setPredictions(prediction);
      requestAnimationFrame(detectFaces);
    }
    if (net) {
      detectFaces();
    }
  }, [net, videoRef]);

  useEffect(() => {
    if (predictions && prevPredictions) {
      predictions.forEach((prediction, index) => {
        const prevPrediction = prevPredictions[index];
        if (prediction && prevPrediction) {
          const { mesh } = prediction;
          const { mesh: prevMesh } = prevPrediction;
          const nose = mesh[30];
          const prevNose = prevMesh[30];
          const dx = nose[0] - prevNose[0];
          const dy = nose[1] - prevNose[1];
          // you can use dx and dy to detect the direction of movement
          if (Math.abs(dx) > threshold) {
            if (dx > 0) {
              console.log("Right movement detected");
            } else {
              console.log("Left movement detected");
            }
          }
          if (Math.abs(dy) > threshold) {
            if (dy > 0) {
              console.log("Down movement detected");
            } else {
              console.log("Up movement detected");
            }
          }
        }
      });
    }
    setPrevPredictions(predictions);
  }, [predictions, prevPredictions]);

  return (
    <div>
      <video ref={videoRef} autoPlay />
    </div>
  );
}

export default FaceMovementDetector;
