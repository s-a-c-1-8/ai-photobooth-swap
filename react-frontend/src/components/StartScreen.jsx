import React from "react";
import { useNavigate } from "react-router-dom";
import firstBg from "../assets/firstBg.png";

const StartScreen = () => {
  const navigate = useNavigate();
  const goToGender = () => {
    navigate("/gender-selection");
  };

  return (
    <>
      <img src={firstBg} alt="firstBg" className="w-full h-full relative" />
      <button
        className="absolute top-[646px] left-[792px] bg-amber-50 w-[337px] h-[86px] cursor-pointer rounded-[100px] text-[35px] text-center font-bold text-[#1C5393] hover:scale-105 transition-all duration-300"
        onClick={goToGender}
      >
        BEGIN
      </button>
    </>
  );
};

export default StartScreen;
