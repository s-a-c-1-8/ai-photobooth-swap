import React, { useState } from "react";
import Camera from "../hooks/useCamera";
import { useLocation, useNavigate } from "react-router-dom";
import { uploadCapturedImage } from "../utils/api";
import LoadingScreen from "./LoadingScreen";

const CameraCaptureScreen = ({ onImageCaptured, onFinalSubmit }) => {
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const { character } = location.state || {};
  const { gender } = location.state || {};
  const navigate = useNavigate();

  const handleCapture = (imageData) => {
    console.log("Image captured:", imageData);
    onImageCaptured?.(imageData);
  };

  const handleSubmit = async (imageData) => {
    console.log("Submitting image...");
    setLoading(true);
    try {
      const result = await uploadCapturedImage(imageData, gender, character);
      console.log("Image uploaded successfully:", result.url); // should show { url: "..." }

      navigate("/result", { state: { result: result.url } });
    } catch (error) {
      setLoading(false);
      alert("Failed to upload image. Please try again.");
      console.error(error);
    }
  };

  return (
    <>
      {loading ? (
        <LoadingScreen />
      ) : (
        <Camera onCapture={handleCapture} onSubmit={handleSubmit} />
      )}
    </>
  );
};

export default CameraCaptureScreen;
