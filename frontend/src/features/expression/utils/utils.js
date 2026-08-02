import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

export const init = async (landmarkerRef, setMood, setLoading) => {
    try {
        const vision = await FilesetResolver.forVisionTasks(
            "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );

        landmarkerRef.current =
            await FaceLandmarker.createFromOptions(vision, {
                baseOptions: {
                    modelAssetPath:
                        "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
                    delegate: "CPU", // More stable than GPU
                },
                outputFaceBlendshapes: true,
                runningMode: "VIDEO",
            });

        setMood("AI Ready 👌 Click button!");
        setLoading(false);
    } catch (err) {
        console.error(err);
        setMood("Failed to load AI model");
    }
};

export const runDetection = (landmarkerRef, webcamRef, setMood, calculateMood) => {
    if (!landmarkerRef.current) return null;
    if (!webcamRef.current?.video) return null;

    const video = webcamRef.current.video;

    if (video.readyState !== 4) {
        setMood("Webcam not ready");
        return null;
    }

    const results = landmarkerRef.current.detectForVideo(
        video,
        performance.now()
    );

    if (results.faceBlendshapes?.length > 0) {
        const detectedMood = calculateMood(
            results.faceBlendshapes[0].categories
        );
        setMood(detectedMood);
        return detectedMood;
    } else {
        setMood("No face detected");
        return null;
    }
};