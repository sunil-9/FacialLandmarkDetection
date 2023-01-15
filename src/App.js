import "@tensorflow/tfjs";
import React, { useEffect, useRef } from "react";
import "./App.css";
import * as facemesh from "@tensorflow-models/face-landmarks-detection";
import Webcam from "react-webcam";
import { drawMesh } from "./utilities";

function App() {
  const webcamRef = useRef(null);
  // const canvasRef = useRef(null);
  let prevPredictions = [];

  const runFacemesh = async () => {
    const net = await facemesh.load(
      facemesh.SupportedPackages.mediapipeFacemesh
    );
    setInterval(() => {
      detect(net);
    }, 10);
  };

  const detect = async (net) => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;
      // canvasRef.current.width = videoWidth;
      // canvasRef.current.height = videoHeight;
      const predictions = await net.estimateFaces({ input: video });
      if (prevPredictions.length > 0 && predictions.length > 0) {
        let curr_prediction = predictions[0].annotations;
        let prev_prediction = prevPredictions[0].annotations;
        let nosex = curr_prediction.noseLeftCorner[0][0];
        let prev_nosex = prev_prediction.noseLeftCorner[0][0];
        let nosey = curr_prediction.noseLeftCorner[0][1];
        let prev_nosey = prev_prediction.noseLeftCorner[0][1];
        let threshold = 10;
        if (nosex - prev_nosex > threshold) {
          console.log("Face moved left");
        } else if (prev_nosex - nosex > threshold) {
          console.log("Face moved right");
        }
        let thresholdy = 6;
        if (nosey - prev_nosey > thresholdy) {
          console.log("Face moved down");
        } else if (prev_nosey - nosey > thresholdy) {
          console.log("Face moved up");
        }
      }
      prevPredictions = predictions;
      // const ctx = canvasRef.current.getContext("2d");
      // requestAnimationFrame(() => {
      //   drawMesh(predictions, ctx);
      // });
    }
  };

  useEffect(() => {
    runFacemesh();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <Webcam
          ref={webcamRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480,
          }}
        />

        {/* <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480,
          }}
        /> */}
      </header>
    </div>
  );
}

export default App;
