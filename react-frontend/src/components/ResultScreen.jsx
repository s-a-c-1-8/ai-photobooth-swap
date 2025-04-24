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

    img.onload = () => {
      setTimeout(() => {
        setIsReady(true);
      }, 2000);
    };
  }, [result]);

  if (!result) return <p>No result found</p>;

  return (
    <div className="flex items-center justify-center min-h-screen px-6 py-10">
      <div className="flex flex-row items-center justify-evenly w-full max-w-[1600px] h-full space-x-12 transition-all duration-500">
        {!isReady ? (
          <div className="w-full text-center">
            <p className="font-bold text-[60px] text-white leading-tight">
              All set!
              <br /> Your avatar’s being prepared...
            </p>
          </div>
        ) : (
          <>
            <img
              src={result}
              alt="Face Swapped Result"
              className="max-h-[800px] object-contain rounded-2xl shadow-2xl"
            />
            <div className="flex flex-col items-center justify-center space-y-8 w-[35%]">
              <p className="text-white text-[30px] font-semibold text-center leading-snug">
                Your custom avatar is ready!
                <br />
                Scan the QR code to view or share it instantly.
              </p>
              <QRCode
                className="shadow-lg p-4 rounded-2xl bg-white cursor-pointer"
                value={result}
                onClick={() => navigate("/")}
                size={200}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ResultScreen;
