import React, { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";
import { runDetection ,init} from "../utils/utils";

const FaceDetection = ({onMoodDetected = () => {}}) => {
  const webcamRef = useRef(null);
  const landmarkerRef = useRef(null);
  const [mood, setMood] = useState("Initializing AI...");
  const [loading, setLoading] = useState(true);

  const calculateMood = (blendshapes) => {
    const scores = {};
    blendshapes.forEach((b) => {
      scores[b.categoryName] = b.score;
    });

    if (scores["jawOpen"] > 0.1 && scores["browInnerUp"] > 0.1)
      return " SURPRISED";

    if (
      scores["mouthSmileLeft"] > 0.4 ||
      scores["mouthSmileRight"] > 0.4
    )
      return " HAPPY";

    if (
      scores["mouthFrownLeft"] > 0.2 ||
      scores["mouthFrownRight"] > 0.2
    )
      return " SAD";

    if (scores["browDownLeft"] > 0.4 || scores["browDownRight"] > 0.4)
      return " ANGRY";

    return "😐 NEUTRAL";
  };

  // Initialize AI
  useEffect(() => {
    

    init(landmarkerRef,setMood,setLoading);
  }, []);

  function handleclick(){
      const expression = runDetection(landmarkerRef,webcamRef,setMood,calculateMood)
      if (expression) {
        onMoodDetected(expression)
      }
  }
  

  return (
    <div
      style={{
        textAlign: "center",
        background: "#111",
        color: "#fff",
        padding: "30px",
        borderRadius: "15px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "40px",
      }}
    >
      <Webcam
        ref={webcamRef}
        mirrored
        audio={false}
        style={{
          width: 400,
          borderRadius: "10px",
          border: "2px solid #333",
        }}
      />

      <div>
        <button
         onClick={handleclick}
          disabled={loading}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            borderRadius: "8px",
            border: "none",
            background: "#333",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          {loading ? "Loading..." : "Get Expression"}
        </button>

        <h2 style={{ marginTop: "20px" }}>{mood}</h2>
      </div>
    </div>
  );
};

export default FaceDetection;