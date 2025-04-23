import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";

const ResultScreen = () => {
  const location = useLocation();
  const { result } = location.state || {};
  const [isReady, setIsReady] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (!result) return;

    const img = new Image();
    img.src = result;

    // Load image in background
    img.onload = () => {
      // Wait for 5 seconds before showing
      setTimeout(() => {
        setIsReady(true);
      }, 2000);
    };
  }, [result]);

  if (!result) return <p>No result found</p>;

  return (
    <div className="flex items-center justify-center min-h-screen mt-[60px]">
      <div className="w-full max-w-[1200px] min-h-[800px] flex items-center justify-evenly transition-all duration-500">
        {!isReady ? (
          <div className="flex flex-col items-center justify-center w-full">
            <p className="text-center font-bold text-[80px] text-[#fff]">
              All set!
              <br /> Your avatar’s been shared.
            </p>
          </div>
        ) : (
          <>
            <h1 className="font-bold text-[80px] text-[#fff] absolute top-[100px] left-[600px]">
              Share Your Avatar
            </h1>
            <img
              src={result}
              alt="Face Swapped Result"
              className="max-w-[700px] max-h-[700px] object-contain rounded-2xl shadow-lg"
            />
            <QRCode
              className=" h-auto max-w-[200px] max-h-[200px] shadow-lg p-2 bg-amber-50"
              value={result}
              onClick={() => navigate("/")}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default ResultScreen;
