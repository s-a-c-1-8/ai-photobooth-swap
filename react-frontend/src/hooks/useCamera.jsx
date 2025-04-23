import React, { useRef, useState, useEffect } from "react";

const Camera = ({ onCapture, onSubmit }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isCameraReady, setIsCameraReady] = useState(false);

  // Shared start camera function
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "back" },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setStream(mediaStream);
      setIsCameraReady(true);
    } catch (err) {
      console.error("Camera access denied:", err);
      alert("Camera access denied. Please allow access to continue.");
    }
  };

  useEffect(() => {
    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []); // empty dependency to only run once

  const handleCapture = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    const width = video.videoWidth;
    const height = video.videoHeight;

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, width, height);

    const imageData = canvas.toDataURL("image/png");
    setCapturedImage(imageData);
    onCapture(imageData);
  };

  const handleRetake = async () => {
    setCapturedImage(null);
    await startCamera(); // Restart the camera
  };

  const handleSubmit = () => {
    if (capturedImage && onSubmit) {
      onSubmit(capturedImage);
    }
  };

  return (
    <>
      {!capturedImage ? (
        <div className="w-full h-full relative flex justify-center items-center">
          {isCameraReady ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="rounded-xl w-[960px] h-[540px] object-cover shadow-2xl"
            />
          ) : (
            <div className="flex justify-center items-center gap-[50px] flex-wrap">
              <span class="loader"></span>
            </div>
          )}
          <button
            onClick={handleCapture}
            className="absolute top-[900px] left-[792px] bg-amber-50 w-[337px] h-[86px] cursor-pointer rounded-[100px] text-[35px] text-center font-bold text-[#1C5393] hover:scale-105 transition-all duration-300"
          >
            CAPTURE
          </button>
        </div>
      ) : (
        <div className="w-full h-full relative flex flex-col justify-center items-center">
          <img
            src={capturedImage}
            alt="Captured"
            className="rounded-xl w-[960px] h-[540px] object-cover shadow-2xl"
          />
          <button
            onClick={handleRetake}
            className="absolute top-[900px] left-[492px] bg-amber-50 w-[337px] h-[86px] cursor-pointer rounded-[100px] text-[35px] text-center font-bold text-[#1C5393] hover:scale-105 transition-all duration-300"
          >
            RETAKE
          </button>
          <button
            onClick={handleSubmit}
            className="absolute top-[900px] left-[1092px] bg-amber-50 w-[337px] h-[86px] cursor-pointer rounded-[100px] text-[35px] text-center font-bold text-[#1C5393] hover:scale-105 transition-all duration-300"
          >
            NEXT
          </button>
        </div>
      )}
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </>
  );
};

export default Camera;
